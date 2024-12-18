import {
  Award,
  Certification,
  CustomSection,
  CustomSectionGroup,
  Education as EducationSchema,
  Experience as ExperienceSchema,
  Project,
  Publication,
  Reference,
  SectionKey,
  SectionWithItem,
  Skill,
  URL,
  Volunteer as VolunteerSchema,
} from "@/utils/schema";
import { isEmptyString, isUrl } from "@/utils/namespaces/string";
import { linearTransform } from "@/utils/namespaces/number";
import { cn } from "@/utils/namespaces/style";
import get from "lodash.get";
import React, { Fragment } from "react";
import { Phone } from "@phosphor-icons/react";
import { TemplateProps } from "../types/template";
import { useResumeStore } from "@/utils/stores/resume";

const Header = () => {
  const basics = useResumeStore((state) => state.resume.data.basics);
  const profiles = useResumeStore((state) => state.resume.data.sections.profiles);
  const fontSize = useResumeStore((state) => state.resume.data.metadata.typography.font.size);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 pb-2 pt-3 text-center">
      {/* <Picture /> */}

      <div>
        <div className="text-2xl font-bold">{basics.name}</div>
        {/* <div className="text-base">{basics.headline}</div> */}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
        {basics.location && (
          <div className="flex items-center gap-x-1.5">
            <i className="ph ph-bold ph-map-pin text-primary" />
            {/* <div>{basics.location}</div> */}
          </div>
        )}
        {basics.phone && (
          <div className="flex items-center gap-x-1.5">
            {/* <i className="ph ph-bold ph-phone text-primary" /> */}
            <Phone className="text-primary" />
            <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
              {basics.phone}
            </a>
          </div>
        )}
        {basics.email && (
          <div className="flex items-center gap-x-1.5">
            <i className="ph ph-bold ph-at text-primary" />
            <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
              {basics.email}
            </a>
          </div>
        )}
        <Link url={basics.url} />
        
      </div>
      {profiles.visible && profiles.items.length > 0 && (
        <div className="flex items-center gap-x-3 gap-y-0.5">
          {profiles.items
            .filter((item) => item.visible)
            .map((item) => (
              <div key={item.id} className="flex items-center gap-x-2">
                <Link
                  url={item.url}
                  label={item.username}
                  className="text-sm"
                  icon={
                    <img
                      className="ph"
                      width={fontSize}
                      height={fontSize}
                      alt={item.network}
                      src={`https://cdn.simpleicons.org/${item.icon}`}
                    />
                  }
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const Summary = () => {
  const section = useResumeStore((state) => state.resume.data.sections.summary);
  

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.identifier} className="px-3">
      <div className="mb-2 hidden font-bold text-black group-[.main]:block">
        <h4>{section.name}</h4>
      </div>

      <div className="mb-2 hidden items-center gap-x-2 text-center font-bold text-black group-[.sidebar]:flex">
        <div className="size-1.5 rounded-full border border-slate-400" />
        <h4>{section.name}</h4>
        <div className="size-1.5 rounded-full border border-slate-400" />
      </div>

      <main className={cn("relative space-y-2", "border-l border-primary pl-4")}>
        <div className="absolute left-[-4.5px] top-[8px] hidden size-[8px] rounded-full bg-primary group-[.main]:block" />

        <div
          dangerouslySetInnerHTML={{ __html: section.content }}
          className="wysiwyg"
          style={{ columns: 1 }}
        />
      </main>
    </section>
  );
};

type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => (
  <div className="relative h-1 w-[128px] group-[.sidebar]:mx-auto">
    <div className="absolute inset-0 h-1 w-[128px] rounded bg-slate-400 opacity-25" />
    <div
      className="absolute inset-0 h-1 rounded bg-slate-400"
      style={{ width: linearTransform(level, 0, 5, 0, 128) }}
    />
  </div>
);

type LinkProps = {
  url: URL;
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
};

const Link = ({ url, icon, iconOnRight, label, className }: LinkProps) => {
  if (!isUrl(url.href)) return null;
  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight && (icon ?? <i className="ph ph-bold ph-link text-black" />)}
      <a
        href={url.href as string}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label || url.label || url.href}
      </a>
      {iconOnRight && (icon ?? <i className="ph ph-bold ph-link text-black" />)}
    </div>
  );
};

type LinkedEntityProps = {
  name: string;
  url: URL;
  separateLinks: boolean;
  className?: string;
};

const LinkedEntity = ({ name, url, separateLinks, className }: LinkedEntityProps) => {
  return (
    <div className={className}>
      {separateLinks && isUrl(url?.href || "")? (
        <Link
          url={url}
          label={name}
          icon={<i className="ph ph-bold ph-globe text-black" />}
          iconOnRight={true}
        />
      ) : (
        <div>{name}</div>
      )}
    </div>
  );
};

type SectionProps<T> = {
  section: SectionWithItem<T> | CustomSectionGroup;
  children?: (item: T) => React.ReactNode;
  className?: string;
  urlKey?: keyof T;
  levelKey?: keyof T;
  summaryKey?: keyof T;
  keywordsKey?: keyof T;
};

const Section = <T,>({
  section,
  children,
  className,
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
}: SectionProps<T>) => {
  if (!section.visible || section.items.length === 0) return null;

  return (
    <section id={section.identifier} className="grid">
      <div className="mb-2 hidden font-bold text-black group-[.main]:block">
        <h4>{section.name}</h4>
      </div>

      <div className="mx-auto mb-2 hidden items-center gap-x-2 text-center font-bold text-black group-[.sidebar]:flex">
        <div className="size-1.5 rounded-full border border-slate-400" />
        <h4>{section.name}</h4>
        <div className="size-1.5 rounded-full border border-slate-400" />
      </div>

      <div
        className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center"
        style={{ gridTemplateColumns: `repeat(${1}, 1fr)` }}
      >
        {section.items
          .filter((item) => item.visible)
          .map((item) => {
            const url = (urlKey && get(item, urlKey)) as URL | undefined;
            const level = (levelKey && get(item, levelKey, 0)) as number | undefined;
            const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
            const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

            return (
              <div
                key={item.id}
                className={cn(
                  "relative space-y-2",
                  "border-primary group-[.main]:border-l group-[.main]:pl-4",
                  className,
                )}
              >
                <div>{children?.(item as T)}</div>

                {summary !== undefined && !isEmptyString(summary) && (
                  <div dangerouslySetInnerHTML={{ __html: summary }} className="wysiwyg" />
                )}

                {level !== undefined && level > 0 && <Rating level={level} />}

                {keywords !== undefined && keywords.length > 0 && (
                  <p className="text-sm">{keywords.join(", ")}</p>
                )}

                {/* {url !== undefined && <Link url={url} />} */}

                <div className="absolute left-[-4.5px] top-px hidden size-[8px] rounded-full bg-primary group-[.main]:block" />
              </div>
            );
          })}
      </div>
    </section>
  );
};

const Experience = () => {
  const section = useResumeStore((state) => state.resume.data.sections.experience);

  return (
    <Section<ExperienceSchema> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="space-y-1">
          {/* Company and Location row */}
          <div className="flex items-center justify-between">
            <LinkedEntity
              name={item.company}
              url={item.url}
              separateLinks={true}
              className="font-bold"
            />
            <div className="mr-3">{item.date}</div>
          </div>
          
          {/* Position and Date row */}
          <div className="flex items-center justify-between">
            <div>{item.position}</div>
            <div className="text-right mr-3">{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Education = () => {
  const section = useResumeStore((state) => state.resume.data.sections.education);

  return (
    <Section<EducationSchema> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="space-y-1">
        <div className="flex items-center justify-between">
          <LinkedEntity
            name={item.institution}
            url={item.url}
            separateLinks={true}
            className="font-bold"
          />
          <div className="mr-3">{item.date}</div>
        </div>
        {/* Position and Date row */}
        <div className="flex items-center justify-between">
          <div>{item.studyType} {item.score && ` - ${item.score}`}</div>
          <div className="text-right mr-3">{item.area}</div>
        </div>
      </div>
      )}
    </Section>
  );
};

const Awards = () => {
  const section = useResumeStore((state) => state.resume.data.sections.awards);

  return (
    <Section<Award> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.title}</div>
          <LinkedEntity name={item.awarder} url={item.url} separateLinks={true} />
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Certifications = () => {
  const section = useResumeStore((state) => state.resume.data.sections.certifications);

  return (
    <Section<Certification> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <LinkedEntity name={item.issuer} url={item.url} separateLinks={true} />
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = useResumeStore((state) => state.resume.data.sections.skills);
  

  return (
    <Section<Skill> section={section} keywordsKey="keywords">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
        </div>
      )}
    </Section>
  );
};

const Publications = () => {
  const section = useResumeStore((state) => state.resume.data.sections.publications);

  return (
    <Section<Publication> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={true}
            className="font-bold"
          />
          <div>{item.publisher}</div>
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Volunteer = () => {
  const section = useResumeStore((state) => state.resume.data.sections.volunteer);
  

  return (
    <Section<VolunteerSchema> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.organization}
            url={item.url}
            separateLinks={true}
            className="font-bold"
          />
          <div>{item.position}</div>
          <div>{item.location}</div>
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Projects = () => {
  const section = useResumeStore((state) => state.resume.data.sections.projects);

  return (
    <Section<Project> section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords">
      {(item) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={true}
              className="font-bold"
            />
            <div className="text-right mr-3">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const References = () => {
  const section = useResumeStore((state) => state.resume.data.sections.references);

  return (
    <Section<Reference> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={true}
            className="font-bold"
          />
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Custom = ({ id }: { id: string }) => {
  const section = useResumeStore((state) => state.resume.data.sections.custom[id]);

  return (
    <Section<CustomSection>
      section={section}
      urlKey="url"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item) => (
        <div>
          <div>
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={true}
              className="font-bold"
            />
            <div>{item.description}</div>

            <div className="font-bold">{item.date}</div>
            <div>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const mapSectionToComponent = (section: SectionKey) => {
  switch (section) {
    case "summary": {
      return <Summary />;
    }
    case "experience": {
      return <Experience />;
    }
    case "education": {
      return <Education />;
    }
    case "awards": {
      return <Awards />;
    }
    case "certifications": {
      return <Certifications />;
    }
    case "skills": {
      return <Skills />;
    }
    case "publications": {
      return <Publications />;
    }
    case "volunteer": {
      return <Volunteer />;
    }
    case "projects": {
      return <Projects />;
    }
    case "references": {
      return <References />;
    }
    default: {
      if (section.startsWith("custom.")) return <Custom id={section.split(".")[1]} />;

      return null;
    }
  }
};

export default function Azurill({ columns, isFirstPage = false }: TemplateProps) {
  const [main, sidebar] = columns;

  return (
    <div 
      id="resume-id"
      className="p-custom space-y-3">
      {isFirstPage && <Header />}

      <div className="grid grid-cols-3 gap-x-4">
        <div className="sidebar group space-y-4">
          {sidebar.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>

        <div className="main group col-span-2 space-y-4">
          {main.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
