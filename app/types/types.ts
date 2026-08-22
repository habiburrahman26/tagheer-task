export type LoginState = {
  error?: string;
};

export type User = {
  _id: string;
  name: string;
  phone: string;
  createdAt: string;
};


export type ConversationParticipant = {
  _id: string;
  name: string;
  phone: string;
};

export type SearchUser = Omit<ConversationParticipant, 'createdAt'>;

export type LastMessage = {
  text?: string;
  sender?: string;
  createdAt?: string;
};

type ConversationBase = {
  _id: string;
  type: 'direct' | 'group';
  lastMessage: LastMessage;
  updatedAt: string;
  createdBy?: string;
  admins?: string[];
};

export type GroupConversation = ConversationBase & {
  type: 'group';
  name: string;
  participants: ConversationParticipant[];
};

export type DirectConversation = ConversationBase & {
  type: 'direct';
  participant: ConversationParticipant;
};

export type Conversation = GroupConversation | DirectConversation;

export type Message = {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
};

export type MessagesResponse = {
  messages: Message[];
  hasMore: boolean;
};