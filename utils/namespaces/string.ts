import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";

import { LayoutLocator, SortablePayload } from "./types";

export function getInitials(name: string) {
  // eslint-disable-next-line unicorn/better-regex
  const regex = new RegExp(/(\p{L}{1})\p{L}+/gu);
  const initials = [...name.matchAll(regex)];

  return ((initials.shift()?.[1] ?? "") + (initials.pop()?.[1] ?? "")).toUpperCase();
};

export function isUrl(string: string | null | undefined) {
  if (!string) return false;

  const urlRegex = /https?:\/\/[^\n ]+/i;

  return urlRegex.test(string);
};

export function isEmptyString(string: string) {
  if (string === "<p></p>" || !string) return true;
  return string.trim().length === 0;
};

export function extractUrl(string: string) {
  const urlRegex = /https?:\/\/[^\n ]+/i;

  const result = urlRegex.exec(string);
  return result ? result[0] : null;
};

export function kebabCase(string?: string | null) {
  if (!string) return "";

  return (
    string
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/gu)
      ?.join("-")
      .toLowerCase() ?? ""
  );
};

export function generateRandomName() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, adjectives, animals],
    style: "capital",
    separator: " ",
    length: 3,
  });
};

export function processUsername(string?: string | null) {
  if (!string) return "";

  return string.replace(/[^\d.A-Za-z-]/g, "").toLowerCase();
};

export function parseLayoutLocator(payload: SortablePayload | null): LayoutLocator {
  if (!payload) return { page: 0, column: 0, section: 0 };

  const section = payload.index;
  const [page, column] = payload.containerId.split(".").map(Number);

  return { page, column, section };
};
