import {
  ArrowLeftStartOnRectangleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { logout } from '../server-actions/actions';

export default function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-[#fffdf9]">
      <nav
        className="flex min-h-18 items-center justify-between gap-4 px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="Chat App home"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-[0_8px_20px_rgba(232,80,58,0.18)]">
            <ChatBubbleLeftRightIcon className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-[-0.02em] text-slate-950 sm:text-base">
              Chat App
            </span>
            <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Your conversations
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <form action={logout}>
            <button
              type="submit"
              aria-label="Log out"
              title="Log out"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-primary/40 hover:bg-[#f9e5df] hover:text-[#c63d2c] focus:outline-none focus:ring-4 focus:ring-primary/10"
            >
              <ArrowLeftStartOnRectangleIcon
                className="size-4 rotate-180"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
