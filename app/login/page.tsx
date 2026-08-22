'use client';

import { useActionState } from 'react';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { login, type LoginState } from './actions';

export default function Login() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <main className="landing-page min-h-screen px-5 py-5 text-slate-900 sm:px-8 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden rounded-4xl border border-white/80 bg-white/70 shadow-[0_24px_70px_rgba(57,48,38,0.12)] backdrop-blur-sm sm:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative flex min-h-76 flex-col justify-between overflow-hidden bg-slate-950 p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#f2d18b]" />
          <div className="absolute -bottom-20 -left-12 size-52 rounded-full border-[2.5rem] border-[#e8503a]/80" />
          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold" aria-label="Back to Chat App home">
              <span className="grid size-10 place-items-center rounded-xl bg-[#e8503a] text-white">
                <ChatBubbleLeftRightIcon className="size-5" />
              </span>
              Chat App
            </Link>
          </div>
          <div className="relative mt-12 max-w-sm lg:mt-0">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-[#f2d18b]">Welcome back</p>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tighter sm:text-5xl">
              Your people are just a message away.
            </h1>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-300">
              Step into a calmer space for the conversations that make your day better.
            </p>
          </div>
          <p className="relative mt-10 text-xs text-slate-400">Simple. Personal. Yours.</p>
        </section>

        <section className="flex items-center bg-[#fffdf9] px-7 py-10 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950">
              <ArrowLeftIcon className="size-4" />
              Back to home
            </Link>
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Let&apos;s get you in.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Use your name and phone number to continue to your chats.</p>
            </div>
            <form action={formAction} className="mt-9 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your name"
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#e8503a] focus:ring-4 focus:ring-[#e8503a]/10"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="e.g. +1 555 123 4567"
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#e8503a] focus:ring-4 focus:ring-[#e8503a]/10"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8503a] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,80,58,0.2)] transition hover:-translate-y-0.5 hover:bg-[#d9432f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LockClosedIcon className="size-4" />
                {isPending ? 'Joining...' : 'Continue to Chat App'}
              </button>
              {state.error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600" role="alert">
                  {state.error}
                </p>
              )}
            </form>
            <p className="mt-8 text-center text-xs leading-5 text-slate-400">Your details help us find your account and keep your chats connected.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
