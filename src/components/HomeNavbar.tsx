import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { buttonVariants } from "./ui/button"
import { getAuthSession } from "@/lib/auth"
import { cn } from "@/lib/utils"
import UserDropdown from "./UserDropDown"

const HomeNavbar = async() => {
    const session = await getAuthSession();
  return (
      <div className="flex justify-between gap-72 z-30 fixed inset-x-0 dark:bg-black bg-white h-[75px] top-0 left-0 text-black dark:text-white items-center px-24">
          <Link href={'/'} className="text-3xl font-bold ml-4">CoverAI</Link>
      <div className="flex gap-6">
        <ModeToggle />
        {session?.user ? (
          <div className="flex gap-2 items-center pl-10">
            <Link href={"/dashboard"} className={cn("", buttonVariants({variant: "default"}))}>Dashboard</Link>
            {session?.user ? <UserDropdown /> : null}
          </div>
        ) : (
            <Link href={"/sign-in"} className={cn("", buttonVariants({variant: "default"}))}>SignIn</Link>
        )}
      </div>
    </div>
  )
}

export default HomeNavbar
