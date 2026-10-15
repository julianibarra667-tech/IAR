import { Reward } from "../context/RewardsContext";
import { API_BASE_URL } from "./api";

type CreateRewardData = Omit<Reward, "id">;

function isReward(value: unknown): value is Reward {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const reward = value as Record<string, unknown>;
  return (
    typeof reward.id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reward.id) &&
    typeof reward.title === "string" &&
    typeof reward.value === "number" &&
    Number.isFinite(reward.value) &&
    typeof reward.points === "number" &&
    Number.isInteger(reward.points) &&
    typeof reward.description === "string"
  );
}

function getErrorMessage(responseData: unknown, status: number) {
  return typeof responseData === "object" &&
    responseData !== null &&
    "message" in responseData &&
    typeof responseData.message === "string"
    ? responseData.message
    : `La API respondió con el estado ${status}.`;
}

export async function getRewards(): Promise<Reward[]> {
  const response = await fetch(`${API_BASE_URL}/rewards`);

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    throw new Error("La API respondió con un formato inválido.");
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(responseData, response.status));
  }

  if (!Array.isArray(responseData) || !responseData.every(isReward)) {
    throw new Error("La respuesta de la API no contiene una lista válida de premios.");
  }

  return responseData;
}

export async function createReward(data: CreateRewardData): Promise<Reward> {
  const response = await fetch(`${API_BASE_URL}/rewards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    throw new Error("La API respondió con un formato inválido.");
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(responseData, response.status));
  }

  if (!isReward(responseData)) {
    throw new Error("La respuesta de la API no contiene un premio válido.");
  }

  return responseData;
}

export async function deleteReward(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/rewards/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return;
  }

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  throw new Error(getErrorMessage(responseData, response.status));
}
