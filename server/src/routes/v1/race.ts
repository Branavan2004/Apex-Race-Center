import { Router } from 'express';
import { RaceController } from '../../controllers/race.controller';

const router = Router();

// GET /api/v1/race/
router.get('/', RaceController.getAllRaces);

// GET /api/v1/race/:id
router.get('/:id', RaceController.getRaceById);

// GET /api/v1/race/:id/drivers
router.get('/:id/drivers', RaceController.getDrivers);

// GET /api/v1/race/:id/laptimes
router.get('/:id/laptimes', RaceController.getLapTimes);

export default router;
