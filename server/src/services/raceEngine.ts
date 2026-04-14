import { Server } from 'socket.io';
import { Race } from '../models/Race';
import { IRaceDocument } from '../models/Race';
import { Driver } from '../types/race.types';

export class RaceEngine {
  private io: Server;
  private activeRaces: Map<string, IRaceDocument> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  public async startRace(raceId: string) {
    if (this.intervals.has(raceId)) return;

    const race = await Race.findById(raceId);
    if (!race || race.status !== 'live') return;

    this.activeRaces.set(raceId, race);
    
    const interval = setInterval(() => {
      this.tick(raceId);
    }, 2000);

    this.intervals.set(raceId, interval);
    console.log(`Race engine started for race: ${raceId}`);
  }

  private async tick(raceId: string) {
    const race = this.activeRaces.get(raceId);
    if (!race) return;

    // Simulate telemetry for each driver
    race.drivers.forEach((driver, index) => {
      // 1. Variance in lap time (±300ms)
      const variance = (Math.random() * 600) - 300;
      driver.lastLapTime = 90000 + variance; // Base 1:30.000

      // 2. DRS Logic (if gap to car ahead < 1s)
      if (index > 0) {
        const gapToAhead = driver.gapToLeader - race.drivers[index - 1].gapToLeader;
        driver.drsEnabled = gapToAhead < 1.0;
        if (driver.drsEnabled) {
          // Reduce gap slightly more
          driver.gapToLeader -= (0.1 + Math.random() * 0.1);
        }
      }

      // 3. Natural gap progression
      driver.gapToLeader += (Math.random() * 0.2) - 0.1;
      if (driver.gapToLeader < 0) driver.gapToLeader = 0;

      // 4. Pit Stop Simulation (randomly between laps 20-40)
      if (race.currentLap >= 20 && race.currentLap <= 40 && Math.random() > 0.98 && driver.status !== 'pit') {
        driver.status = 'pit';
        driver.gapToLeader += 25; // Pit loss
        setTimeout(() => {
          driver.status = 'racing';
          driver.tyreAge = 0;
        }, 5000);
      }
    });

    // 5. Overtake logic (Re-sort based on gaps)
    const sortedDrivers = [...race.drivers].sort((a, b) => a.gapToLeader - b.gapToLeader);
    
    let positionChanged = false;
    sortedDrivers.forEach((driver, idx) => {
      if (driver.position !== idx + 1) {
        driver.position = idx + 1;
        positionChanged = true;
      }
    });

    race.drivers = sortedDrivers as any;

    if (positionChanged) {
      this.io.to(`race:${raceId}`).emit('position:change', {
        standings: race.drivers.map(d => ({ code: d.code, position: d.position }))
      });
    }

    // 6. Lap Completion Logic
    if (Math.random() > 0.95) {
      race.currentLap++;
      this.io.to(`race:${raceId}`).emit('lap:complete', {
        lap: race.currentLap,
        fastestLap: race.fastestLap
      });
    }

    // 7. Emit Full Update
    this.io.to(`race:${raceId}`).emit('race:update', race);

    // Persist occasionally (every 10 ticks/20s) to avoid heavy DB load
    if (Math.random() > 0.9) {
      await race.save();
    }
  }

  public stopRace(raceId: string) {
    const interval = this.intervals.get(raceId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(raceId);
      this.activeRaces.delete(raceId);
      console.log(`Race engine stopped for race: ${raceId}`);
    }
  }
}
