export type TyreCompound = 'soft' | 'medium' | 'hard' | 'inter' | 'wet';
export type DriverStatus = 'racing' | 'pit' | 'dnf' | 'dsq';
export type RaceStatus = 'upcoming' | 'live' | 'finished';

export interface Driver {
  id: string;
  code: string; // e.g., 'NOR'
  name: string;
  team: string;
  teamColor: string; // Hex code
  position: number;
  currentLap: number;
  lapTime: number; // in ms
  gapToLeader: number; // in seconds
  lastLapTime: number; // in ms
  tyreCompound: TyreCompound;
  tyreAge: number; // in laps
  drsEnabled: boolean;
  status: DriverStatus;
}

export interface LapTimeEntry {
  driverId: string;
  lap: number;
  timeMs: number;
  compound: TyreCompound;
}

export interface Race {
  id: string;
  name: string;
  round: number;
  circuit: string;
  country: string;
  flagEmoji: string;
  status: RaceStatus;
  currentLap: number;
  totalLaps: number;
  safetyCar: boolean;
  vsc: boolean;
  fastestLap: {
    driverCode: string;
    time: number; // in ms or formatted string, but interface usually keeps numeric for logic
  };
  drivers: Driver[]; // Added to represent the full field in a race session
}
