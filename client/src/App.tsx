import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Trophy, 
  Activity, 
  Wind, 
  Settings, 
  LayoutDashboard, 
  BarChart3,
  Timer,
  Info,
  Map as MapIcon,
  ChevronRight
} from 'lucide-react';

// Components
import Leaderboard from './components/Leaderboard';
import TelemetryView from './components/TelemetryView';

// Types
interface TelemetryData {
  speed: number;
  gear: number;
  rpm: number;
  throttle: number;
  brake: number;
  drs: boolean;
  lap: number;
  position: number;
}

interface Driver {
  id: string;
  name: string;
  team: string;
  code: string;
  position: number;
}

interface RaceData {
  name: string;
  track: string;
  distance: string;
  laps: number;
  weather: {
    temp: number;
    condition: string;
    humidity: number;
  };
}

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [race, setRace] = useState<RaceData | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Fetch initial driver data
    fetch('/api/v1/drivers')
      .then(res => res.json())
      .then(data => setDrivers(data))
      .catch(err => console.error('Error fetching drivers:', err));

    // Fetch race data
    fetch('/api/v1/race/current')
      .then(res => res.json())
      .then(data => setRace(data))
      .catch(err => console.error('Error fetching race:', err));

    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('telemetry_update', (data: TelemetryData) => {
      setTelemetry(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-text-main selection:bg-primary selection:text-white">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/5 flex flex-col items-center py-6 bg-surface shadow-2xl relative z-20">
        <div className="mb-12 px-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(225,6,0,0.3)]">
            <Trophy className="text-white w-5 h-5" />
          </div>
          <span className="hidden md:block font-black text-xl tracking-tighter italic">APEX <span className="text-primary">CENTER</span></span>
        </div>

        <nav className="flex-1 w-full px-4 space-y-3">
          <NavItem icon={<LayoutDashboard size={18} />} label="Race Monitor" active />
          <NavItem icon={<Activity size={18} />} label="Telemetry" />
          <NavItem icon={<MapIcon size={18} />} label="Track Map" />
          <NavItem icon={<BarChart3 size={18} />} label="Data Hub" />
          <NavItem icon={<Timer size={18} />} label="Strategy" />
        </nav>

        <div className="mt-auto w-full px-4 space-y-4">
          <div className="hidden md:block p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 mb-4">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">PRO Performance</p>
            <p className="text-xs text-text-dim leading-tight">Predictive AI analysis currently active for Silverstone.</p>
          </div>
          
          <NavItem icon={<Settings size={18} />} label="Settings" />
          
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-mono">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-accent shadow-[0_0_8px_rgba(0,210,190,0.8)] animate-pulse' : 'bg-red-500'}`} />
            <span className="hidden md:block text-[10px] uppercase font-bold tracking-wider">{connected ? 'Live Sync' : 'Offline'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-surface/50 backdrop-blur-xl relative z-10">
          <div className="flex items-center gap-2 text-sm text-text-dim">
            <span className="hover:text-text-main cursor-pointer transition-colors">Season 2024</span>
            <ChevronRight size={14} />
            <span className="text-text-main font-bold">{race?.name || 'Loading Race...'}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 glass p-1.5 px-4 rounded-full border border-white/5 bg-white/5">
              <div className="text-right">
                <span className="block text-text-dim text-[8px] uppercase font-bold tracking-widest">Air Temp</span>
                <span className="text-xs font-mono font-bold">{race?.weather.temp || '--'}°C</span>
              </div>
              <Wind size={14} className="text-accent" />
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-dim">UTC: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control <span className="text-primary italic">Panel</span></h1>
                <p className="text-text-dim text-sm max-w-md">Real-time multisensor data integration from onboard vehicle systems and track-side telemetry units.</p>
              </div>
              <div className="flex gap-4">
                 <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase transition-all hover:bg-white/10 hover:border-white/20">Recap</button>
                 <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">Live Camera</button>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Telemetry Main Card */}
              <div className="lg:col-span-8 space-y-8">
                <TelemetryView data={telemetry} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="dashboard-card p-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Info size={14} className="text-primary" />
                        Circuit Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-xs text-text-dim">Circuit</span>
                          <span className="text-xs font-bold">{race?.track}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-xs text-text-dim">Total Distance</span>
                          <span className="text-xs font-bold">{race?.distance}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-xs text-text-dim">Race Laps</span>
                          <span className="text-xs font-bold">{race?.laps}</span>
                        </div>
                      </div>
                   </div>

                   <div className="dashboard-card p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />
                      <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity size={14} className="text-accent" />
                        Network Status
                      </h3>
                      <div className="mt-2 space-y-4">
                         <div>
                            <span className="text-[10px] uppercase font-bold text-text-dim">Data Latency</span>
                            <div className="flex items-center gap-4 mt-1">
                               <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-accent w-[15%]" />
                               </div>
                               <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">14ms</span>
                            </div>
                         </div>
                         <div>
                            <span className="text-[10px] uppercase font-bold text-text-dim">Package Rate</span>
                            <div className="flex items-center gap-4 mt-1">
                               <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-accent w-[92%]" />
                               </div>
                               <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">128kb/s</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Leaderboard Section */}
              <div className="lg:col-span-4 h-full sticky top-8">
                <Leaderboard drivers={drivers} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group ${active ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_12px_rgba(225,6,0,0.05)]' : 'text-text-dim hover:text-text-main hover:bg-white/5'}`}>
    {active && <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
    <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-primary' : ''}`}>{icon}</div>
    <span className="hidden md:block font-bold text-sm tracking-tight">{label}</span>
  </button>
);

export default App;
