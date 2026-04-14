import React from 'react';

interface Driver {
  id: string;
  name: string;
  team: string;
  code: string;
  position: number;
}

interface LeaderboardProps {
  drivers: Driver[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ drivers }) => {
  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="p-4 border-b border-muted flex items-center justify-between bg-muted/20">
        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <div className="w-1 h-3 bg-primary" />
          Intervals
        </h3>
        <span className="text-[10px] font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">LIVE</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {drivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-text-dim text-xs">
            <div className="w-8 h-8 border-2 border-muted border-t-accent rounded-full animate-spin mb-2" />
            Syncing data...
          </div>
        ) : (
          drivers.map(d => (
            <div key={d.id} className={`flex items-center gap-3 p-2 rounded transition-colors ${d.position === 1 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}`}>
               <span className="text-xs font-mono w-4 font-bold text-center">{d.position}</span>
               <div className={`w-1 h-5 rounded-full ${
                 d.team.includes('Red Bull') ? 'bg-blue-800' : 
                 d.team.includes('McLaren') ? 'bg-orange-500' : 
                 d.team.includes('Ferrari') ? 'bg-red-600' : 
                 d.team.includes('Mercedes') ? 'bg-teal-400' :
                 'bg-zinc-500'
               }`} />
               <div className="flex flex-col">
                 <span className="text-sm font-bold leading-none">{d.code}</span>
                 <span className="text-[9px] text-text-dim uppercase tracking-tighter">{d.team}</span>
               </div>
               <div className="flex-1" />
               <span className="text-xs font-mono font-medium text-right text-text-dim">
                 {d.position === 1 ? 'LEADER' : `+${(d.position * 1.145).toFixed(3)}`}
               </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
