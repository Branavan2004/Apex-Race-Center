import { Router, Request, Response } from 'express';

const router = Router();

const DRIVERS = [
  { id: 'ver', name: 'Max Verstappen', team: 'Red Bull Racing', code: 'VER', position: 1 },
  { id: 'nor', name: 'Lando Norris', team: 'McLaren', code: 'NOR', position: 2 },
  { id: 'lec', name: 'Charles Leclerc', team: 'Ferrari', code: 'LEC', position: 3 },
  { id: 'ham', name: 'Lewis Hamilton', team: 'Mercedes', code: 'HAM', position: 4 },
  { id: 'pia', name: 'Oscar Piastri', team: 'McLaren', code: 'PIA', position: 5 },
];

router.get('/', (req: Request, res: Response) => {
  res.json(DRIVERS);
});

export default router;
