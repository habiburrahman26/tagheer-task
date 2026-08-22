import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <nav className="px- px-2 sm:px-4 py-2.5 bg-gray-50 border-gray-200  text-sm rounded border">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link href="/" className="flex">
            <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-900">
              Chat App
            </span>
          </Link>
          <div>
            <button className="text-gray-500 hover:bg-gray-600 focus:outline-none rounded-md text-sm p-2.5 cursor-pointer transition-all">
              <ArrowLeftStartOnRectangleIcon
                className="h-8 w-8 rotate-180"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
