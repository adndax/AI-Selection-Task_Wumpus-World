import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export default function Panel({ children, className = '' }: PanelProps) {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-lg p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
}