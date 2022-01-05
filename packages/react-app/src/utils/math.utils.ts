export function roundNumber(number: any, decimalPlaces?: number): number {
  const factorOfTen = 10 ** (decimalPlaces ?? 0);
  return Math.round(number * factorOfTen) / factorOfTen;
}
export function floorNumber(number: any, decimalPlaces?: number): number {
  const factorOfTen = 10 ** (decimalPlaces ?? 0);
  return Math.floor(number * factorOfTen) / factorOfTen;
}
