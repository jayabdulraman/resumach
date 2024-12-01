import { AwardsDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/awards";
import { CertificationsDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/certifications";
import { CustomSectionDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/custom-section";
import { EducationDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/education";
import { ExperienceDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/experience";
import { InterestsDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/interests";
import { LanguagesDialog } from "@/app/(builder)/builder/[id]/sidebars/left/dialogs/languages";
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
        {/* <ResumeDialog />
        <LockDialog />
        <ImportDialog />
        <TwoFactorDialog /> */}

        {isResumeLoaded && (
          <>
            <ProfilesDialog />
            <ExperienceDialog />
            <EducationDialog />
            <AwardsDialog />
            <CertificationsDialog />
            {/* <InterestsDialog />
            <LanguagesDialog /> */}
            <ProjectsDialog />
            <PublicationsDialog />
            <VolunteerDialog />
            <SkillsDialog />
            <ReferencesDialog />
            {/* <CustomSectionDialog /> */}
          </>
        )}
      </div>
    </>
  );
};
