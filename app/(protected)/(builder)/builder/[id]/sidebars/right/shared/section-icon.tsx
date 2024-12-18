import {
  DiamondsFour,
  DownloadSimple,
  IconProps,
  Layout,
  ShareFat,
} from "@phosphor-icons/react";
import { Button, ButtonProps } from "@/components/ui";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

export type MetadataKey =
  | "template"
  | "layout"
  | "export"
  | "sharing";

export function getSectionIcon (id: MetadataKey, props: IconProps = {}) {
  switch (id) {
    case "template": {
      return <DiamondsFour size={18} {...props} />;
    }
    case "layout": {
      return <Layout size={18} {...props} />;
    }
    case "sharing": {
      return <ShareFat size={18} {...props} />;
    }
    case "export": {
      return <DownloadSimple size={18} {...props} />;
    }
    default: {
      return null;
    }
  }
};

type SectionIconProps = ButtonProps & {
  id: MetadataKey;
  name: string;
  icon?: React.ReactNode;
};

export function SectionIcon ({ id, name, icon, ...props }: SectionIconProps) {
  return (
  <TooltipProvider>
    <Tooltip side="left" content={name}>
      <Button size="icon" variant="ghost" className="size-8 rounded-full" {...props}>
        {icon ?? getSectionIcon(id, { size: 14 })}
      </Button>
    </Tooltip>
  </TooltipProvider>
  )
};
