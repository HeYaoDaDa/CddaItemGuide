export function isEmpty(value: unknown): boolean {
  if (typeof value === 'undefined') {
    return true;
  } else if (typeof value === 'string') {
    return value.length === 0;
  } else if (typeof value === 'object') {
    if (value === null) return true;
    if (Array.isArray(value)) return value.length === 0;
  }
  return true;
}

export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}
