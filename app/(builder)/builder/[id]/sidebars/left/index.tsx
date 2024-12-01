"use client"
import { Plus, PlusCircle } from "@phosphor-icons/react";
import {
  Award,
  Certification,
  CustomSection,
  Education,
  Experience,
  Interest,
  Language,
  Profile,
  Project,
  Publication,
  Reference,
  Skill,
  Volunteer,
} from "@/utils/schema";
import { Button, Separator } from "@/components/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Fragment, useRef } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { Icon } from "@/components/ui/icon";
import { UserAvatar } from "@/components/user-avatar";
import { UserOptions } from "@/components/user-options";
import { useResumeStore } from "@/utils/stores/resume";
import { BasicsSection } from "./sections/basics";
import { SectionBase } from "./sections/shared/section-base";
import { SectionIcon } from "./sections/shared/section-icon";
import { SummarySection } from "./sections/summary";
import { createClient } from "@/utils/supabase/client";
import { HouseSimple } from "@phosphor-icons/react";
import { DialogProvider } from "@/components/providers/dialog";

export const LeftSidebar = () => {
  const containterRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState("")

  // const addSection = useResumeStore((state) => state.addSection);
  // const customSections = useResumeStore((state) => state.resume.data.sections.custom);

  const scrollIntoView = (selector: string) => {
    const section = containterRef.current?.querySelector(selector);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const supabase = createClient();
  
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user?.email as string);
      }
    }
    getUser();
  }, []);

  console.log("USER:", user)

  return (
    <div className="flex bg-secondary-accent/50">
      <div className="hidden basis-12 flex-col items-center justify-between bg-secondary-accent/30 py-4 sm:flex">
        <Button asChild size="icon" variant="ghost" className="size-8 rounded-full">
          <Link href="/dashboard">
            <HouseSimple size={14} />
          </Link>
        </Button>

        <div className="flex flex-col items-center justify-center gap-y-2">
          <SectionIcon
            id="basics"
            name="Basics"
            onClick={() => {
              scrollIntoView("#basics");
            }}
          />
          <SectionIcon
            id="summary"
            onClick={() => {
              scrollIntoView("#summary");
            }}
          />
          <SectionIcon
            id="profiles"
            onClick={() => {
              scrollIntoView("#profiles");
            }}
          />
          <SectionIcon
            id="experience"
            onClick={() => {
              scrollIntoView("#experience");
            }}
          />
          <SectionIcon
            id="education"
            onClick={() => {
              scrollIntoView("#education");
            }}
          />
          <SectionIcon
            id="skills"
            onClick={() => {
              scrollIntoView("#skills");
            }}
          />
          <SectionIcon
            id="projects"
            onClick={() => {
              scrollIntoView("#projects");
            }}
          />
          <SectionIcon
            id="awards"
            onClick={() => {
              scrollIntoView("#awards");
            }}
          />
          <SectionIcon
            id="certifications"
            onClick={() => {
              scrollIntoView("#certifications");
            }}
          />
          <SectionIcon
            id="publications"
            onClick={() => {
              scrollIntoView("#publications");
            }}
          />
          <SectionIcon
            id="volunteer"
            onClick={() => {
              scrollIntoView("#volunteer");
            }}
          />
          <SectionIcon
            id="references"
            onClick={() => {
              scrollIntoView("#references");
            }}
          />
        </div>

        {user && (
          <UserOptions>
            <Button size="icon" variant="ghost" className="rounded-full">
              <UserAvatar size={28} name={user} />
            </Button>
          </UserOptions>
        )}
      </div>
      <ScrollArea orientation="vertical" className="h-screen flex-1 pb-16 lg:pb-0">
        <div ref={containterRef} className="grid gap-y-6 p-6 @container/left">
          <BasicsSection />
          <Separator />
          <SummarySection />
          <Separator />
          <DialogProvider>
            <SectionBase<Profile>
              id="profiles"
              title={(item) => item.network}
              description={(item) => item.username}
            />
            <Separator />
            <SectionBase<Experience>
              id="experience"
              title={(item) => item.company}
              description={(item) => item.position}
            />
            <Separator />
            <SectionBase<Education>
              id="education"
              title={(item) => item.institution}
              description={(item) => item.area}
            />
            <Separator />
            <SectionBase<Skill>
              id="skills"
              title={(item) => item.name}
              description={(item) => {
                if (item.description) return item.description;
                if (item.keywords.length > 0) return `${item.keywords.length} keywords`;
              }}
            />
            <Separator />
            <SectionBase<Project>
              id="projects"
              title={(item) => item.name}
              description={(item) => item.description}
            />
            <Separator />
            <SectionBase<Award>
              id="awards"
              title={(item) => item.title}
              description={(item) => item.awarder}
            />
            <Separator />
            <SectionBase<Certification>
              id="certifications"
              title={(item) => item.name}
              description={(item) => item.issuer}
            />
            <Separator />
            <SectionBase<Publication>
              id="publications"
              title={(item) => item.name}
              description={(item) => item.publisher}
            />
            <Separator />
            <SectionBase<Volunteer>
              id="volunteer"
              title={(item) => item.organization}
              description={(item) => item.position}
            />
            <Separator />
            <SectionBase<Reference>
              id="references"
              title={(item) => item.name}
              description={(item) => item.description}
            />
          </DialogProvider>
        </div>
      </ScrollArea>
    </div>
  );
};
