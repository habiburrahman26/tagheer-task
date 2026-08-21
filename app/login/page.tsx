'use client';

import { useActionState } from 'react';
import { login, type LoginState } from './actions';

export default function Login() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-4 text-3xl text-center">Login to your account</h2>
        </div>
        <form action={formAction} className="mt-8 space-y-6">
          <div className=" space-y-1">
            <div>
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="border appearance-none rounded relative block w-full px-3 py-2  text-sm focus:outline-none focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="border appearance-none rounded relative block w-full px-3 py-2 text-sm focus:outline-none focus:z-10 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isPending}
              className=" w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-800 hover:bg-sky-900"
            >
              {isPending ? 'Logging in...' : 'Login'}
            </button>
          </div>
          {state.error && (
            <p className="text-sm text-red-600 text-center" role="alert">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
