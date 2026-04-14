import React from 'react';
import { Activity, Zap } from 'lucide-react';

interface TelemetryProps {
  data: {
    speed: number;
    gear: number;
    rpm: number;
    throttle: number;
    brake: number;
    drs: boolean;
    lap: number;
    position: number;
  } | null;
}

const TelemetryView: React.FC<TelemetryProps> = ({ data }) => {
  if (!data) return (
    <div className="dashboard-card p-12 flex flex-col items-center justify-center text-text-dim italic">
      <Activity className="w-12 h-12 mb-4 opacity-20 animate-pulse" />
      Waiting for telemetry signal...
    </div>
  );

  return (
    <div className="dashboard-card p-6 bg-gradient-to-br from-surface to-muted/30">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Activity className="text-primary" size={18} />
          <h2 className="font-bold uppercase tracking-widest text-xs">Live Telemetry Analysis</h2>
        </div>
        <div className="flex gap-2">
          {data.drs && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-accent text-background animate-pulse">DRS ENABLED</span>
          )}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-text-dim border border-white/5">LAP {data.lap}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="relative group">
          <span className="stat-label">Velocity</span>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black font-mono tracking-tighter group-hover:text-white transition-colors">
              {data.speed}
            </span>
            <span className="text-text-dim text-[10px] font-bold italic tracking-wider">KM/H</span>
          </div>
          <div className="absolute -bottom-1 left-0 h-0.5 bg-primary/20 w-full rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(data.speed / 340) * 100}%` }} />
          </div>
        </div>

        <div>
          <span className="stat-label">Gear</span>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black font-mono tracking-tighter text-accent">
              {data.gear}
            </span>
            <span className="text-text-dim text-[10px] font-bold italic">ENG</span>
          </div>
        </div>

        <div>
          <span className="stat-label">Engine RPM</span>
          <div className="flex items-baseline gap-1 text-primary">
            <span className="text-5xl font-black font-mono tracking-tighter">
              {data.rpm}
            </span>
            <Zap size={14} className="mb-2" />
          </div>
        </div>

        <div>
          <span className="stat-label">Position</span>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black font-mono tracking-tighter">
              {data.position}
            </span>
            <span className="text-text-dim text-[10px] font-bold italic">P-IDX</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span>Throttle Input</span>
            <span className="text-accent">{data.throttle}%</span>
          </div>
          <div className="h-3 w-full bg-muted/50 rounded-sm border border-white/5 overflow-hidden p-0.5">
            <div 
              className="h-full bg-accent shadow-[0_0_15px_rgba(0,210,190,0.5)] transition-all duration-75 ease-out rounded-[1px]" 
              style={{ width: `${data.throttle}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span>Brake Pressure</span>
            <span className="text-primary">{data.brake}%</span>
          </div>
          <div className="h-3 w-full bg-muted/50 rounded-sm border border-white/5 overflow-hidden p-0.5">
            <div 
              className="h-full bg-primary shadow-[0_0_15px_rgba(225,6,0,0.5)] transition-all duration-75 ease-out rounded-[1px]" 
              style={{ width: `${data.brake}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryView;
