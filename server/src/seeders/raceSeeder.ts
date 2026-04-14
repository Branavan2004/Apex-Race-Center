import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Race } from '../models/Race';
import { TyreCompound, DriverStatus, RaceStatus } from '../types/race.types';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_race_center';

const BR_GP_DRIVERS = [
  { code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', teamColor: '#3671C6' },
  { code: 'PER', name: 'Sergio Perez', team: 'Red Bull Racing', teamColor: '#3671C6' },
  { code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', teamColor: '#E8002D' },
  { code: 'SAI', name: 'Carlos Sainz', team: 'Ferrari', teamColor: '#E8002D' },
  { code: 'NOR', name: 'Lando Norris', team: 'McLaren', teamColor: '#FF8000' },
  { code: 'PIA', name: 'Oscar Piastri', team: 'McLaren', teamColor: '#FF8000' },
  { code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', teamColor: '#27F4D2' },
  { code: 'RUS', name: 'George Russell', team: 'Mercedes', teamColor: '#27F4D2' },
  { code: 'ALO', name: 'Fernando Alonso', team: 'Aston Martin', teamColor: '#229971' },
  { code: 'STR', name: 'Lance Stroll', team: 'Aston Martin', teamColor: '#229971' },
  { code: 'GAS', name: 'Pierre Gasly', team: 'Alpine', teamColor: '#FF87BC' },
  { code: 'OCO', name: 'Esteban Ocon', team: 'Alpine', teamColor: '#FF87BC' },
  { code: 'ALB', name: 'Alexander Albon', team: 'Williams', teamColor: '#64C4FF' },
  { code: 'SAR', name: 'Logan Sargeant', team: 'Williams', teamColor: '#64C4FF' },
  { code: 'RIC', name: 'Daniel Ricciardo', team: 'RB', teamColor: '#6692FF' },
  { code: 'TSU', name: 'Yuki Tsunoda', team: 'RB', teamColor: '#6692FF' },
  { code: 'HUL', name: 'Nico Hulkenberg', team: 'Haas', teamColor: '#B6BABD' },
  { code: 'MAG', name: 'Kevin Magnussen', team: 'Haas', teamColor: '#B6BABD' },
  { code: 'BOT', name: 'Valtteri Bottas', team: 'Kick Sauber', teamColor: '#52E252' },
  { code: 'ZHO', name: 'Guanyu Zhou', team: 'Kick Sauber', teamColor: '#52E252' },
];

const seedRace = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing races
    await Race.deleteMany({});
    console.log('Cleared existing race data');

    const drivers = BR_GP_DRIVERS.map((d, index) => ({
      ...d,
      position: index + 1,
      currentLap: 28,
      lapTime: 91450 + Math.random() * 2000, // ~1:31.x
      gapToLeader: index * 1.5 + Math.random(),
      lastLapTime: 92100 + Math.random() * 1000,
      tyreCompound: (index < 10 ? 'medium' : 'hard') as TyreCompound,
      tyreAge: 12 + Math.floor(Math.random() * 5),
      drsEnabled: index > 0 && index < 5,
      status: 'racing' as DriverStatus,
    }));

    const britishGP = new Race({
      name: 'British Grand Prix',
      round: 12,
      circuit: 'Silverstone Circuit',
      country: 'United Kingdom',
      flagEmoji: '🇬🇧',
      status: 'live' as RaceStatus,
      currentLap: 28,
      totalLaps: 52,
      safetyCar: false,
      vsc: false,
      fastestLap: {
        driverCode: 'NOR',
        time: 89720, // 1:29.720
      },
      drivers: drivers,
    });

    await britishGP.save();
    console.log('Successfully seeded British GP mock race');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedRace();
