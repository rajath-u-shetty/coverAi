"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";

const UserDropdown = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="!h-12 w-12">
          <AvatarImage src={user?.image || " "} />
          <AvatarFallback className="h-12 w-12 rounded-full">
            {user?.name?.[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-slate-100 dark:bg-[#1E1F22] rounded-md text-muted-foreground">
        <DropdownMenuItem className="hover:border-black hover:border hover:dark:border-white">
          <div className="flex flex-col gap-1">
            <span className="font-medium ">{user?.name}</span>
            <span>{user?.email}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex justify-center gap-4 hover:border-black hover:border hover:dark:border-white"
        >
          Signout
          <LogOut className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
