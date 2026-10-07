
import React from 'react';
import { BotIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/60 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <BotIcon className="h-8 w-8 text-cyan-400"/>
            <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
              AI Project Co-Pilot
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
