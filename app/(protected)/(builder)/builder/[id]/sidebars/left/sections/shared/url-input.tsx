"use client";
import { Tag } from "@phosphor-icons/react";
import { URL, urlSchema } from "@/utils/schema";
import {
  Button,
  Input,
} from "@/components/ui";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { forwardRef, useMemo } from "react";

type Props = {
  id?: string;
  value: URL;
  placeholder?: string;
  onChange: (value: URL) => void;
};

export const URLInput = forwardRef<HTMLInputElement, Props>(
  ({ id, value, placeholder, onChange }, ref) => {
    const hasError = useMemo(() => !urlSchema.safeParse(value).success, [value]);
    
    return (
      <>
        <div className="flex gap-x-1">
          <Input
            ref={ref}
            id={id}
            value={value?.href}
            className="flex-1"
            type="url"
            //@ts-ignore
            hasError={hasError}
            placeholder={placeholder}
            onChange={(event) => {
              onChange({ ...value, href: event.target.value });
            }}
          />

          <Popover>
            <TooltipProvider>
              <Tooltip content={`Label`}>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Tag />
                  </Button>
                </PopoverTrigger>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="p-1.5">
              <Input
                value={value?.label || ""}
                placeholder={`Label`}
                onChange={(event) => {
                  onChange({ ...value, label: event.target.value });
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {hasError && <small className="opacity-75">{`URL must start with https://`}</small>}
      </>
    );
  },
);
