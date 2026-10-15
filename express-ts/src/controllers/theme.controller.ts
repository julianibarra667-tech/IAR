import { Request, Response } from 'express';
import { ThemeName, ThemeService } from '../services/theme.service.js';

const isThemeName = (value: unknown): value is ThemeName =>
  value === 'dark' || value === 'light';

export class ThemeController {
  constructor(private themeService: ThemeService) {}

  getTheme = async (_req: Request, res: Response<{ theme: ThemeName }>): Promise<void> => {
    res.status(200).json({ theme: await this.themeService.getTheme() });
  };

  updateTheme = async (
    req: Request<{}, {}, unknown>,
    res: Response<{ theme: ThemeName } | { message: string; code: number }>
  ): Promise<void> => {
    if (
      typeof req.body !== 'object' ||
      req.body === null ||
      !('theme' in req.body) ||
      !isThemeName(req.body.theme)
    ) {
      res.status(400).json({
        message: 'Invalid theme. Choose "dark" or "light".',
        code: 400
      });
      return;
    }

    res.status(200).json({
      theme: await this.themeService.updateTheme(req.body.theme)
    });
  };
}
