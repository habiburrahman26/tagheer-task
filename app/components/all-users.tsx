'use client';

import { useEffect, useState } from 'react';
import { getConversions, type Conversation } from '../login/actions';
import Avatar from '../utils/avatar';

type AllUsersProps = {
  onSelectConversation: (conversation: Conversation) => void;
  refreshKey?: number;
};

function AllUsers({ onSelectConversation, refreshKey = 0 }: AllUsersProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await getConversions();
        setConversations(data);
      } catch (requestError: unknown) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load conversations.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, [refreshKey]);

  return (
    <section className="overflow-hidden">
      <div className="flex items-center justify-between px-4 pb-2 pt-1">
        <h2 className="text-sm font-semibold text-slate-900">Your chats</h2>
        {!isLoading && !error && (
          <span className="text-xs font-medium text-slate-400">
            {conversations.length}
          </span>
        )}
      </div>
      <ul className="h-120 overflow-auto">
        {isLoading && (
          <li className="px-4 py-6 text-sm text-slate-400">
            Loading conversations...
          </li>
        )}
        {error && (
          <li className="px-4 py-6 text-sm leading-5 text-red-600" role="alert">
            {error}
          </li>
        )}
        {!isLoading && !error && conversations.length === 0 && (
          <li className="px-4 py-8 text-center text-sm leading-5 text-slate-400">
            Your conversations will appear here.
          </li>
        )}
        {conversations.map((conversation) => (
          <li key={conversation._id}>
            <button
              type="button"
              onClick={() => onSelectConversation(conversation)}
              className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-[#f9e5df]/60"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f9e5df] text-primary">
                <Avatar
                  seed={
                    conversation.type === 'group'
                      ? conversation.name
                      : conversation.participant.name
                  }
                />
                {/* <ChatBubbleLeftRightIcon className="size-5" aria-hidden="true" />
                {conversation.type === 'group'
                  ? conversation.name.charAt(0).toUpperCase()
                  : conversation.participant.name.charAt(0).toUpperCase()} */}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-800">
                  {conversation.type === 'group'
                    ? conversation.name
                    : conversation.participant.name}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-400">
                  {conversation.lastMessage.text || 'No messages yet'}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AllUsers;
