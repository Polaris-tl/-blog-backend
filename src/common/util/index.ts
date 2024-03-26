export function pickFields<T extends Record<string, any> = any>(
  user: T,
  fields: string[],
): Partial<T> {
  const result = {};
  fields.forEach((field) => {
    result[field] = user[field];
  });
  return result;
}
