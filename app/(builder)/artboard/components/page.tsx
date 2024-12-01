import { useTheme } from "@/lib/hooks/use-theme";
import { cn } from "@/utils/cn";
import { pageSizeMap } from "@/utils/namespaces/page";
import { useResumeStore } from "@/utils/stores/resume";

type Props = {
  mode?: "preview" | "builder";
  pageNumber: number;
  children: React.ReactNode;
};

export const MM_TO_PX = 3.78;

// @ts-ignore
const PageWrapper = ({ mode, children }) => {
  if (mode === 'preview') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="max-w-full flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  }
  return children;
};

export const Page = ({ mode = "preview", pageNumber, children }: Props) => {

  const page = useResumeStore((state) => state.resume.data.metadata.page);
  const fontFamily = useResumeStore((state) => state.resume.data.metadata.typography.font.family);

  return (
    <PageWrapper mode={mode}>
    <div
      data-page={pageNumber}
      className={cn("relative bg-white text-black", mode === "builder" && "shadow-2xl", mode === "preview" && "max-w-full transform scale-[0.99]")}
      style={{
        fontFamily,
        // @ts-ignore
        width: `${pageSizeMap[page.format].width * MM_TO_PX}px`,
        // @ts-ignore
        minHeight: `${pageSizeMap[page.format].height * MM_TO_PX}px`,
        ...(mode === "preview" && {
          maxWidth: '100%',
          height: 'auto',
          transformOrigin: 'center',
          // This ensures the page scales down proportionally if it's too wide
          transform: `scale(min(1, ${(window.innerWidth - 64) / (pageSizeMap[page.format].width * MM_TO_PX)}))`
        })
      }}
    >
      {mode === "builder" && page.options.pageNumbers && (
        <div className={cn("absolute -top-7 left-0 font-bold")}>
          Page {pageNumber}
        </div>
      )}

      {children}

      {mode === "builder" && page.options.breakLine && (
        <div
          className="absolute inset-x-0 border-b border-dashed"
          style={{
            // @ts-ignore
            top: `${pageSizeMap[page.format].height * MM_TO_PX}px`,
          }}
        />
      )}
    </div>
  </PageWrapper>
  );
};
