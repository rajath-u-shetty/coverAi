import { ModeToggle } from '@/components/ModeToggle'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { FileTerminal } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full text-black dark:text-white'>
      <div className=''>
        <div className='p-10'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl'>DashBoard</h1>
            <ModeToggle />
          </div>
            <Separator className='my-3'/>
        </div>
        <div className='grid md:grid-cols-2 mx-16 gap-8 grid-rows-2'>
          <Card className='hover:border-black border-2 dark:hover:border-white outline outline-1 transition-all'>
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
                {/* <p>Card Footer</p> */}
              </CardFooter>
          </Card>
          <Card className='hover:border-black border-2 dark:hover:border-white outline outline-1 transition-all'>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default page
