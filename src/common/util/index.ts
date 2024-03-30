export function pickFields<T extends Record<string, any> = any>(
  user: T,
  fields: Array<keyof T>,
): Partial<T> {
  const result: Partial<T> = {};
  fields.forEach((field) => {
    result[field] = user[field];
  });
  return result;
}
