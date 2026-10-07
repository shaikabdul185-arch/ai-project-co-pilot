
import React, { useState } from 'react';
import { ApprovalLevel } from '../types';
import { PlayIcon } from './IconComponents';

interface ProjectInputFormProps {
  onSubmit: (
    goal: string,
    projectContext: string,
    availableTools: string,
    approvalLevel: ApprovalLevel
  ) => void;
  isLoading: boolean;
}

const ProjectInputForm: React.FC<ProjectInputFormProps> = ({ onSubmit, isLoading }) => {
  const [goal, setGoal] = useState<string>('Develop and launch a weather prediction mobile app using serverless architecture.');
  const [projectContext, setProjectContext] = useState<string>('Team of 5 developers, 3-month timeline, target audience is amateur meteorologists. Using AWS cloud services.');
  const [availableTools, setAvailableTools] = useState<string>('CodeCommit, Lambda, DynamoDB, API Gateway, S3, a weather data API key.');
  const [approvalLevel, setApprovalLevel] = useState<ApprovalLevel>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onSubmit(goal, projectContext, availableTools, approvalLevel);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-1">
            Primary Goal
          </label>
          <textarea
            id="goal"
            rows={3}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="e.g., Build a personal finance dashboard"
          />
        </div>
        <div>
          <label htmlFor="projectContext" className="block text-sm font-medium text-gray-300 mb-1">
            Project Context
          </label>
          <textarea
            id="projectContext"
            rows={3}
            value={projectContext}
            onChange={(e) => setProjectContext(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="e.g., Solo developer, 2-week sprint..."
          />
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label htmlFor="availableTools" className="block text-sm font-medium text-gray-300 mb-1">
            Available Tools / APIs
          </label>
          <input
            type="text"
            id="availableTools"
            value={availableTools}
            onChange={(e) => setAvailableTools(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="e.g., GitHub API, Stripe, Firebase"
          />
        </div>
        <div>
           <label htmlFor="approvalLevel" className="block text-sm font-medium text-gray-300 mb-1">
            Human Approval Level
          </label>
          <select
            id="approvalLevel"
            value={approvalLevel}
            onChange={(e) => setApprovalLevel(e.target.value as ApprovalLevel)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500 transition"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !goal.trim()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <PlayIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Generating Plan...' : 'Generate Plan'}
        </button>
      </div>
    </form>
  );
};

export default ProjectInputForm;
