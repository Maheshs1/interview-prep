import { isAuthenticated } from '@/actions/auth.actions';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

async function RootLayout({ children }: { children: ReactNode }) {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect('/sign-up');
  return (
    <div>{children}</div>
  )
}

export default RootLayout