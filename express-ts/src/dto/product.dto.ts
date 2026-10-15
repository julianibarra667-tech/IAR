export interface ProductRequestDTO {
  name: string;
  price: number;
  points: number;
  imageUri?: string | null;
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  price: number;
  points: number;
  imageUri: string | null;
}
