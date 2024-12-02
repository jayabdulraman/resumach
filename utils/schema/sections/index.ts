import { FilterKeys } from "../../types";
import { z } from "zod";

import { idSchema } from "../shared";
import { awardSchema } from "./award";
import { certificationSchema } from "./certification";
import { customSectionSchema } from "./custom-section";
import { educationSchema } from "./education";
import { experienceSchema } from "./experience";
import { profileSchema } from "./profile";
import { projectSchema } from "./project";
import { publicationSchema } from "./publication";
import { referenceSchema } from "./reference";
import { skillSchema } from "./skill";
import { volunteerSchema } from "./volunteer";

// Schema
export const sectionSchema = z.object({
  name: z.string(),
  visible: z.boolean().default(true),
});

// Schema
export const customSchema = sectionSchema.extend({
  identifier: idSchema,
  items: z.array(customSectionSchema),
});

export const sectionsSchema = z.object({
  summary: sectionSchema.extend({
    identifier: z.literal("summary"),
    content: z.string().default(""),
  }),
  awards: sectionSchema.extend({
    identifier: z.literal("awards"),
    items: z.array(awardSchema),
  }),
  certifications: sectionSchema.extend({
    identifier: z.literal("certifications"),
    items: z.array(certificationSchema),
  }),
  education: sectionSchema.extend({
    identifier: z.literal("education"),
    items: z.array(educationSchema),
  }),
  experience: sectionSchema.extend({
    identifier: z.literal("experience"),
    items: z.array(experienceSchema),
  }),
  volunteer: sectionSchema.extend({
    identifier: z.literal("volunteer"),
    items: z.array(volunteerSchema),
  }),
  profiles: sectionSchema.extend({
    identifier: z.literal("profiles"),
    items: z.array(profileSchema),
  }),
  projects: sectionSchema.extend({
    identifier: z.literal("projects"),
    items: z.array(projectSchema),
  }),
  publications: sectionSchema.extend({
    identifier: z.literal("publications"),
    items: z.array(publicationSchema),
  }),
  references: sectionSchema.extend({
    identifier: z.literal("references"),
    items: z.array(referenceSchema),
  }),
  skills: sectionSchema.extend({
    identifier: z.literal("skills"),
    items: z.array(skillSchema),
  }),
  custom: z.record(z.string(), customSchema),
});

// Detailed Types
export type Section = z.infer<typeof sectionSchema>;
export type Sections = z.infer<typeof sectionsSchema>;

export type SectionKey = "basics" | keyof Sections | `custom.${string}`;
export type SectionWithItem<T = unknown> = Sections[FilterKeys<Sections, { items: T[] }>];
export type SectionItem = SectionWithItem["items"][number];
export type CustomSectionGroup = z.infer<typeof customSchema>;

// Defaults
export const defaultSection: Section = {
  name: "",
  visible: true,
};

export const defaultSections: Sections = {
  summary: { ...defaultSection, identifier: "summary", name: "Summary", content: "" },
  awards: { ...defaultSection, identifier: "awards", name: "Awards", items: [] },
  certifications: { ...defaultSection, identifier: "certifications", name: "Certifications", items: [] },
  education: { ...defaultSection, identifier: "education", name: "Education", items: [] },
  experience: { ...defaultSection, identifier: "experience", name: "Experience", items: [] },
  volunteer: { ...defaultSection, identifier: "volunteer", name: "Volunteering", items: [] },
  profiles: { ...defaultSection, identifier: "profiles", name: "Profiles", items: [] },
  projects: { ...defaultSection, identifier: "projects", name: "Projects", items: [] },
  publications: { ...defaultSection, identifier: "publications", name: "Publications", items: [] },
  references: { ...defaultSection, identifier: "references", name: "References", items: [] },
  skills: { ...defaultSection, identifier: "skills", name: "Skills", items: [] },
  custom: {},
};

export * from "./award";
export * from "./certification";
export * from "./custom-section";
export * from "./education";
export * from "./experience";
export * from "./profile";
export * from "./project";
export * from "./publication";
export * from "./reference";
export * from "./skill";
export * from "./volunteer";
