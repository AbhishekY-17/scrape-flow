import Logo from '@/components/Logo'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode}) {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        { children }
        <Logo/>
    </div>
  )
}

export default layout