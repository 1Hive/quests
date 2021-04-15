export function wrapError(message, obj) {
  const objJson = JSON.stringify(obj, null, 2);
  return Error(`Error : ${message}\n${objJson}`);
}
