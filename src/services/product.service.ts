import { Product } from "../context/ProductsContext";
import { API_BASE_URL } from "./api";

type CreateProductData = Omit<Product, "id">;

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Record<string, unknown>;
  return (
    typeof product.id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product.id) &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    typeof product.points === "number" &&
    Number.isInteger(product.points) &&
    (typeof product.imageUri === "string" || product.imageUri === null)
  );
}

function getErrorMessage(data: unknown, status: number): string {
  return typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
    ? data.message
    : `La API respondió con el estado ${status}.`;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new Error("La API respondió con un formato inválido.");
  }
}

function isProductList(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  const responseData = await readJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(responseData, response.status));
  }
  if (!isProductList(responseData)) {
    throw new Error("La respuesta de la API no contiene una lista de productos válida.");
  }
  return responseData;
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await readJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(responseData, response.status));
  }

  if (!isProduct(responseData)) {
    throw new Error("La respuesta de la API no contiene un producto válido.");
  }

  return responseData;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
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
