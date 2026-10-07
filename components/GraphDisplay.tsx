
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Node, Edge } from '../types';

declare const d3: any;

interface GraphDisplayProps {
  nodes: Node[];
  edges: Edge[];
  criticalPath: string[];
}

const NODE_COLORS: Record<string, string> = {
  goal: '#6366f1', // indigo-500
  task: '#22d3ee', // cyan-400
  milestone: '#facc15', // yellow-400
  input: '#a3e635', // lime-400
  output: '#f472b6', // pink-400
  default: '#9ca3af', // gray-400
};

const GraphDisplay: React.FC<GraphDisplayProps> = ({ nodes, edges, criticalPath }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [graphData, setGraphData] = useState({ nodes, edges });

  const criticalPathSet = useMemo(() => new Set(criticalPath), [criticalPath]);

  useEffect(() => {
    setGraphData({ nodes, edges });
  }, [nodes, edges]);

  useEffect(() => {
    if (!graphData.nodes.length || !svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.edges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(0, 0))
      .force('x', d3.forceX().strength(0.05))
      .force('y', d3.forceY().strength(0.05));

    const g = svg.append('g');

    const link = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(graphData.edges)
      .join('line')
      .attr('stroke-width', 1.5);

    const node = g.append('g')
      .selectAll('g')
      .data(graphData.nodes)
      .join('g')
      .call(drag(simulation) as any);
      
    node.append('circle')
      .attr('r', d => criticalPathSet.has(d.id) ? 12 : 8)
      .attr('fill', d => NODE_COLORS[d.type] || NODE_COLORS.default)
      .attr('stroke', d => criticalPathSet.has(d.id) ? '#f59e0b' : '#fff') // amber-500
      .attr('stroke-width', d => criticalPathSet.has(d.id) ? 3 : 1.5);

    node.append('text')
      .text(d => d.label)
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', '#e5e7eb')
      .style('font-size', '12px')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    const zoomHandler = d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    });

    svg.call(zoomHandler as any);

    return () => {
      simulation.stop();
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData, criticalPathSet]);
  
  const drag = (simulation) => {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-lg">
      <svg ref={svgRef}></svg>
       <div className="absolute bottom-2 left-2 bg-gray-900/50 p-2 rounded-md text-xs">
          <div className="font-bold mb-1">Legend</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(NODE_COLORS).filter(([key]) => key !== 'default').map(([type, color]) => (
              <div key={type} className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="capitalize text-gray-300">{type}</span>
              </div>
            ))}
          </div>
       </div>
    </div>
  );
};

export default GraphDisplay;
