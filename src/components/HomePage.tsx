import { ArrowRight } from "lucide-react";
import Link from "next/link";
import IconAnimation from "./IconAnimation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { getAuthSession } from "@/lib/auth";

export const GridBackgroundDemo = async() => {
  const session = await getAuthSession()
  return (
    <div className="h-[50rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <IconAnimation />
      <h3 className="text-bold text-4xl">Elevating Your Job Applications with AI-Powered Cover Letters.</h3>
      <p className="text-xl my-7 w-3/5 text-center">Show them why you're perfect for the role with a professional level cover letter! Write it in seconds and get on with your life.</p>
      
      <Link className={cn(buttonVariants({variant: "language",}))} href={session?.user ? "/dashboard" : "/sign-in"}>
        Get Started
        <ArrowRight className="w-4 h-w text-white dark:text-black ml-2" />
      </Link>
    </div>
  );
}


export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <GridBackgroundDemo />
    </div>
  );
}