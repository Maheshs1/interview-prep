import { isAuthenticated } from '@/actions/auth.actions'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function AuthLayout({ children }) {
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) redirect('/');

  return (
    <div className='flex justify-center items-center h-full'>
      {children}
    </div>
  )
}
