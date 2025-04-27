"use client";

import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: {
    name: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex-1"></div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 rounded-md bg-gray-100 p-1 dark:bg-gray-800">
          <button className="rounded-md px-3 py-1 text-xs font-medium bg-white text-gray-800 dark:bg-transparent dark:text-gray-400">
            Light
          </button>
          <button className="rounded-md px-3 py-1 text-xs font-medium text-gray-400 dark:bg-gray-700 dark:text-white">
            Dark
          </button>
        </div>

        <div className="relative">
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
            <Bell className="h-5 w-5" />
          </button>
          <span className="absolute right-0 top-0 flex h-2 w-2 rounded-full bg-red-500"></span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-3 rounded-[10px] bg-[#FAF7F2] px-2 py-1.5">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/diverse-group-city.png" alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-base font-normal text-black">
                Hello {user.name.split(" ")[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
