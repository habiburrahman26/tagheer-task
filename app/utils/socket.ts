import { Message } from "../types/types";

export function normalizeSocketMessage(payload: unknown): Message | null {
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

export function addLiveMessage(
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