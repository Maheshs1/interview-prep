'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import { Input } from './input';
import { Button } from './button';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import FormInput from './formInput';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { signIn, signUp } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const authForm = (type) => z.object({
  name: type === 'login' ? z.string().optional() : z.string().min(3, 'Minimum 3 characters required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password should be minimum 8 characters')
})

function AuthForm({ type }) {
  const [loading, setLoading] = useState(false);
  const isSignUp = type !== 'login';
  const formSchema = authForm(type);
  const route = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, name, password } = values;
    setLoading(true);
    try {
      if (isSignUp) {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        if (user) {
          console.log(await user.user.getIdToken());

          const signUpUser = await signUp({
            email,
            name,
            uid: user.user.uid,
            idToken: await user.user.getIdToken()
          });
          console.log({ signUpUser });
          if (!signUpUser?.success) {
            toast.error(signUpUser?.message || 'Error while signing up');
            return;
          }
        } else {
          toast.error('Could not sign up')
          return;
        }
      } else {
        const user = await signInWithEmailAndPassword(auth, email, password);
        if (user) {
          const signInUser = await signIn({
            email,
            idToken: await user.user.getIdToken()
          });

          if (signInUser?.success) {
            toast.error(signInUser.message);
            return;
          }
        } else {
          toast.error('Could not login');
          return;
        }
      }
    } catch (e) {
      console.log({ e }, 'error');

      toast.error('Could not login ', {
        description: e.code === 'auth/user-not-found' ? 'User not found' : ''
      });
      return;
    } finally {
      setLoading(false);
    }
    route.replace('/');
  }

  return (
    <div className='border border-gray-700 p-8 lg:py-16 bg-gradient-to-b to-black from-gray-800 rounded'>
      <div className='flex flex-col items-center justify-center pb-8 gap-1'>
        <div className='flex gap-2 items-center'>
          <Image src='/logo.svg' width={40} height={40} alt='logo' />
          <h1 className='font-bold text-3xl'>InterviewPrep</h1>
        </div>
        <h3 className='text-gray-100 text-xl'>Let's Crack the interview</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 lg:min-w-[566px]'>
          {isSignUp && <FormInput fieldName='name' label='Name' placeholder='Your Name' control={form.
            control} />}
          <FormInput fieldName='email' label='Email' placeholder='Your Email' control={form.control} type='email' />
          <FormInput fieldName='password' label='Password' placeholder='Your Password' control={form.control} type='password' />
          <Button disabled={loading} className='w-full bg-purple-300 hover:bg-purple-500 cursor-pointer' type='submit'>{!loading ? (isSignUp ? 'Create an account' : 'Login') : <Loader2 className='animate-spin' />} { }</Button>
        </form>
      </Form>
      <p className='text-sm text-gray-400 text-center mt-4'>{isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '} <Link className='text-gray-200 hover:text-white' href={isSignUp ? '/login' : 'sign-up'}>{isSignUp ? 'Login now' : 'Create Now!'}</Link></p>
    </div>
  )
}

export default AuthForm