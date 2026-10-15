export interface RewardRequestDTO {
  title: string;
  value: number;
  points: number;
  description: string;
}

export interface RewardResponseDTO extends RewardRequestDTO {
  id: string;
}
