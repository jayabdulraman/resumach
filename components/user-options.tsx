'use client'
// import { t } from "@lingui/macro";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { KeyboardShortcut } from "@/components/shortcut";
// import { useNavigate } from "react-router-dom";
import {useRouter} from "next/navigation"

import { signOutAction } from "../app/actions";

type Props = {
  children: React.ReactNode;
};

export function UserOptions ({ children }: Props) {
  // const navigate = useNavigate();
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-48">
        <DropdownMenuItem
          onClick={() => {
            router.push("/settings");
          }}
          className="cursor-pointer"
        >
          {`Settings`}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOutAction}>
            <Button type="submit" variant={"ghost"} className="p-0 m-0 h-4">
              {`Sign out`}
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
