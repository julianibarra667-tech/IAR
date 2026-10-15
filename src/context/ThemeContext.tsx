import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getTheme, updateTheme } from "../services/theme.service";

export type ThemeName = "dark" | "light";

const palettes = {
  dark: {
    screen: "#050207",
    shell: "#2a0f2f",
    surface: "#4a1a58",
    surfaceStrong: "#5e1d68",
    subtleSurface: "rgba(255,255,255,0.08)",
    text: "#f5dcff",
    mutedText: "#e4c5ef",
    label: "#f0d8ff",
    accent: "#d89ce8",
    accentText: "#4a0f51",
    border: "#9b8ca1",
    input: "#f0edf1",
    inputText: "#2b1b31",
    error: "#ffd4dc",
  },
  light: {
    screen: "#eee8f0",
    shell: "#fffaff",
    surface: "#f1e5f3",
    surfaceStrong: "#e5d3e9",
    subtleSurface: "#f5eef7",
    text: "#35163b",
    mutedText: "#6f5575",
    label: "#46204d",
    accent: "#7c3187",
    accentText: "#ffffff",
    border: "#c4a9ca",
    input: "#ffffff",
    inputText: "#2b1b31",
    error: "#9c2444",
  },
} as const;

type ThemeColors = (typeof palettes)[ThemeName];

type ThemeContextValue = {
  theme: ThemeName;
  colors: ThemeColors;
  isLoading: boolean;
  syncError: string | null;
  changeTheme: (theme: ThemeName) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("dark");
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getTheme()
      .then((serverTheme) => {
        if (isActive) {
          setTheme(serverTheme);
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setSyncError(
            error instanceof Error
              ? error.message
              : "No se pudo cargar el tema del servidor."
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const changeTheme = useCallback(async (nextTheme: ThemeName) => {
    setSyncError(null);
    try {
      const confirmedTheme = await updateTheme(nextTheme);
      setTheme(confirmedTheme);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar el tema en el servidor.";
      setSyncError(message);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      colors: palettes[theme],
      isLoading,
      syncError,
      changeTheme,
    }),
    [theme, isLoading, syncError, changeTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider.");
  }

  return context;
}
