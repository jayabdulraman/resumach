'use client'
// import { t } from "@lingui/macro";
import { createId } from "@paralleldrive/cuid2";
import { DotsSixVertical, Envelope, Plus, X } from "@phosphor-icons/react";
import { CustomField as ICustomField } from "@/utils/schema";
import {
  Button,
  Input
} from "@/components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipProvider} from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";

import { useResumeStore } from "@/utils/stores/resume";

type CustomFieldProps = {
  field: ICustomField;
  onChange: (field: ICustomField) => void;
  onRemove: (id: string) => void;
};

export default function CustomField({ field, onChange, onRemove }: CustomFieldProps) {
  const controls = useDragControls();

  const handleChange = (key: "icon" | "name" | "value", value: string) => {
    onChange({ ...field, [key]: value });
  };

  return (
    <Reorder.Item
      value={field}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <div className="flex items-end justify-between space-x-2">
        <Button
          size="icon"
          variant="link"
          className="shrink-0"
          onPointerDown={(event) => {
            controls.start(event);
          }}
        >
          <DotsSixVertical />
        </Button>

        <Popover>
          <TooltipProvider>
            <Tooltip content={`Icon`}>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost">
                  {field.icon ? <i className={cn(`ph ph-${field.icon}`)} /> : <Envelope />}
                </Button>
              </PopoverTrigger>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="p-1.5">
            <Input
              value={field.icon}
              placeholder={`Enter Phosphor Icon`}
              onChange={(event) => {
                onChange({ ...field, icon: event.target.value });
              }}
            />
          </PopoverContent>
        </Popover>

        <Input
          placeholder={`Name`}
          value={field.name}
          className="!ml-0"
          onChange={(event) => {
            handleChange("name", event.target.value);
          }}
        />

        <Input
          placeholder={`Value`}
          value={field.value}
          onChange={(event) => {
            handleChange("value", event.target.value);
          }}
        />

        <Button
          size="icon"
          variant="link"
          className="!ml-0 shrink-0"
          onClick={() => {
            onRemove(field.id);
          }}
        >
          <X />
        </Button>
      </div>
    </Reorder.Item>
  );
};

type Props = {
  className?: string;
};
