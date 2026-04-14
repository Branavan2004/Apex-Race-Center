import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for production
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Telemetry Simulation loop
  let lap = 1;
  let speed = 280;
  let gear = 8;
  
  const simulationInterval = setInterval(() => {
    // Generate some variability
    const change = Math.floor(Math.random() * 20) - 10;
    speed = Math.max(150, Math.min(340, speed + change));
    
    // Simple gear logic
    if (speed > 300) gear = 8;
    else if (speed > 250) gear = 7;
    else if (speed > 200) gear = 6;
    else gear = 5;

    const data = {
      speed,
      gear,
      rpm: 10000 + Math.floor(Math.random() * 2000),
      throttle: 70 + Math.floor(Math.random() * 30),
      brake: Math.random() > 0.9 ? Math.floor(Math.random() * 100) : 0,
      drs: speed > 300,
      lap: lap,
      position: 1
    };

    socket.emit('telemetry_update', data);

    // Increment lap occasionally
    if (Math.random() > 0.999) lap++;
  }, 100); // 10Hz updates

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(simulationInterval);
  });
});

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
