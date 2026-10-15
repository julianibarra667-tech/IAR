export type ThemeName = 'dark' | 'light';

export class ThemeService {
  private theme: ThemeName = 'dark';

  async getTheme(): Promise<ThemeName> {
    return this.theme;
  }

  async updateTheme(theme: ThemeName): Promise<ThemeName> {
    this.theme = theme;
    return this.theme;
  }
}
