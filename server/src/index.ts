import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { RaceEngine } from './services/raceEngine';
import { setupSocketHandlers } from './handlers/socket.handler';

dotenv.config();

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize services
const raceEngine = new RaceEngine(io);

// Setup Socket Handlers
setupSocketHandlers(io, raceEngine);

// MongoDB Connection (Placeholder)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apex-race-center';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing without MongoDB...');
  })
  .finally(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
