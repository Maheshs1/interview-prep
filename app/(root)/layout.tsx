import { isAuthenticated } from '@/actions/auth.actions';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

async function RootLayout({ children }: { children: ReactNode }) {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect('/sign-up');
  return (
    <div className="p-4 space-y-8 lg:p-16 max-w-6xl mx-auto">
      {children}
    </div>
  )
}

export default RootLayout