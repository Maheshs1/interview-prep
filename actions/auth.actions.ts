'use server';

import { auth, db } from '@/firebase/admin';
import { cookies } from 'next/headers';

const ONE_DAY = 24 * 60 * 60;

export const signUp = async ({ email, name, uid, idToken }) => {
  try {
    const user = await db.collection('users').doc(uid).get();
    if (user.exists) {
      return {
        success: false,
        message: 'User already exists',
      };
    }
    await db.collection('users').doc(uid).set({
      name,
      email,
    });
    await setSessionCookie(idToken);
    return {
      success: true,
      message: 'User created',
    };
  } catch (e) {
    console.log({ e });
    return {
      success: false,
      message: 'Error while creating an user',
    };
  }
};

export const setSessionCookie = async (idToken: string) => {
  try {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ONE_DAY * 1000,
    });
    cookieStore.set('session', sessionCookie, {
      expires: ONE_DAY,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      maxAge: ONE_DAY,
      secure: true,
    });
    console.log('Cookie set');
  } catch (e) {
    console.log('error while setting cookie', e);
  }
};

export const signIn = async ({ email, idToken }) => {
  try {
    const user = await auth.getUserByEmail(email);
    if (!user) {
      return {
        success: false,
        message: 'Could not found the user',
      };
    }

    await setSessionCookie(idToken);
  } catch (e) {
    console.log(e, e.code);
    if (e.code === 'auth/user-not-found') {
      // return {
      //   success: false,
      //   message: 'Error while logging in',
      // };
    }
    return {
      success: false,
      message: 'Error while logging in',
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    console.log(sessionCookie);
    if (!sessionCookie) {
      return null;
    }
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    console.log({ decodedClaims });
    const user = await db.collection('users').doc(decodedClaims.uid).get();
    console.log('exists', user.exists);
    if (!user.exists) {
      return null;
    }
    return {
      ...user.data(),
      id: user.id,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  console.log(user?.id);
  return !!user;
};

export const getInterviewsByUserId = async (userId) => {
  const interviews = await db
    .collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc');

  return interviews;
};

