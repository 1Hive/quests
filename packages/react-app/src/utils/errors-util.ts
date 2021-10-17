export function wrapError(message: String, obj: any) {
  const objJson = JSON.stringify(obj, null, 2);
  return Error(`Error : ${message}\n${objJson}`);
}
