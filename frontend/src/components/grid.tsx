import Image from 'next/image';

interface GridProps {
  size?: number;
  className?: string;
  optimalPath?: number[][];
}

interface CellProps {
  row: number;
  col: number;
  content?: string;
  imageSrc?: string;
  bgColor?: string;
  textColor?: string;
  extraText?: string;
  extraTextColor?: string;
  isOptimalPath?: boolean;
}

function Cell({ content, imageSrc, bgColor = 'bg-slate-700', textColor, extraText, extraTextColor, isOptimalPath }: CellProps) {
  const finalBgColor = isOptimalPath ? 'bg-indigo-500' : bgColor;
  return (
    <div className={`w-24 h-24 border border-slate-500 flex items-center justify-center text-sm font-bold ${finalBgColor}`}>
      <div className="flex flex-col items-center justify-center space-y-1">
        {extraText && <p className={`text-xs ${extraTextColor || 'text-white'}`}>{extraText}</p>}
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={`${content} image`}
            width={24}
            height={24}
            className="object-contain"
          />
        )}
        {content && <p className={`text-xs ${textColor || 'text-white'}`}>{content}</p>}
      </div>
    </div>
  );
}

export default function Grid({ size = 4, className = '', optimalPath = [] }: GridProps) {
  const WUMPUS_POS = [1, 3];
  const GOLD_POS = [2, 3];
  const PIT_POSITIONS = [[3, 1], [3, 3], [4, 4]];

  const isAdjacent = (pos1: number[], pos2: number[]) => {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]) === 1;
  };

  const getCellContent = (row: number, col: number) => {
    const x = col + 1; 
    const y = size - row;
    const currentPos = [x, y];

    let cellData: Partial<CellProps> = { bgColor: 'bg-slate-700/80', textColor: 'text-white' };
    let percepts: string[] = [];

    if (x === 1 && y === 1) { 
      cellData = { content: 'Start', bgColor: 'bg-green-600', textColor: 'text-white' };
    } else if (currentPos[0] === WUMPUS_POS[0] && currentPos[1] === WUMPUS_POS[1]) { // Wumpus
      cellData = { 
        imageSrc: '/wumpus.png',
        bgColor: 'bg-purple-900/80', 
        textColor: 'text-white' 
      };
    } else if (PIT_POSITIONS.some(pit => pit[0] === currentPos[0] && pit[1] === currentPos[1])) { // Pits
      cellData = { 
        content: 'Pit', 
        bgColor: 'bg-black/90', 
        textColor: 'text-white' 
      };
    } else if (currentPos[0] === GOLD_POS[0] && currentPos[1] === GOLD_POS[1]) { // Gold
      cellData = { 
        imageSrc: '/gold.png',
        bgColor: 'bg-yellow-600/80', 
        textColor: 'text-yellow-200' 
      };
      percepts.push('Glitter');
    }

    const hasStench = isAdjacent(currentPos, WUMPUS_POS);
    const hasBreeze = PIT_POSITIONS.some(pit => isAdjacent(currentPos, pit));

    if (hasStench && !(currentPos[0] === WUMPUS_POS[0] && currentPos[1] === WUMPUS_POS[1])) {
      percepts.push('Stench');
    }
    if (hasBreeze && !PIT_POSITIONS.some(pit => pit[0] === currentPos[0] && pit[1] === currentPos[1])) {
      percepts.push('Breeze');
    }
    
    if (currentPos[0] === GOLD_POS[0] && currentPos[1] === GOLD_POS[1]) {
      let goldExtraTexts: string[] = [];
      if (percepts.includes('Stench')) goldExtraTexts.push('Stench');
      if (percepts.includes('Breeze')) goldExtraTexts.push('Breeze');

      if (goldExtraTexts.length > 0) {
        if (percepts.includes('Stench') && percepts.includes('Breeze')) {
          cellData.extraText = 'Stench';
          cellData.extraTextColor = 'text-green-400';
          cellData.content = 'Breeze';
          cellData.textColor = 'text-blue-400';
        }
      } else { 
        cellData.content = 'Glitter';
        cellData.textColor = 'text-yellow-200';
      }
    } else { 
      if (percepts.includes('Stench')) {
        cellData.content = 'Stench';
        cellData.textColor = 'text-green-400';
        cellData.bgColor = 'bg-slate-800/80';
      } else if (percepts.includes('Breeze')) {
        cellData.content = 'Breeze';
        cellData.textColor = 'text-blue-400';
        cellData.bgColor = 'bg-slate-800/60';
      }
    }

    return cellData;
  };

  const mappedPath = optimalPath.map((coord: number[]) => [size - coord[1], coord[0] - 1]);
  
  return (
    <div className={`inline-block ${className}`}>
      <div className="grid grid-cols-4 gap-0 border-2 border-yellow-400 rounded-lg overflow-hidden">
        {Array.from({ length: size * size }, (_, index) => {
          const row = Math.floor(index / size);
          const col = index % size;
          const cellData = getCellContent(row, col);

          const isPath = mappedPath.some(pathCoord => pathCoord[0] === row && pathCoord[1] === col);
          
          return (
            <Cell
              key={`${row}-${col}`}
              row={row}
              col={col}
              content={cellData.content}
              imageSrc={cellData.imageSrc}
              bgColor={cellData.bgColor}
              textColor={cellData.textColor}
              extraText={cellData.extraText}
              extraTextColor={cellData.extraTextColor}
              isOptimalPath={isPath}
            />
          );
        })}
      </div>
    </div>
  );
}
