import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

// Routes
import driverRouter from './routes/v1/drivers';
import raceRouter from './routes/v1/race';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API v1 Routers
app.use('/api/v1/drivers', driverRouter);
app.use('/api/v1/race', raceRouter);

export default app;
