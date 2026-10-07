
import React from 'react';
import { AgentOutput } from '../types';
import { DocumentTextIcon, LightBulbIcon, ExclamationTriangleIcon, BoltIcon, ArchiveBoxIcon, BeakerIcon } from './IconComponents';

interface OutputDisplayProps {
  output: AgentOutput;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div className="text-gray-400 text-sm space-y-2">
            {children}
        </div>
    </div>
);

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  const { summary, criticalPath, riskAssessment, learningUpdates, actions, artifacts } = output;

  return (
    <div className="space-y-6">
      <InfoCard title="Execution Summary" icon={<DocumentTextIcon className="w-5 h-5 text-indigo-400"/>}>
        <p>{summary}</p>
      </InfoCard>

      <InfoCard title="Critical Path" icon={<BoltIcon className="w-5 h-5 text-yellow-400"/>}>
        <div className="flex flex-wrap gap-2">
            {criticalPath.map((nodeId) => (
                <span key={nodeId} className="px-2 py-1 bg-yellow-900/50 text-yellow-300 text-xs font-medium rounded-full">
                    {nodeId}
                </span>
            ))}
        </div>
      </InfoCard>

      <InfoCard title="Risk Assessment" icon={<ExclamationTriangleIcon className="w-5 h-5 text-red-400"/>}>
        <p>{riskAssessment}</p>
      </InfoCard>

      <InfoCard title="Learning Updates" icon={<LightBulbIcon className="w-5 h-5 text-lime-400"/>}>
        <p>{learningUpdates}</p>
      </InfoCard>

      <InfoCard title="Proposed Actions" icon={<BeakerIcon className="w-5 h-5 text-cyan-400"/>}>
        <ul className="list-disc list-inside space-y-2">
            {actions.map((action) => (
                <li key={action.id}>
                    <strong className="text-gray-300">{action.tool}</strong> on node <span className="font-mono text-cyan-300">{action.nodeId}</span>
                    <pre className="text-xs bg-gray-900 p-2 rounded-md mt-1 overflow-x-auto">
                        {JSON.stringify(action.params, null, 2)}
                    </pre>
                </li>
            ))}
        </ul>
      </InfoCard>

       <InfoCard title="Created Artifacts" icon={<ArchiveBoxIcon className="w-5 h-5 text-pink-400"/>}>
        <ul className="list-disc list-inside space-y-2">
            {artifacts.map((artifact) => (
                <li key={artifact.id}>
                    <strong className="text-gray-300">{artifact.type}</strong> for node <span className="font-mono text-pink-300">{artifact.nodeId}</span>
                    <p className="text-xs bg-gray-900 p-2 rounded-md mt-1">{artifact.content}</p>
                </li>
            ))}
        </ul>
      </InfoCard>

    </div>
  );
};

export default OutputDisplay;
