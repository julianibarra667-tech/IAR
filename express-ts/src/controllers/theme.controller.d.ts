import { Request, Response } from 'express';
import { ThemeName, ThemeService } from '../services/theme.service';
export declare class ThemeController {
    private themeService;
    constructor(themeService: ThemeService);
    getTheme: (_req: Request, res: Response<{
        theme: ThemeName;
    }>) => Promise<void>;
    updateTheme: (req: Request<{}, {}, unknown>, res: Response<{
        theme: ThemeName;
    } | {
        message: string;
        code: number;
    }>) => Promise<void>;
}
//# sourceMappingURL=theme.controller.d.ts.map