'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const LOGIN_URL = 'https://frontend-task-chatapp.onrender.com/api/auth/login';

export type LoginState = {
  error?: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = formData.get('phone');
  const name = formData.get('name');

  if (
    typeof phone !== 'string' ||
    typeof name !== 'string' ||
    !phone.trim() ||
    !name.trim()
  ) {
    return { error: 'Phone number and name are required.' };
  }

  let response: Response;
  let data: { token?: string; error?: { message?: string } };

  try {
    response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.trim(), name: name.trim() }),
      cache: 'no-store',
    });

    data = await response.json();
  } catch {
    return { error: 'Unable to reach the login service. Please try again.' };
  }

  if (!response.ok || !data?.token) {
    return {
      error:
        data?.error?.message || 'Unable to log in. Please check your details.',
    };
  }

  const cookieStore = await cookies();
  cookieStore.set('authToken', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/chat');
}
