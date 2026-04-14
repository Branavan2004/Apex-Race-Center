import { Request, Response } from 'express';
import { Race } from '../models/Race';

export class RaceController {
  static async getAllRaces(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const query: any = {};
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;
      const [races, total] = await Promise.all([
        Race.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Race.countDocuments(query)
      ]);

      return res.status(200).json({
        success: true,
        data: races,
        meta: {
          page,
          limit,
          total
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Error fetching races'
      });
    }
  }

  static async getRaceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const race = await Race.findById(id);

      if (!race) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Race not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: race
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid race ID'
      });
    }
  }

  static async getDrivers(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const race = await Race.findById(id).select('drivers');

      if (!race) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Race not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: race.drivers
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Error fetching drivers'
      });
    }
  }

  static async getLapTimes(req: Request, res: Response) {
    // For now, returning mock historical lap times as requested
    // In a full implementation, these would be in a separate collection
    return res.status(200).json({
      success: true,
      data: [
        { lap: 1, timeMs: 95000, compound: 'medium' },
        { lap: 2, timeMs: 93500, compound: 'medium' },
        { lap: 3, timeMs: 93200, compound: 'medium' }
      ]
    });
  }
}
