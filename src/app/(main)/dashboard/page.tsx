import { ModeToggle } from "@/components/ModeToggle";
import UserAuthForm from "@/components/UserAuthForm";
import UserDropdown from "@/components/UserDropDown";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { FileTerminal, History } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  const tools = [
    {
      logo: FileTerminal,
      title: "Generate Cover Letter",
      description: "Start Creating by uploading your Resume",
      href: "/generate",
      tag: "Uplaod Resume",
      footer: "",
    },
    {
      logo: History,
      title: "View History",
      description: "Checkout your previous generations",
      href: "/history",
      tag: "Download",
      footer: "",
    },
  ];

  return (
    <div className="w-full h-full text-black dark:text-white">
      <div className="">
        <div className="p-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl">DashBoard</h1>
            <ModeToggle />
            // <UserDropdown />
          </div>
          <Separator className="my-3" />
        </div>
        <div className="grid md:grid-cols-2 mx-16 gap-8 grid-rows-2">
          {tools.map((tool) => (
            <Card
              key={tool.href}
              className="hover:border-black border-2 dark:hover:border-white outline outline-1 transition-all"
            >
              <CardHeader className="flex  gap-1">
                <CardTitle className="flex">
                  <tool.logo className="w-6 h-6 mr-2" />
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-md font-bold">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={tool.href}
                  className={cn(buttonVariants({ variant: "language" }))}
                >
                  {tool.tag}
                </Link>
              </CardContent>
              <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

{
  /* <Card className='hover:border-black border-2 dark:hover:border-white outline outline-1 transition-all'>
              <CardHeader className='flex  gap-1'>
                <CardTitle className='flex'>
                  <FileTerminal className='w-6 h-6 mr-2'/>
                  Generate Cover Letter
                </CardTitle>
                <CardDescription className='text-md font-bold'>Start Creating by uploading your Resume</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={'/generate'} className={cn(buttonVariants({variant: 'language'}))}>Uplaod Resume</Link>
              </CardContent>
              <CardFooter>
                {/* <p>Card Footer</p> */
}
//     </CardFooter>
// </Card>
// <Card className='hover:border-black border-2 dark:hover:border-white outline outline-1 transition-all'>
//     <CardHeader>
//       <CardTitle>Card Title</CardTitle>
//       <CardDescription>Card Description</CardDescription>
//     </CardHeader>
//     <CardContent>
//       <p>Card Content</p>
//     </CardContent>
//     <CardFooter>
//       <p>Card Footer</p>
//     </CardFooter>
// </Card> */}
