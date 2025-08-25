import Button from '@/components/button';
import Panel from '@/components/panel';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
return (
  <div className="min-h-screen flex flex-col items-center justify-center p-8">
    <div className="max-w-4xl w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <Image 
          src="/logo.png"  
          alt="Logo"  
          width={120}  
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-white text-3xl font-bold tracking-wider">
          About Wumpus World
        </h1>
      </div>

      {/* Main Content */}
      <Panel className="mb-8">
        <h2 className="text-yellow-400 text-2xl font-bold mb-6">Reinforcement Learning</h2>
        
        <div className="font-poppins text-white/90 text-sm leading-relaxed space-y-4">
          <p>
            <em>Reinforcement learning</em> is a type of <em>machine learning</em> where an <em>agent</em> interacts with its environment, receiving <em>rewards</em> or <em>penalties</em> based on the actions it performs. The ultimate goal of this interaction is for the <em>agent</em> to behave in a way that maximizes the <em>reward</em> received.
          </p>
        </div>
      </Panel>

      {/* Game Specifications */}
      <Panel className="mb-8">
        <h3 className="text-yellow-400 text-xl font-bold mb-4">Game Specifications</h3>
        
        <div className="font-poppins text-white/90 leading-relaxed space-y-6">
          <div>
            <h4 className="text-white font-semibold mb-2">Environment</h4>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
              <li>A 4x4 grid</li>
              <li>The <strong>Start</strong> position is at square <strong>[1,1]</strong> (bottom-left corner)</li>
              <li>Locations of elements:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li><strong>Wumpus</strong>: <strong>[1, 3]</strong> (Stench nearby)</li>
                  <li><strong>Gold</strong>: <strong>[2, 3]</strong> (Glitter in the same square)</li>
                  <li><strong>Pits</strong>: <strong>[3, 1]</strong>, <strong>[3, 3]</strong>, <strong>[4, 4]</strong> (Breeze nearby)</li>
                </ul>
              </li>
              <li>The agent can sense <strong>Stench</strong> (smell), <strong>Breeze</strong> (wind), and <strong>Glitter</strong> (shine)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Game Rules and Points (Rewards)</h4>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
              <li>Each action performed (move, turn) incurs a penalty of <strong>-1 point</strong></li>
              <li>If the agent enters a square containing the <strong>Wumpus</strong> or a <strong>Pit</strong>, the game ends and the agent receives a penalty of <strong>-1000 points</strong></li>
              <li>If the agent successfully grabs the <strong>Gold</strong> (by performing the <strong>Grab</strong> action), the agent receives a reward of <strong>+1000 points</strong></li>
              <li>The game is considered <strong>successful (won)</strong> if the agent successfully grabs the Gold and returns to square <strong>[1, 1]</strong> and performs the <strong>Climb</strong> action</li>
            </ul>
          </div>
        </div>
      </Panel>

        {/* Implementation Features */}
        <Panel className="mb-8">
          <h3 className="text-yellow-400 text-xl font-bold mb-4">Implementation Features</h3>
          
          <div className="font-poppins text-white/90 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Core Algorithms</h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>Q-Learning (Off-policy)</li>
                  <li>SARSA (On-policy)</li>
                  <li>Epsilon-greedy exploration</li>
                  <li>Learning rate scheduling</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Visualization</h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>Interactive game grid</li>
                  <li>Real-time training progress</li>
                  <li>Q-table heatmap</li>
                  <li>Optimal path animation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Game Features</h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>Sensor simulation (Stench, Breeze, Glitter)</li>
                  <li>Action space (Move, Turn, Grab, Climb)</li>
                  <li>Reward system implementation</li>
                  <li>Episode management</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Analysis Tools</h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>Performance comparison</li>
                  <li>Convergence analysis</li>
                  <li>Policy evaluation</li>
                  <li>Statistical reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </Panel>

        {/* Author */}
        <Panel className="mb-8">
            <h3 className="text-yellow-400 text-xl font-bold mb-4">Author</h3>
            <div className='flex flex-row items-center gap-4'>
                <Image 
                    src="/self.png"  
                    alt="Self"  
                    width={100}  
                    height={100}
                    className="mb-4 rounded-full"
                />
                <div className='flex flex-col'>
                    <p className="font-poppins text-white/90 text-md font-semibold">Adinda Putri</p>
                    <p className="font-poppins text-white/90 text-sm">13523071</p>
                    <p className="font-poppins text-white/70 text-sm">AI Laboratory Assistant Selection Task</p>
                </div>
            </div>
        </Panel>

        {/* Back Button */}
        <div className="text-center">
          <Link href="/">
            <Button text="BACK TO HOME" />
          </Link>
        </div>
      </div>
    </div>
  );
}