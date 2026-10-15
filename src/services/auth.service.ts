import { API_BASE_URL } from "./api";

export type AuthUser = {
  id: string;
  username: string;
  name: string;
  lastName: string;
  fullName: string;
  age: number;
  level: string;
  points: number;
  status: boolean;
  createdAt: string;
};

export type RegisterInput = {
  username: string;
  password: string;
  name: string;
  lastName: string;
  age: number;
};

export type LoginInput = {
  username: string;
  password: string;
};

type AuthResponse = {
  message: string;
  user: AuthUser;
};

function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== "object" || value === null) return false;
  const response = value as Record<string, unknown>;
  if (
    typeof response.message !== "string" ||
    typeof response.user !== "object" ||
    response.user === null
  ) {
    return false;
  }

  const user = response.user as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.username === "string" &&
    typeof user.name === "string" &&
    typeof user.lastName === "string" &&
    typeof user.fullName === "string" &&
    typeof user.age === "number" &&
    typeof user.level === "string" &&
    typeof user.points === "number" &&
    typeof user.status === "boolean" &&
    typeof user.createdAt === "string"
  );
}

async function postAuthRequest(
  endpoint: "login" | "register",
  body: LoginInput | RegisterInput
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("La API respondió con un formato inválido.");
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `La API respondió con el estado ${response.status}.`;
    throw new Error(message);
  }

  if (!isAuthResponse(data)) {
    throw new Error("La respuesta de autenticación no es válida.");
  }
  return data;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  return postAuthRequest("login", input);
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  return postAuthRequest("register", input);
}
