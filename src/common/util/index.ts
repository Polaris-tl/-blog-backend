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

export function listToTree<T extends Record<string, any> = any>(
  list: T[],
  id = 'id',
  pid = 'pid',
  children = 'children',
) {
  const result: T[] = [];
  const hash = {};
  list.forEach((item) => {
    hash[item[id]] = item;
  });
  list.forEach((item) => {
    const hashVP = hash[item[pid]]; // hash value parent
    if (hashVP) {
      if (!hashVP[children]) {
        hashVP[children] = [];
      }
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}
