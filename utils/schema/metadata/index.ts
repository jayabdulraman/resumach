import { z } from "zod";

export const defaultLayout = [
  [
    ["summary", "experience", "education", "projects", "references"],
    ["profiles", "skills", "certifications", "interests", "languages", "awards", "volunteer", "publications"],
  ],
]

// Schema
export const metadataSchema = z.object({
  template: z.string().default("kakuna"),
  layout: z.array(z.array(z.array(z.string()))).default(defaultLayout), // pages -> columns -> sections
  page: z.object({
    margin: z.number().default(18),
    format: z.enum(["a4", "letter"]).default("a4"),
    options: z.object({
      breakLine: z.boolean().default(true),
      pageNumbers: z.boolean().default(true),
    }),
  }),
  typography: z.object({
    font: z.object({
      family: z.string().default("IBM Plex Serif"),
      subset: z.string().default("latin"),
      variants: z.array(z.string()).default(["regular"]),
      size: z.number().default(14),
    })
  }),
  notes: z.string().default(""),
});

// Type
export type Metadata = z.infer<typeof metadataSchema>;

// Defaults
export const defaultMetadata: Metadata = {
  template: "kakuna",
  layout: defaultLayout,
  page: {
    margin: 14,
    format: "a4",
    options: {
      breakLine: true,
      pageNumbers: true,
    },
  },
  typography: {
    font: {
      family: "Merriweather",
      subset: "latin",
      variants: ["regular"],
      size: 13,
    }
  },
  notes: "",
};
