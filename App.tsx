
import React, { useState, useCallback } from 'react';
import { AgentOutput, ApprovalLevel } from './types';
import Header from './components/Header';
import ProjectInputForm from './components/ProjectInputForm';
import GraphDisplay from './components/GraphDisplay';
import OutputDisplay from './components/OutputDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generateProjectPlan } from './services/geminiService';
import { BrainCircuitIcon, RocketIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<AgentOutput | null>(null);

  const handleGenerate = useCallback(async (
    goal: string,
    projectContext: string,
    availableTools: string,
    approvalLevel: ApprovalLevel
  ) => {
    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await generateProjectPlan({
        goal,
        context: projectContext,
        tools: availableTools,
        approvalLevel,
      });
      setOutput(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8">
          <ProjectInputForm onSubmit={handleGenerate} isLoading={isLoading} />
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-gray-400">Agent is reasoning...</p>
              <p className="text-sm text-gray-500">Forming cross-domain lattice and deriving macro-attractors.</p>
            </div>
          )}
          {error && (
            <div className="text-center p-8 bg-red-900/20 border border-red-700 text-red-300 rounded-xl">
              <h3 className="text-xl font-bold">Error</h3>
              <p>{error}</p>
            </div>
          )}
          {output && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-3 bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-4 h-[70vh] min-h-[600px] flex flex-col">
                 <h2 className="text-xl font-bold text-gray-100 mb-2 flex items-center gap-2">
                    <BrainCircuitIcon className="w-6 h-6 text-cyan-400"/>
                    Project Node Graph
                </h2>
                <GraphDisplay 
                  nodes={output.nodes} 
                  edges={output.edges} 
                  criticalPath={output.criticalPath} 
                />
              </div>
              <div className="xl:col-span-2">
                <OutputDisplay output={output} />
              </div>
            </div>
          )}
          {!isLoading && !output && !error && (
            <div className="text-center py-16 px-8 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                <RocketIcon className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold text-gray-300">Ready to Co-Pilot Your Project</h2>
                <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                    Define your high-level goal, provide context, and watch the autonomous agent construct a detailed, executable plan.
                </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
