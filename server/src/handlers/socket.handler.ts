import { Server, Socket } from 'socket.io';
import { RaceEngine } from '../services/raceEngine';

export const setupSocketHandlers = (io: Server, raceEngine: RaceEngine) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a specific race room
    socket.on('race:join', async (raceId: string) => {
      console.log(`Client ${socket.id} joining race room: ${raceId}`);
      
      // Leave any existing race rooms
      const rooms = Array.from(socket.rooms);
      rooms.forEach(room => {
        if (room.startsWith('race:')) {
          socket.leave(room);
        }
      });

      socket.join(`race:${raceId}`);
      
      // Start the engine for this race if not already started
      // In a production app, this might be triggered by an admin or race start event
      await raceEngine.startRace(raceId);

      socket.emit('joined', { raceId });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
