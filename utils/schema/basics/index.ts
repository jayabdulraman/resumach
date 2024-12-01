import { z } from "zod";

import { defaultUrl, urlSchema } from "../shared";
import { customFieldSchema } from "./custom";

// Schema
export const basicsSchema = z.object({
  name: z.string().describe("full name of the candidate."),
  headline: z.string().describe("professional title of the candidate eg Software Engineer."),
  email: z.literal("").or(z.string().email()).describe("email of the candidate"),
  phone: z.string().nullable().describe("Mobile phone number of the candidate."),
  location: z.string().nullable().describe("Location of the candidate e.g Tempe, AZ."),
  url: urlSchema
});

// Type
export type Basics = z.infer<typeof basicsSchema>;

// Defaults
export const defaultBasics: Basics = {
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  url: defaultUrl,
};

export * from "./custom";
