'use client'

import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="flex items-center space-x-2 rounded-full px-4 py-2 shadow-md bg-gray-100 text-gray-600">
      <span className="text-xl font-semibold">Score: {score}</span>
    </div>
  );
};

export default ScoreDisplay;
