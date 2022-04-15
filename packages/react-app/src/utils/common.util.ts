export function sleep(ms: number = 0) {
  return new Promise((res) => setTimeout(res, ms));
}
