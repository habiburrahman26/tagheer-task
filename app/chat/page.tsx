'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ChatRoom from '../components/chat-room';
import SearchUsers from '../components/search-user';
import Welcome from '../components/welcome';
import Header from '../components/header';
import AllUsers from '../components/all-users';
import {
  createConversation,
  getAuthToken,
  type Conversation,
  type SearchUser,
} from '../login/actions';

function Page() {
  const [currentChat, setCurrentChat] = useState<Conversation | null>(null);
  const [conversationRefreshKey, setConversationRefreshKey] = useState(0);

  useEffect(() => {
    let socket: ReturnType<typeof io> | undefined;
    let isActive = true;

    async function connectSocket() {
      try {
        const token = await getAuthToken();
        if (!isActive) return;

        socket = io('https://frontend-task-chatapp.onrender.com', {
          auth: { token },
        });
        socket.on('conversation:updated', () => {
          setConversationRefreshKey((key) => key + 1);
        });
        socket.on('message:new', (payload: unknown) => {
          setConversationRefreshKey((key) => key + 1);
        });
      } catch {
        // REST loading continues if the live connection is unavailable.
      }
    }

    connectSocket();

    return () => {
      isActive = false;
      socket?.disconnect();
    };
  }, []);
  async function handleSelectUser(user: SearchUser) {
    const conversation = await createConversation(user._id);
    setCurrentChat(conversation);
  }

  return (
    <main className="min-h-screen overflow-x-hidden px-3 py-3 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Header />
        <div className="grid w-full min-w-0 lg:grid-cols-3">
          <aside className="min-w-0 border-b border-gray-200 bg-white lg:col-span-1 lg:border-b-0 lg:border-r">
            <SearchUsers onSelectUser={handleSelectUser} />
            <AllUsers
              onSelectConversation={setCurrentChat}
              refreshKey={conversationRefreshKey}
            />
          </aside>

          <div className="min-w-0 lg:col-span-2">
            {currentChat ? <ChatRoom currentChat={currentChat} /> : <Welcome />}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
