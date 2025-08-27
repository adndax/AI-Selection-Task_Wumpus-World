'use client';

import { useState } from 'react';
import Button from '@/components/button';
import Panel from '@/components/panel';
import Grid from '@/components/grid';
import HyperparameterPanel from '@/components/hyperparameters-input';
import AlgorithmSelector from '@/components/algorithm-selector';
import Image from 'next/image';
import Link from 'next/link';

type OptimalPathItem = {
  position: number[];
  action: string;
  direction: string;
};

export default function Start() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'qlearning' | 'sarsa'>('qlearning');
  const [isTraining, setIsTraining] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hyperparams, setHyperparams] = useState({
    learningRate: 0.1,
    discountFactor: 0.95,
    epsilon: 1.0,
    episodes: 5000
  });

  const [qTableData, setQTableData] = useState(null);
  const [optimalPathData, setOptimalPathData] = useState<OptimalPathItem[] | null>(null);
  const [showQTable, setShowQTable] = useState(false);
  const [showOptimalPath, setShowOptimalPath] = useState(false);

const handleStartTraining = async () => {
    setIsTraining(true);
    setIsComplete(false);
    setShowQTable(false);
    setShowOptimalPath(false);
    
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://web-production-fd24a.up.railway.app' 
      : 'http://localhost:8080';
    
    try {
      const response = await fetch(`${baseUrl}/api/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm: selectedAlgorithm,
          hyperparams: hyperparams  
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setQTableData(result.q_table);
        setOptimalPathData(result.optimal_path);
        console.log('Training started:', result.message);
        setIsTraining(false);
        setIsComplete(true);
      } else {
        console.error('Training failed:', result.error);
        setIsTraining(false);
      }
    } catch (error) {
      console.error('Error starting training:', error);
      setIsTraining(false);
    }
  };

  const handleReset = () => {
    setIsComplete(false);
    setIsTraining(false);
    setShowQTable(false);
    setShowOptimalPath(false);
    setQTableData(null);
    setOptimalPathData(null);
  };

  const handleViewQTable = () => {
    setShowQTable(!showQTable);
    setShowOptimalPath(false); 
  };

  const handleShowPath = () => {
    setShowOptimalPath(!showOptimalPath);
    setShowQTable(false); 
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Image 
            src="/logo.png"  
            alt="Logo"  
            width={60}  
            height={60}
            className="mx-auto mb-3"
          />
          <h1 className="text-white text-2xl font-bold tracking-wider mb-1">
            Wumpus World
          </h1>
          <p className="font-poppins text-white/70 text-sm">
            Reinforcement Learning with Q-Learning and SARSA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-6 gap-y-4">
          <div className="space-y-4">
            {/* Reinforcement Learning */}
            <Panel>
              <h2 className="text-yellow-400 text-base font-bold mb-3">Reinforcement Learning</h2>
              <div className="font-poppins text-white/90 leading-relaxed text-xs">
                <p>
                  Agent learns optimal policy through trial and error, receiving rewards and penalties for actions taken in the environment.
                </p>
              </div>
            </Panel>

            {/* Game Rules & Rewards */}
            <Panel>
              <h3 className="text-yellow-400 text-base font-bold mb-3">Game Rules & Rewards</h3>
              <div className="font-poppins text-white/90 text-xs space-y-3">
                <div>
                  <h4 className="text-white font-semibold text-xs mb-2">Actions & Penalties:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                    <li>Move/Turn: <span className="text-red-400">-1 point</span></li>
                    <li>Enter Wumpus/Pit: <span className="text-red-400">-1000 points</span> (Game Over)</li>
                    <li>Grab Gold: <span className="text-green-400">+1000 points</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs mb-1">Win Condition:</h4>
                  <p className="text-xs">Get Gold → Return to [1,1] → Climb</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs mb-1">Available Actions:</h4>
                  <p className="text-xs">Move Forward, Turn Left/Right, Grab, Climb</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs mb-1">Sensors:</h4>
                  <p className="text-xs">Stench (near Wumpus), Breeze (near Pit), Glitter (on Gold)</p>
                </div>
              </div>
            </Panel>
          </div>

          <div className="col-span-2 space-y-4">
            <Panel>
              <h3 className="text-yellow-400 text-lg font-bold mb-4 text-center">Wumpus World Environment</h3>
              <div className="flex justify-center mb-4">
                <Grid 
                  className="scale-100" 
                  optimalPath={showOptimalPath && optimalPathData ? optimalPathData.map(item => item.position) : []} 
                />
              </div>
            </Panel>

            {/* Bagian untuk menampilkan Q-Table dan Path */}
            {showQTable && qTableData && (
              <Panel>
                <h3 className="text-yellow-400 text-base font-bold mb-3">Q-Table</h3>
                <div className="font-poppins text-white/90 text-xs overflow-auto h-64">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(qTableData, null, 2)}
                  </pre>
                </div>
              </Panel>
            )}

            {showOptimalPath && optimalPathData && (
              <Panel>
                <h3 className="text-yellow-400 text-base font-bold mb-3">Optimal Path</h3>
                <div className="font-poppins text-white/90 text-xs space-y-2">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Path Coordinates:</h4>
                    <p>{optimalPathData.map(item => `[${item.position.join(',')}]`).join(' → ')}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Detailed Steps:</h4>
                    <div className="space-y-1">
                      {optimalPathData.map((item, index) => (
                        <div key={index} className="text-xs">
                          <span className="text-yellow-400">Step {index + 1}:</span> 
                          <span className="text-white"> [{item.position.join(',')}] </span>
                          <span className="text-green-400">{item.action}</span>
                          <span className="text-blue-400"> (facing {item.direction})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>
            )}
          </div>

          <div className="space-y-4">
            {/* Algorithm Selection */}
            <Panel>
              <h3 className="text-yellow-400 text-base font-bold mb-3">Algorithm</h3>
              <AlgorithmSelector 
                selectedAlgorithm={selectedAlgorithm}
                onSelect={setSelectedAlgorithm}
              />
            </Panel>

            {/* Hyperparameter Setup */}
            <Panel>
              <h3 className="text-yellow-400 text-base font-bold mb-3">Hyperparameter Setup</h3>
              <HyperparameterPanel 
                hyperparams={hyperparams}
                onChange={setHyperparams}
              />
            </Panel>

            {/* Training Controls */}
            <Panel>
              <h3 className="text-yellow-400 text-base font-bold mb-3">Training</h3>
              
              <div className="space-y-3">
                {!isComplete && !isTraining && (
                  <div>
                    <button
                      onClick={handleStartTraining}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 text-sm rounded-lg transition-colors duration-200"
                    >
                      Start Training
                    </button>
                  </div>
                )}

                {isTraining && (
                  <div className="text-center">
                    <div className="mb-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto"></div>
                    </div>
                    <p className="font-poppins text-white/90 text-xs">
                      Training {selectedAlgorithm.toUpperCase()}...
                    </p>
                    <p className="font-poppins text-white/70 text-xs mt-1">
                      LR: {hyperparams.learningRate} | γ: {hyperparams.discountFactor} | ε: {hyperparams.epsilon}
                    </p>
                  </div>
                )}

                {isComplete && (
                  <div className="space-y-3">
                    <div className="text-green-400 font-poppins text-center">
                      <p className="text-sm font-semibold">Complete!</p>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={handleReset}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 text-xs rounded-lg transition-colors duration-200"
                      >
                        Train Again
                      </button>
                      <button
                        onClick={handleViewQTable}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 text-xs rounded-lg transition-colors duration-200"
                      >
                        View Q-Table
                      </button>
                      <button
                        onClick={handleShowPath}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 text-xs rounded-lg transition-colors duration-200"
                      >
                        Show Path
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button text="BACK TO HOME" />
          </Link>
        </div>
      </div>
    </div>
  );
}