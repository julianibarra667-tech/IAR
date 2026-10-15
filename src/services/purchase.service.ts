import { API_BASE_URL } from "./api";

export type PurchaseResponse = {
  message: string;
  earnedExp: number;
  user: {
    id: string;
    points: number;
    level: string;
  };
  purchase: {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
  };
};

function isPurchaseResponse(value: unknown): value is PurchaseResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;
  if (
    typeof response.message !== "string" ||
    typeof response.earnedExp !== "number" ||
    typeof response.user !== "object" ||
    response.user === null ||
    typeof response.purchase !== "object" ||
    response.purchase === null
  ) {
    return false;
  }

  const user = response.user as Record<string, unknown>;
  const purchase = response.purchase as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.points === "number" &&
    typeof user.level === "string" &&
    typeof purchase.id === "string" &&
    typeof purchase.userId === "string" &&
    typeof purchase.productId === "string" &&
    typeof purchase.createdAt === "string"
  );
}

export async function makePurchase(
  userId: string,
  productId: string
): Promise<PurchaseResponse> {
  const response = await fetch(`${API_BASE_URL}/purchases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productId }),
  });

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    throw new Error("La API respondió con un formato inválido.");
  }

  if (!response.ok) {
    const message =
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData &&
      typeof responseData.message === "string"
        ? responseData.message
        : `La API respondió con el estado ${response.status}.`;
    throw new Error(message);
  }

  if (!isPurchaseResponse(responseData)) {
    throw new Error("La respuesta de la API no contiene una compra válida.");
  }

  return responseData;
}