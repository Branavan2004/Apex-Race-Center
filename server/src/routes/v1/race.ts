import { Router, Request, Response } from 'express';

const router = Router();

const RACE_DATA = {
  name: 'British Grand Prix',
  track: 'Silverstone Circuit',
  distance: '5.891 km',
  laps: 52,
  weather: {
    temp: 24,
    condition: 'Dry',
    humidity: 45
  }
};

router.get('/current', (req: Request, res: Response) => {
  res.json(RACE_DATA);
});

export default router;
