import { createId } from "@paralleldrive/cuid2";
import { ResumeDto } from "@/lib/dto/resume";
import { CustomSectionGroup, defaultSection, SectionKey } from "@/utils/schema";
import { removeItemInLayout } from "@/utils/namespaces/array";
import _set from "lodash.set";
import { temporal, TemporalState } from "zundo";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useStoreWithEqualityFn } from "zustand/traditional";

type ResumeStore = {
  resume: ResumeDto;

  // Actions
  setValue: (path: string, value: unknown) => void;

  // Custom Section Actions
  addSection: () => void;
  removeSection: (sectionId: SectionKey) => void;
};

export const useResumeStore = create<ResumeStore>()(
  temporal(
    immer((set) => ({
      resume: {} as ResumeDto,
      setValue: (path, value) => {
        set((state) => {
          if (path === "visibility") {
            state.resume.visibility = value as "public" | "private";
          } else {
            state.resume.data = _set(state.resume.data, path, value);
          }
        });
      },
      addSection: () => {
        const section: CustomSectionGroup = {
          ...defaultSection,
          identifier: createId(),
          name: `Custom Section`,
          items: [],
        };

        set((state) => {
          const lastPageIndex = state.resume.data.metadata.layout.length - 1;
          state.resume.data.metadata.layout[lastPageIndex][0].push(`custom.${section.identifier}`);
          state.resume.data = _set(state.resume.data, `sections.custom.${section.identifier}`, section);
        });
      },
      removeSection: (sectionId: SectionKey) => {
        if (sectionId.startsWith("custom.")) {
          const id = sectionId.split("custom.")[1];

          set((state) => {
            removeItemInLayout(sectionId, state.resume.data.metadata.layout);
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete state.resume.data.sections.custom[id];
          });
        }
      },
    })),
    {
      limit: 100,
      wrapTemporal: (fn) => devtools(fn),
      partialize: ({ resume }) => ({ resume }),
    },
  ),
);

export const useTemporalResumeStore = <T>(
  selector: (state: TemporalState<Pick<ResumeStore, "resume">>) => T,
  equality?: (a: T, b: T) => boolean,
) => useStoreWithEqualityFn(useResumeStore.temporal, selector, equality);
