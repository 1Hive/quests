export function exposeGlobally(something: any) {
  (window as any).something = something;
}
