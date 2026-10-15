import { API_BASE_URL } from "./api";
import type { ThemeName } from "../context/ThemeContext";

function isThemeName(value: unknown): value is ThemeName {
  return value === "dark" || value === "light";
}

function readTheme(responseData: unknown): ThemeName {
  if (
    typeof responseData !== "object" ||
    responseData === null ||
    !("theme" in responseData) ||
    !isThemeName(responseData.theme)
  ) {
    throw new Error("La respuesta de la API contiene un tema inválido.");
  }

  return responseData.theme;
}

async function readError(response: Response): Promise<Error> {
  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  const message =
    typeof responseData === "object" &&
    responseData !== null &&
    "message" in responseData &&
    typeof responseData.message === "string"
      ? responseData.message
      : `La API respondió con el estado ${response.status}.`;

  return new Error(message);
}

export async function getTheme(): Promise<ThemeName> {
  const response = await fetch(`${API_BASE_URL}/theme`);
  if (!response.ok) {
    throw await readError(response);
  }

  return readTheme(await response.json());
}

export async function updateTheme(theme: ThemeName): Promise<ThemeName> {
  const response = await fetch(`${API_BASE_URL}/theme`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ theme }),
  });

  if (!response.ok) {
    throw await readError(response);
  }

  return readTheme(await response.json());
}
