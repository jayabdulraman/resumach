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
import { cn } from "@/utils/namespaces/style";
import get from "lodash.get";
import React, { Fragment } from "react";
import { TemplateProps } from "../types/template";
import { useResumeStore } from "@/utils/stores/resume";

const Header = () => {
  const basics = useResumeStore((state) => state.resume.data.basics);
  const profiles = useResumeStore((state) => state.resume.data.sections.profiles);
  const fontSize = useResumeStore((state) => state.resume.data.metadata.typography.font.size);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 pt-3 text-center">
      {/* <Picture /> */}

      <div>
        {/* <div className="text-2xl font-bold">{basics.name}</div> */}
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
            <i className="ph ph-bold ph-phone text-primary" />
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
            <img width={fontSize} height={fontSize} src={`${process.env.NEXT_PUBLIC_BASE_URL}/screenshots/icon.png`} alt="favicon"/>
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
      <h4 className="mb-2 border-b border-slate-400 text-center font-bold text-black">
        {section.name}
      </h4>

      <div
        dangerouslySetInnerHTML={{ __html: section.content }}
        className="wysiwyg"
        style={{ columns: 1 }}
      />
    </section>
  );
};

type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => (
  <div className="flex items-center gap-x-1.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className={cn("h-3 w-5 rounded border-2 border-slate-400", level > index && "bg-slate-400")}
      />
    ))}
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
  if (!isUrl(url?.href)) return null;
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
    <section id={section.identifier} className="grid px-3">
      <h4 className="mb-2 border-b border-slate-400 text-center font-bold text-black">
        {section.name}
      </h4>

      <div
        className="grid gap-x-6 gap-y-3"
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
              <div key={item.id} className={cn("space-y-2", className)}>
                <div>{children?.(item as T)}</div>

                {summary !== undefined && !isEmptyString(summary) && (
                  <div dangerouslySetInnerHTML={{ __html: summary }} className="wysiwyg" />
                )}

                {level !== undefined && level > 0 && <Rating level={level} />}

                {keywords !== undefined && keywords.length > 0 && (
                  <p className="text-sm">{keywords.join(", ")}</p>
                )}

                {/* {url !== undefined && <Link url={url} />} */}
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
            <div className="">{item.date}</div>
          </div>
          
          {/* Position and Date row */}
          <div className="flex items-center justify-between">
            <div>{item.position}</div>
            <div className="text-right">{item.location}</div>
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
            <div className="">{item.date}</div>
          </div>
          {/* Position and Date row */}
          <div className="flex items-center justify-between">
            <div>{item.studyType} {item.score && ` - ${item.score}`}</div>
            <div className="text-right">{item.area}</div>
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
       <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="font-bold">{item.title}</div>
            <div className="text-right">{item.date}</div>
          </div>
          <LinkedEntity name={item.awarder} url={item.url} separateLinks={true} />
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
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="font-bold">{item.name}</div>
            <div className="text-right">{item.date}</div>
          </div>
          <LinkedEntity name={item.issuer} url={item.url} separateLinks={true} />
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = useResumeStore((state) => state.resume.data.sections.skills);
  

  return (
    <Section<Skill> section={section}>
      {(item) => (
        <div className="flex items-center gap-1">
          <div className="font-bold">{item.name}:</div>
          {item.keywords && item.keywords.length > 0 && (
            <div className="text-sm">
              {item.keywords.join(", ")}
            </div>
          )}
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
       <div className="space-y-1">
        <div className="flex items-center justify-between">
          <LinkedEntity
            name={item.organization}
            url={item.url}
            separateLinks={true}
            className="font-bold"
          />
          <div className="text-right">{item.date}</div>
        </div>
        <div className="flex items-center justify-between">
          <div>{item.position}</div>
          <div className="text-right">{item.location}</div>
        </div>
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
            <div className="text-right">{item.date}</div>
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
            <div>{item.location}</div>
            <div className="font-bold">{item.date}</div>
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

export default function Kakuna({ columns, isFirstPage = false }: TemplateProps) {
  const [main, sidebar] = columns;

  return (
    <div
     id="resume-id"
     className="p-custom space-y-4">
      {isFirstPage && <Header />}

      <div className="space-y-4">
        {main.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}

        {sidebar.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>
    </div>
  );
};
