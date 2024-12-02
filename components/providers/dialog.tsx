import { AwardsDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/awards";
import { CertificationsDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/certifications";
import { EducationDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/education";
import { ExperienceDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/experience";
import { ProfilesDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/profiles";
import { ProjectsDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/projects";
import { PublicationsDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/publications";
import { ReferencesDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/references";
import { SkillsDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/skills";
import { VolunteerDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/volunteer";
import { useResumeStore } from "@/utils/stores/resume";

type Props = {
  children: React.ReactNode;
};

export const DialogProvider = ({ children }: Props) => {
  const isResumeLoaded = useResumeStore((state) => Object.keys(state.resume).length > 0);

  return (
    <>
      {children}

      <div id="dialog-root">

        {isResumeLoaded && (
          <>
            <ProfilesDialog />
            <ExperienceDialog />
            <EducationDialog />
            <AwardsDialog />
            <CertificationsDialog />
            <ProjectsDialog />
            <PublicationsDialog />
            <VolunteerDialog />
            <SkillsDialog />
            <ReferencesDialog />
          </>
        )}
      </div>
    </>
  );
};
