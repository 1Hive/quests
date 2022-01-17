export function arrayDistinct<TItem>(arr: TItem[]): TItem[] {
  return [...new Set(arr)];
}

/**
 * Src : https://codeburst.io/javascript-array-distinct-5edc93501dc4
 */
// eslint-disable-next-line no-unused-vars
export function arrayDistinctBy<TItem>(arr: TItem[], predicateId: (item: TItem) => any): TItem[] {
  const result: TItem[] = [];
  const map = new Map();
  arr.forEach((item) => {
    const id = predicateId(item);
    if (!map.has(id)) {
      map.set(id, true); // set any value to Map
      result.push(item);
    }
  });
  return result;
}
