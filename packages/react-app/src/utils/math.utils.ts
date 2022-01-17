export function roundNumber(number: number, decimalPlaces?: number): number {
  const factorOfTen = 10 ** (decimalPlaces ?? 0);
  return Math.round(number * factorOfTen) / factorOfTen;
}
export function floorNumber(number: number, decimalPlaces?: number): number {
  const factorOfTen = 10 ** (decimalPlaces ?? 0);
  return Math.floor(number * factorOfTen) / factorOfTen;
}
