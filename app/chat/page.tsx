'use client';

import { useState } from 'react';
import ChatRoom from '../components/chat-room';
import SearchUsers from '../components/search-user';
import Welcome from '../components/welcome';
import Header from '../components/header';
import AllUsers from '../components/all-users';
import {
  createConversation,
  type Conversation,
  type SearchUser,
} from '../login/actions';

function Page() {
  const [currentChat, setCurrentChat] = useState<Conversation | null>(null);

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
            <AllUsers onSelectConversation={setCurrentChat} />
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
