import { z } from "zod";

const SocialLink = z.object({
  label: z.string().describe("label of the link or empty string if null"),
  href: z.string().describe("link or url e.g website link or empty string if null"),
});

const EducationSchema = z.object({
  studyType: z.string().nullable().describe("Degree obtained eg Bachelors of Science in Computer Science"),
  institution: z.string().nullable().describe("Name of the institution."),
  area: z.string().nullable().describe("location of the institution eg Berkeley, CA or Freetown, Sierra Leone."),
  score: z.string().nullable().describe("GPA score of the degree"),
  date: z.string().nullable().describe("Start and end dates of the degree eg May, 2020 - June, 2024."),
  summary: z.string().nullable().describe("Any additional information about the education. Must be an unordered bulleted list html tag format eg <ul><li><p>info.</p></li><ul><li><p>info.</p></li>...</ul>"),
  url: SocialLink.describe("website label and url of the degree or institution"),
});

const ExperienceSchema = z.object({
  position: z.string().nullable().describe("Job title or position."),
  company: z.string().nullable().describe("Name of the company."),
  location: z.string().nullable().describe("City and state or country location of the company eg Tempe, AZ or London, England."),
  summary: z.string().nullable().describe("list of job responsibilities or accomplishments. Must be an unordered bulleted list html tag format eg <ul><li><p>info.</p></li><ul><li><p>info.</p></li>...</ul>"),
  date: z.string().nullable().describe("Start and end dates of the employment e.g May, 2020 - June, 2024."),
  url: SocialLink.describe("website label and url of the company."),
});

const ProjectSchema = z.object({
  name: z.string().nullable().describe("Title of the project."),
  description: z.string().nullable().describe("Description of the project."),
  summary: z.string().nullable().describe("summary of the project. Must be an unordered bulleted list html tag format eg <ul><li><p>info.</p></li><ul><li><p>info.</p></li>...</ul>"),
  url: SocialLink.describe("URL and label of the project."),
  date: z.string().nullable().describe("creation date of the project."),
  keywords: z.array(z.string()).describe("keywords of the project"),
});

const SkillSchema = z.object({
  name: z.string().nullable().describe("category name of the skill."),
  description: z.string().nullable().describe("description of the category"),
  keywords: z.array(z.string()).nullable().describe("list of skills or keywords."),
});

const AwardSchema = z.object({
  title: z.string().nullable().describe("Title of the award."),
  awarder: z.string().nullable().describe("Name of the awarder."),
  date: z.string().nullable().describe("Date when the award was received."),
  url: SocialLink.describe("website label and url of the award"),
  summary: z.string().nullable().describe("Summary of the award. Must be an unordered bulleted list html tag format eg <ul><li><p>info.</p></li><ul><li><p>info.</p></li>...</ul>"),
});

const CertificationSchema = z.object({
  name: z.string().nullable().describe("Name of the certification."),
  issuer: z.string().nullable().describe("Issuer of the certification."),
  date: z.string().nullable().describe("Date when the certification was obtained."),
  url: SocialLink.describe("website label and url of the certification"),
  summary: z.string().nullable().describe("Summary of the certification. Must be an unordered bulleted list html tag format eg <ul><li><p>info.</p></li><ul><li><p>info.</p></li>...</ul>"),
});

const PublicationSchema = z.object({
  name: z.string().nullable().describe("Name of the publication."),
  publisher: z.string().nullable().describe("Publisher of the publication."),
  date: z.string().nullable().describe("Date of publication."),
  url: SocialLink.describe("website label and url of the publication"),
  summary: z.string().nullable().describe("Summary of the publication. Must be an unordered bulleted list html tag format eg <ul><li><p>info.</p></li><ul><li><p>info.</p></li>...</ul>"),
});

const VolunteerSchema = z.object({
  organization: z.string().nullable().describe("Name of the organization."),
  position: z.string().nullable().describe("Position held during volunteering."),
  location: z.string().nullable().describe("Location of the volunteering eg Tempe, AZ."),
  date: z.string().nullable().describe("Date range of the volunteering eg Feb, 2021 - Mar, 2022."),
  url: SocialLink.describe("website label and url of the volunteering"),
  summary: z.string().nullable().describe("Summary of the volunteering experience. Must be an unordered bulleted list html tag format eg <ul><li><p>info.</p></li><ul><li><p>info.</p></li>...</ul>"),
});

const ProfileSchema = z.object({
  network: z.string().nullable().describe("Name of the social network provider e.g Linkedin, Facebook."),
  username: z.string().nullable().describe("username extracted from url/href eg john.doe in https://www.github.com/john.doe"),
  icon: z.string().describe('Slug for the icon from https://simpleicons.org. For example, "github", "linkedin", etc.',),
  url: SocialLink.describe("website label and the candidate's social profile link/href eg {'label':'GitHub', 'href':'https://www.github.com/john.doe'}"),
});

const ReferenceSchema = z.object({
  name: z.string().nullable().describe("Name of the reference."),
  email: z.string().nullable().describe("Email address of the reference."),
  summary: z.string().nullable().describe("Summary of the reference. Must be an unordered bulleted list html tag format eg <ul><li><p>info.</p></li><ul><li><p>info.</p></li>...</ul>"),
  description: z.string().nullable().describe("Description of the reference."),
  url: SocialLink.describe("website label and url of the reference"),
});

export const ResumeSchema = z.object({
  name: z.string().describe("full name of the candidate."),
  headline: z.string().describe("professional title of the candidate eg Software Engineer."),
  email: z.string().describe("email of the candidate"),
  phone: z.string().nullable().describe("Mobile phone number of the candidate."),
  location: z.string().nullable().describe("Location of the candidate e.g Tempe, AZ."),
  website: SocialLink.nullable().describe("Personal website URL and label of candidate."),
  summary: z.string().nullable().describe("Summary of the user's profile."),
  profile: ProfileSchema.array().nullable().describe("Array of social media profiles eg X/twitter, github, facebook etc"),
  education: EducationSchema.array().nullable().describe("Array of education records."),
  experience: ExperienceSchema.array().nullable().describe("Array of employment experience records."),
  skill: SkillSchema.array().describe("Array of skills."),
  project: ProjectSchema.array().nullable().describe("Array of projects."),
  award: AwardSchema.array().nullable().describe("Array of awards."),
  certification: CertificationSchema.array().nullable().describe("Array of certifications."),
  volunteer: VolunteerSchema.array().nullable().describe("Array of volunteering experiences."),
  publication: PublicationSchema.array().nullable().describe("Array of publications."),
  reference: ReferenceSchema.array().nullable().describe("Array of references."),
});

