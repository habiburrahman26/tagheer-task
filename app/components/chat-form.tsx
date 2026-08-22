'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

type ChatFormProps = {
  onSubmitMessage: (text: string) => Promise<void>;
  isSending: boolean;
};

export default function ChatForm({ onSubmitMessage, isSending }: ChatFormProps) {
  const [text, setText] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = text.trim();

    if (!message || isSending) {
      return;
    }

    await onSubmitMessage(message);
    setText('');
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full items-center justify-between border-b border-gray-200 bg-white p-3">
          <input
            type="text"
            placeholder="Write a message"
            className="mx-3 block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-4 text-sm text-gray-900 outline-none focus:border-primary focus:ring-primary"
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={isSending}
          />
          <button type="submit" disabled={isSending || !text.trim()} aria-label="Send message">
            <PaperAirplaneIcon
              className="size-6 text-primary"
              aria-hidden="true"
            />
          </button>
        </div>
      </form>
    </div>
  );
}