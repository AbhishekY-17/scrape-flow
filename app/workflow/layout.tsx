import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/ThemeModeToggle';
import { Separator } from '@/components/ui/separator';
import React from 'react';

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col w-full h-screen'>
            {/* Footer at the top */}
            <footer className='flex items-center justify-between p-2'>
                <Logo iconSize={16} fontSize='text-xl' />
                <ModeToggle />
            </footer>
            <Separator />

            {/* Main content below the footer */}
            {children}
        </div>
    );
}

export default Layout;