export function calculateLevel(points: number): string {
  if (points >= 1000) return 'Diamante';
  if (points >= 500) return 'Oro';
  if (points >= 200) return 'Plata';
  return 'Bronce';
}
