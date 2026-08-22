'use client';

import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import {
  getAuthToken,
  getCurrentUser,
  getMessages,
  sendMessage,
  type Conversation,
  type Message,
} from '../login/actions';
import Avatar from '../utils/avatar';
import ChatForm from './chat-form';

type ChatRoomProps = {
  currentChat: Conversation;
};

function normalizeSocketMessage(payload: unknown): Message | null {
  if (!payload || typeof payload !== 'object') return null;

  const source = payload as Record<string, unknown>;
  const message =
    source.message && typeof source.message === 'object'
      ? (source.message as Record<string, unknown>)
      : source.data && typeof source.data === 'object'
        ? (source.data as Record<string, unknown>)
        : source;
  const conversation = message.conversation;
  const conversationId =
    typeof conversation === 'string'
      ? conversation
      : conversation && typeof conversation === 'object'
        ? String((conversation as Record<string, unknown>)._id || '')
        : String(message.conversationId || source.conversationId || '');
    const conversationValue =
      conversation && typeof conversation === 'object'
        ? (conversation as Record<string, unknown>)
        : null;
    const resolvedConversationId = conversationValue
      ? String(conversationValue._id || conversationValue.id || '')
      : conversationId;
  const sender = message.sender;
  const senderId =
    typeof sender === 'string'
      ? sender
      : sender && typeof sender === 'object'
        ? String(
            (sender as Record<string, unknown>)._id ||
              (sender as Record<string, unknown>).id ||
              '',
          )
        : String(message.senderId || source.senderId || '');
  const text = typeof message.text === 'string' ? message.text : '';
  const createdAt =
    typeof message.createdAt === 'string' && message.createdAt
      ? message.createdAt
      : new Date().toISOString();

  if (
    !resolvedConversationId ||
    !senderId ||
    !text
  ) {
    return null;
  }

  return {
    _id:
      typeof message._id === 'string'
        ? message._id
        : `live-${resolvedConversationId}-${senderId}-${createdAt}-${text}`,
    conversation: resolvedConversationId,
    sender: senderId,
    text,
    createdAt,
  };
}

function addLiveMessage(
  previousMessages: Message[],
  message: Message,
): Message[] {
  const isSameMessage = (item: Message) =>
    item._id === message._id ||
    (item.conversation === message.conversation &&
      item.sender === message.sender &&
      item.text === message.text &&
      item.createdAt === message.createdAt);

  if (previousMessages.some(isSameMessage)) {
    return previousMessages;
  }

  const temporaryIndex = previousMessages.findIndex(
    (item) =>
      item._id.startsWith('temporary-') &&
      item.conversation === message.conversation &&
      item.sender === message.sender &&
      item.text === message.text,
  );

  if (temporaryIndex === -1) return [...previousMessages, message];

  const nextMessages = [...previousMessages];
  nextMessages[temporaryIndex] = message;
  return nextMessages;
}

