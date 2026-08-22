'use client';

import { useEffect, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { getMessages, type Conversation, type Message } from '../login/actions';
import ChatForm from './chat-form';

// import { getMessagesOfChatRoom, sendMessage } from "../../services/ChatService";

type ChatRoomProps = {
  currentChat: Conversation;
};

export default function ChatRoom({ currentChat }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMessages() {
      setError('');
      setMessages([]);
      setIsLoading(true)

      try {
        const result = await getMessages(currentChat._id);
        setMessages(result.messages);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load messages.',
        );
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [currentChat._id]);

  //   const [messages, setMessages] = useState([]);
  //   const [incomingMessage, setIncomingMessage] = useState(null);

  //   const scrollRef = useRef();

  //   useEffect(() => {
  //     const fetchData = async () => {
  //     //   const res = await getMessagesOfChatRoom(currentChat._id);
  //       setMessages(res);
  //     };

  //     fetchData();
  //   }, [currentChat._id]);

  //   useEffect(() => {
  //     scrollRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //     });
  //   }, [messages]);

  //   useEffect(() => {
  //     socket.current?.on("getMessage", (data) => {
  //       setIncomingMessage({
  //         senderId: data.senderId,
  //         message: data.message,
  //       });
  //     });
  //   }, [socket]);

  //   useEffect(() => {
  //     incomingMessage && setMessages((prev) => [...prev, incomingMessage]);
  //   }, [incomingMessage]);

  //   const handleFormSubmit = async (message) => {
  //     const receiverId = currentChat.members.find(
  //       (member) => member !== currentUser.uid
  //     );

  //     socket.current.emit("sendMessage", {
  //       senderId: currentUser.uid,
  //       receiverId: receiverId,
  //       message: message,
  //     });

  //     const messageBody = {
  //       chatRoomId: currentChat._id,
  //       sender: currentUser.uid,
  //       message: message,
  //     };
  //     const res = await sendMessage(messageBody);
  //     setMessages([...messages, res]);
  //   };

  return (
    <div className="lg:col-span-2 lg:block">
      <div className="w-full">
        <div className="flex items-center gap-3 border-b border-gray-200 bg-white p-4">
          <span className="grid size-10 place-items-center rounded-full bg-[#f9e5df] text-primary">
             {currentChat.type === 'group'
                ? currentChat.name.charAt(0).toUpperCase()
                : currentChat.participant.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900">
              {currentChat.type === 'group'
                ? currentChat.name
                : currentChat.participant.name}
            </h2>
            <p className="text-xs text-slate-400">
              {currentChat.type === 'group'
                ? `${currentChat.participants.length} participants`
                : currentChat.participant.phone}
            </p>
          </div>
        </div>

        <div className="relative h-120 w-full overflow-y-auto border-b border-gray-200 bg-white p-6">
          <ul className="space-y-2">
            {isLoading && (
              <li className="text-sm text-slate-400">Loading messages...</li>
            )}
            {error && (
              <li className="text-sm text-red-600" role="alert">
                {error}
              </li>
            )}
            {!isLoading && !error && messages.length === 0 && (
              <li className="text-sm text-slate-400">No messages yet.</li>
            )}
            {messages.map((message) => (
              <li key={message._id} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">
                  {message.sender}
                </p>
                <p className="mt-1 text-sm text-slate-800">{message.text}</p>
                <time className="mt-1 block text-[11px] text-slate-400">
                  {new Date(message.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        </div>

        <ChatForm />
      </div>
    </div>
  );
}
