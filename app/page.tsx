import {
  ArrowUpRightIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="landing-page min-h-screen overflow-hidden text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between py-7">
          <Link href="/" className="flex items-center gap-3" aria-label="Chat App home">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-white shadow-[0_8px_20px_rgba(232,80,58,0.22)]">
              <ChatBubbleLeftRightIcon className="size-5" />
            </span>
            <span className="font-semibold tracking-[-0.02em]">Chat App</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600 sm:gap-8">
            <a href="#why-chat" className="hidden transition-colors hover:text-slate-950 sm:block">
              Why chat
            </a>
            <Link
              href="/login"
              className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-slate-900 transition hover:border-slate-900 hover:bg-white"
            >
              Sign in
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-14 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-24 lg:pt-16">
          <div className="max-w-2xl">
            <p className="landing-eyebrow mb-6 flex items-center gap-2 text-xs font-bold uppercase text-primary">
              <span className="size-2 rounded-full bg-primary" />
              Conversations, made human
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Make room for a better kind of{' '}
              <span className="landing-accent italic">conversation.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              A calm, simple place to catch up with the people who matter. Find your people,
              pick a thread, and keep the good stuff moving.
            </p>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-primary"
              >
                Open your chats
                <ArrowUpRightIcon className="size-4" />
              </Link>
              <a
                href="#why-chat"
                className="inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
              >
                See what makes it different
              </a>
            </div>
            <div className="mt-12 flex items-center gap-3 text-sm text-slate-500">
              <div className="flex -space-x-2" aria-hidden="true">
                <span className="grid size-8 place-items-center rounded-full border-2 border-[#f6f1e8] bg-[#f3b19a] text-xs font-bold text-[#713828]">AM</span>
                <span className="grid size-8 place-items-center rounded-full border-2 border-[#f6f1e8] bg-[#a9c9c5] text-xs font-bold text-[#244a47]">JS</span>
                <span className="grid size-8 place-items-center rounded-full border-2 border-[#f6f1e8] bg-[#f2d18b] text-xs font-bold text-[#654d18]">RK</span>
              </div>
              <span>Good conversations are waiting.</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[31rem] lg:justify-self-end">
            <div className="landing-sun absolute -right-10 -top-10 size-36 rounded-full sm:-right-16 sm:-top-16 sm:size-52" />
            <div className="landing-note absolute -left-5 top-12 z-10 hidden w-40 -rotate-6 rounded-2xl bg-primary p-4 text-white shadow-[0_16px_30px_rgba(232,80,58,0.2)] sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Today</p>
              <p className="mt-3 text-sm font-medium leading-5">The group chat is where the magic happens.</p>
            </div>
            <div className="relative rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-[0_24px_70px_rgba(57,48,38,0.14)] backdrop-blur-sm sm:p-4">
              <div className="rounded-[1.5rem] bg-[#fffdf9] p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Your inbox</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Good energy only</h2>
                  </div>
                  <span className="grid size-9 place-items-center rounded-full bg-[#f9e5df] text-primary">
                    <ChatBubbleLeftRightIcon className="size-5" />
                  </span>
                </div>
                <div className="space-y-3 pt-5">
                  <div className="flex items-start gap-3 rounded-2xl bg-[#f6f1e8] p-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#a9c9c5] text-xs font-bold text-[#244a47]">JS</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 text-sm font-semibold"><span>Jamie Smith</span><span className="text-[11px] font-medium text-slate-400">9:42</span></div>
                      <p className="mt-1 truncate text-xs text-slate-500">That sounds perfect. See you soon?</p>
                    </div>
                    <span className="mt-1 size-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex items-start gap-3 p-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f2d18b] text-xs font-bold text-[#654d18]">RK</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 text-sm font-semibold"><span>Roommates</span><span className="text-[11px] font-medium text-slate-400">Yesterday</span></div>
                      <p className="mt-1 truncate text-xs text-slate-500">Riya: I found the best little place...</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f3b19a] text-xs font-bold text-[#713828]">AM</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 text-sm font-semibold"><span>Alex Morgan</span><span className="text-[11px] font-medium text-slate-400">Mon</span></div>
                      <p className="mt-1 truncate text-xs text-slate-500">Voice message · 0:28</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-3 text-xs font-medium text-slate-400">
                  <span className="size-2 rounded-full bg-[#a9c9c5]" /> 3 friends are online now
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why-chat" className="grid gap-6 border-t border-slate-900/10 py-8 sm:grid-cols-3 sm:gap-8 lg:py-10">
          <div className="flex gap-3">
            <BoltIcon className="size-5 shrink-0 text-primary" />
            <div><h3 className="text-sm font-semibold">Feels instant</h3><p className="mt-1 text-sm leading-5 text-slate-500">Your conversations stay close at hand.</p></div>
          </div>
          <div className="flex gap-3">
            <UsersIcon className="size-5 shrink-0 text-primary" />
            <div><h3 className="text-sm font-semibold">Find your people</h3><p className="mt-1 text-sm leading-5 text-slate-500">Search, connect, and pick up naturally.</p></div>
          </div>
          <div className="flex gap-3">
            <ShieldCheckIcon className="size-5 shrink-0 text-primary" />
            <div><h3 className="text-sm font-semibold">Easy by design</h3><p className="mt-1 text-sm leading-5 text-slate-500">A focused space without the noise.</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