export default function ChatRoom({ currentChat }: ChatRoomProps) {
  const socketRef = useRef<Socket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLLIElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadMessages() {
      setError('');
      setMessages([]);
      setIsLoading(true);

      try {
        const [result, currentUser] = await Promise.all([
          getMessages(currentChat._id),
          getCurrentUser(),
        ]);
        if (!isActive) return;

        setMessages(
          [...result.messages].sort(
            (first, second) =>
              new Date(first.createdAt).getTime() -
              new Date(second.createdAt).getTime(),
          ),
        );
        setHasMoreMessages(result.hasMore);
        setCurrentUserId(currentUser._id);
      } catch (requestError: unknown) {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load messages.',
          );
          setMessages([]);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadMessages();
    return () => {
      isActive = false;
    };
  }, [currentChat._id]);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  function handleMessagesScroll() {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 80;

    if (container.scrollTop <= 40) {
      void loadOlderMessages();
    }
  }

  async function loadOlderMessages() {
    if (
      isLoading ||
      isLoadingOlder ||
      !hasMoreMessages ||
      messages.length === 0
    ) {
      return;
    }

    const oldestMessage = messages[0];
    const container = messagesContainerRef.current;
    const previousScrollHeight = container?.scrollHeight ?? 0;
    const previousScrollTop = container?.scrollTop ?? 0;

    setIsLoadingOlder(true);

    try {
      const result = await getMessages(
        currentChat._id,
        20,
        oldestMessage._id,
      );
      const olderMessages = [...result.messages].sort(
        (first, second) =>
          new Date(first.createdAt).getTime() -
          new Date(second.createdAt).getTime(),
      );

      setMessages((previousMessages) => {
        const existingIds = new Set(
          previousMessages.map((message) => message._id),
        );
        return [
          ...olderMessages.filter((message) => !existingIds.has(message._id)),
          ...previousMessages,
        ];
      });
      setHasMoreMessages(result.hasMore);

      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop =
            previousScrollTop + container.scrollHeight - previousScrollHeight;
        }
      });
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load older messages.',
      );
    } finally {
      setIsLoadingOlder(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function connectSocket() {
      try {
        const token = await getAuthToken();
        if (!isActive) return;

        const socket = io('https://frontend-task-chatapp.onrender.com', {
          auth: { token },
        });
        socketRef.current = socket;
        socket.on('message:new', (payload: unknown) => {
          const message = normalizeSocketMessage(payload);
          if (!message || message.conversation !== currentChat._id) return;

          setMessages((previousMessages) =>
            addLiveMessage(previousMessages, message),
          );
        });
      } catch {
        // REST history and sending remain available without live updates.
      }
    }

    connectSocket();
    return () => {
      isActive = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [currentChat._id]);

  async function handleSendMessage(text: string) {
    const temporaryMessageId = `temporary-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: temporaryMessageId,
      conversation: currentChat._id,
      sender: currentUserId,
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((previousMessages) => [...previousMessages, optimisticMessage]);
    setIsSending(true);
    setError('');

    try {
      const socket = socketRef.current;
      if (socket?.connected) {
        socket.emit('message:send', {
          conversationId: currentChat._id,
          text,
        });
        return;
      }

      const message = await sendMessage(currentChat._id, text);
      setMessages((previousMessages) =>
        previousMessages.map((item) =>
          item._id === temporaryMessageId ? message : item,
        ),
      );
    } catch (requestError: unknown) {
      setMessages((previousMessages) =>
        previousMessages.filter((item) => item._id !== temporaryMessageId),
      );
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to send message.',
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="min-w-0 lg:block">
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

        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="relative h-[min(32rem,65vh)] w-full min-w-0 overflow-y-auto border-b border-gray-200 bg-white p-4 sm:p-6"
        >
          <ul className="space-y-2">
            {isLoadingOlder && (
              <li className="text-center text-xs text-slate-400">
                Loading older messages...
              </li>
            )}
            {isLoading && <li className="text-sm text-slate-400">Loading messages...</li>}
            {error && <li className="text-sm text-red-600" role="alert">{error}</li>}
            {!isLoading && !error && messages.length === 0 && (
              <li className="text-sm text-slate-400">No messages yet.</li>
            )}
            {messages.map((message) => {
              const isOwnMessage = message.sender === currentUserId;
              const messageDate = new Date(message.createdAt);
              const messageTime = Number.isNaN(messageDate.getTime())
                ? ''
                : messageDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

              return (
                <li key={message._id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${isOwnMessage ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-slate-100 text-slate-800'}`}>
                    <p className="wrap-break-word text-sm">{message.text}</p>
                    {messageTime && (
                      <time dateTime={message.createdAt} className={`mt-1 block text-[11px] ${isOwnMessage ? 'text-white/70' : 'text-slate-400'}`}>
                        {messageTime}
                      </time>
                    )}
                  </div>
                </li>
              );
            })}
            <li ref={messagesEndRef} aria-hidden="true" className="h-px" />
          </ul>
        </div>

        <ChatForm onSubmitMessage={handleSendMessage} isSending={isSending} />
      </div>
    </div>
  );
}
