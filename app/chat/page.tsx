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
    <div className="container mx-auto">
      <>
        <Header />
        <div className="min-w-full bg-white border-x border-b border-gray-200 rounded lg:grid lg:grid-cols-3">
          <div className="bg-white border-r border-gray-200 lg:col-span-1">
            <SearchUsers onSelectUser={handleSelectUser} />
            <AllUsers
              onSelectConversation={setCurrentChat}
              refreshKey={conversationRefreshKey}
            />
          </div>

          {currentChat ? (
            <ChatRoom currentChat={currentChat} />
          ) : (
            <Welcome />
          )}
        </div>
      </>
    </div>
  );
}

export default Page;
