export const randomId = (prefix?: string) => {
  const id = window.crypto.randomUUID();
  return prefix ? `${prefix}-${id}` : id
};
