export const oneOf = <T extends readonly string[]>(options: T) =>
  (value: unknown): value is T[number] => options.includes(value as string)
