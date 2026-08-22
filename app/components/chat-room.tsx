'use client';

import { useEffect, useState } from 'react';
import {
  getCurrentUser,
  getMessages,
  sendMessage,
  type Conversation,
  type Message,
} from '../login/actions';
import ChatForm from './chat-form';
import Avatar from '../utils/avatar';

// import { getMessagesOfChatRoom, sendMessage } from "../../services/ChatService";

type ChatRoomProps = {
  currentChat: Conversation;
};

export default function ChatRoom({ currentChat }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMessages() {
      setError('');
      setMessages([]);
      setIsLoading(true);

      try {
        const [result, currentUser] = await Promise.all([
          getMessages(currentChat._id),
          getCurrentUser(),
        ]);
        setMessages(
          [...result.messages].sort(
            (firstMessage, secondMessage) =>
              new Date(firstMessage.createdAt).getTime() -
              new Date(secondMessage.createdAt).getTime(),
          ),
        );
        setCurrentUserId(currentUser._id);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Unable to load messages.',
        );
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [currentChat._id]);

  async function handleSendMessage(text: string) {
    setIsSending(true);
    setError('');

    try {
      const message = await sendMessage(currentChat._id, text);
      setMessages((previousMessages) => [...previousMessages, message]);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to send message.',
      );
    } finally {
      setIsSending(false);
    }
  }

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
            <Avatar
              seed={
                currentChat.type === 'group'
                  ? currentChat.name
                  : currentChat.participant.name
              }
            />
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
            {messages.map((message) => {
              const isOwnMessage = message.sender === currentUserId;

              return (
                <li
                  key={message._id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      isOwnMessage
                        ? 'rounded-br-md bg-primary text-white'
                        : 'rounded-bl-md bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="wrap-break-word text-sm">{message.text}</p>
                    <time
                      dateTime={message.createdAt}
                      className={`mt-1 block text-[11px] ${
                        isOwnMessage ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <ChatForm onSubmitMessage={handleSendMessage} isSending={isSending} />
      </div>
    </div>
  );
}
