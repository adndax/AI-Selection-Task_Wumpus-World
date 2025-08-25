import Image from 'next/image';

interface GridProps {
  size?: number;
  className?: string;
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
}

function Cell({ content, imageSrc, bgColor = 'bg-slate-700', textColor, extraText, extraTextColor }: CellProps) {
  return (
    <div className={`w-24 h-24 border border-slate-500 flex items-center justify-center text-sm font-bold ${bgColor} ${textColor}`}>
      <div className="flex flex-col items-center justify-center space-y-1">
{extraText && <p className={`text-xs ${extraTextColor}`}>{extraText}</p>}
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={`${content} image`}
            width={24}
            height={24}
            className="object-contain"
          />
        )}
        {content && <p className="text-xs">{content}</p>}
      </div>
    </div>
  );
}

export default function Grid({ size = 4, className = '' }: GridProps) {
  const getCellContent = (row: number, col: number) => {
    const x = col + 1;
    const y = size - row;
    
    // Start position [1,1]
    if (x === 1 && y === 1) {
      return { content: 'Start', bgColor: 'bg-green-600', textColor: 'text-white' };
    }
    
    // Wumpus [1,3]
    if (x === 1 && y === 3) {
      return { 
        imageSrc: '/wumpus.png',
        bgColor: 'bg-purple-900/80', 
        textColor: 'text-white' 
      };
    }
    
    // Gold, Stench, and Breeze [2,3]
    if (x === 2 && y === 3) {
      return { 
        content: 'Breeze', 
        imageSrc: '/gold.png',
        extraText: 'Stench',
        extraTextColor: 'text-green-400',
        bgColor: 'bg-yellow-600/80', 
        textColor: 'text-blue-400'
      };
    }
    
    // Pits [3,1], [3,3], [4,4]
    if ((x === 3 && y === 1) || (x === 3 && y === 3) || (x === 4 && y === 4)) {
      return { 
        content: 'Pit', 
        bgColor: 'bg-black/90', 
        textColor: 'text-white' 
      };
    }
    
    // Stench around Wumpus 
    if ((x === 2 && y === 3) || (x === 1 && y === 2) || (x === 1 && y === 4)) {
      return { 
        content: 'Stench', 
        bgColor: 'bg-slate-800/80', 
        textColor: 'text-green-400' 
      };
    }
    
    // Breeze around Pits 
    if ((x === 2 && y === 1) || (x === 3 && y === 2) || (x === 4 && y === 1) || (x === 4 && y === 3) || (x === 3 && y === 4) || (x === 4 && y === 4)) {
      return { 
        content: 'Breeze', 
        bgColor: 'bg-slate-800/60', 
        textColor: 'text-blue-400' 
      };
    }
    
    return { content: '', bgColor: 'bg-slate-700/80', textColor: 'text-white' };
  };


  return (
    <div className={`inline-block ${className}`}>
      <div className="grid grid-cols-4 gap-0 border-2 border-yellow-400 rounded-lg overflow-hidden">
        {Array.from({ length: size * size }, (_, index) => {
          const row = Math.floor(index / size);
          const col = index % size;
          const cellData = getCellContent(row, col);

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
            />
          );
        })}
      </div>
    </div>
  );
}