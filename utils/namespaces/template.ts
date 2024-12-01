export const templatesList = [
  "azurill",
  "bronzor",
  "kakuna",
  "rhyhorn",
] as const;

export type Template = (typeof templatesList)[number];
