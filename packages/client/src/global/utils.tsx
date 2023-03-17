export function isObject(item: any): item is object {
  return typeof item === 'object' && item !== null
}
