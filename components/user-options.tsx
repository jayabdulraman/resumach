'use client'
// import { t } from "@lingui/macro";
import {
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

export const UserOptions = ({ children }: Props) => {
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
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut>⇧S</KeyboardShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOutAction} className="cursor-pointer">
          {`Logout`}
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut>⇧Q</KeyboardShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
