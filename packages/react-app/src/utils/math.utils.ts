export function roundDecimals(number: any, decimalPlaces: number): number {
  const factorOfTen = 10 ** decimalPlaces;
  return Math.round(number * factorOfTen) / factorOfTen;
}
