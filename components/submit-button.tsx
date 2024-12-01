"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react"; // Import the spinner icon

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  disabled,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending || disabled} disabled={pending || disabled}
      {...props}
    >
      {pending ? (
        <>
          {pendingText}
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </>
      ) : (
        children
      )}
    </Button>
  );
}
