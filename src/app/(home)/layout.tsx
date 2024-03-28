import HomeNavbar from '@/components/HomeNavbar'
import { Separator } from '@/components/ui/separator'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div className='bg-black dark:bg-black'>
      <HomeNavbar />
      <Separator />
      {children}
    </div>
  )
}

export default layout