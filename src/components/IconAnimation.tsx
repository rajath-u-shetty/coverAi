import React from 'react'

const IconAnimation = () => {
  return (
    <div className="  flex flex-col items-center justify-center  rounded-md">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-black dark:text-white relative z-20">
        CoverAI
      </h1>
      <div className="w-[40rem] h-40 relative">
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[4px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[8px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
      </div>
    </div>

  )
}

export default IconAnimation
