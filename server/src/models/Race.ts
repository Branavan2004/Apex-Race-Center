import mongoose, { Schema, Document } from 'mongoose';
import { Race as IRace, Driver as IDriver } from '../types/race.types';

export interface IRaceDocument extends Omit<IRace, 'id'>, Document {}

const DriverSchema = new Schema<IDriver>({
  code: { type: String, required: true },
  name: { type: String, required: true },
  team: { type: String, required: true },
  teamColor: { type: String, required: true },
  position: { type: Number, required: true },
  currentLap: { type: Number, required: true },
  lapTime: { type: Number, required: true },
  gapToLeader: { type: Number, required: true },
  lastLapTime: { type: Number, required: true },
  tyreCompound: { 
    type: String, 
    enum: ['soft', 'medium', 'hard', 'inter', 'wet'],
    required: true 
  },
  tyreAge: { type: Number, required: true },
  drsEnabled: { type: Boolean, required: true },
  status: { 
    type: String, 
    enum: ['racing', 'pit', 'dnf', 'dsq'],
    required: true 
  }
}, { _id: false });

const RaceSchema = new Schema<IRaceDocument>({
  name: { type: String, required: true },
  round: { type: Number, required: true },
  circuit: { type: String, required: true },
  country: { type: String, required: true },
  flagEmoji: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'live', 'finished'],
    required: true 
  },
  currentLap: { type: Number, required: true },
  totalLaps: { type: Number, required: true },
  safetyCar: { type: Boolean, default: false },
  vsc: { type: Boolean, default: false },
  fastestLap: {
    driverCode: { type: String },
    time: { type: Number }
  },
  drivers: [DriverSchema]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const Race = mongoose.model<IRaceDocument>('Race', RaceSchema);
