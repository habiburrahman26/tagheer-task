 'use client';

import { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchUsers, type SearchUser } from '../login/actions';

type SearchUsersProps = {
  onSelectUser: (user: SearchUser) => Promise<void>;
};

function SearchUsers({ onSelectUser }: SearchUsersProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setQuery('');
        setUsers([]);
        setError('');
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    let isActive = true;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError('');

      try {
        const results = await searchUsers(query.trim());
        if (isActive) {
          setUsers(results);
        }
      } catch (requestError: unknown) {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to search users.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div ref={searchRef} className="relative mx-3 my-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          id="search"
          name="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-primary"
          placeholder="Search"
          type="search"
        />
      </div>
      {query.trim() && (isLoading || error || users.length > 0) && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {isLoading && <p className="px-3 py-2 text-xs text-slate-400">Searching...</p>}
          {error && <p className="px-3 py-2 text-xs text-red-600" role="alert">{error}</p>}
          {!isLoading && !error && users.map((user) => (
            <button
              key={user._id}
              type="button"
              onClick={() => onSelectUser(user)}
              className="flex w-full items-center gap-3 border-b border-slate-100 px-3 py-2 text-left hover:bg-[#f9e5df]/60"
            >
              <span className="grid size-8 place-items-center rounded-full bg-[#f9e5df] text-xs font-semibold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-800">{user.name}</span>
                <span className="block truncate text-xs text-slate-400">{user.phone}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchUsers