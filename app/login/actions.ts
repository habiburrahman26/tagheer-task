'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.BASE_URL;

export type LoginState = {
  error?: string;
};

export type User = {
  _id: string;
  name: string;
  phone: string;
  createdAt: string;
};

export async function getAuthToken(): Promise<string> {
  const authToken = (await cookies()).get('authToken')?.value;

  if (!authToken) {
    throw new Error('Authentication required.');
  }

  return authToken;
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = formData.get('phone');
  const name = formData.get('name');

  if (
    typeof phone !== 'string' ||
    typeof name !== 'string' ||
    !phone.trim() ||
    !name.trim()
  ) {
    return { error: 'Phone number and name are required.' };
  }

  let response: Response;
  let data: { token?: string; error?: { message?: string } };

  try {
    response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.trim(), name: name.trim() }),
      cache: 'no-store',
    });

    data = await response.json();
  } catch {
    return { error: 'Unable to reach the login service. Please try again.' };
  }

  if (!response.ok || !data?.token) {
    return {
      error:
        data?.error?.message || 'Unable to log in. Please check your details.',
    };
  }

  const cookieStore = await cookies();
  cookieStore.set('authToken', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/chat');
}

export async function logout(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
  redirect('/');
}


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

export async function getConversions(): Promise<Conversation[]> {
  const authToken = (await cookies()).get('authToken')?.value;

  if (!authToken) {
    throw new Error('Authentication required.');
  }

  const response = await fetch(
    `${BASE_URL}/api/conversations`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      cache: 'no-store',
    },
  );
  const result: { data?: Conversation[]; error?: { message?: string } } =
    await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Unable to load conversations.');
  }

  return result.data ?? [];
}

export async function searchUsers(query: string): Promise<SearchUser[]> {
  const authToken = (await cookies()).get('authToken')?.value;

  if (!authToken) {
    throw new Error('Authentication required.');
  }

  const response = await fetch(
    `${BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      cache: 'no-store',
    },
  );
  const result: SearchUser[] | { error?: { message?: string } } =
    await response.json();

  if (!response.ok) {
    throw new Error(
      'error' in result && result.error?.message
        ? result.error.message
        : 'Unable to search users.',
    );
  }

  return Array.isArray(result) ? result : [];
}

export async function createConversation(userId: string): Promise<Conversation> {
  const authToken = (await cookies()).get('authToken')?.value;

  if (!authToken) {
    throw new Error('Authentication required.');
  }

  const response = await fetch(
    `${BASE_URL}/api/conversations`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
      cache: 'no-store',
    },
  );
  const result: { _id?: string; error?: { message?: string } } =
    await response.json();

  if (!response.ok) {
    throw new Error(
      'error' in result && result.error?.message
        ? result.error.message
        : 'Unable to start conversation.',
    );
  }

  const conversations = await getConversions();
  const conversation = conversations.find(
    (item) => item._id === result._id,
  );

  if (!conversation) {
    throw new Error('Conversation created, but could not be loaded.');
  }

  return conversation;
}

export async function getCurrentUser(): Promise<User> {
  const authToken = (await cookies()).get('authToken')?.value;

  if (!authToken) {
    throw new Error('Authentication required.');
  }

  const response = await fetch(
    `${BASE_URL}/api/auth/me`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      cache: 'no-store',
    },
  );
  const result: User | { error?: { message?: string } } = await response.json();

  if (!response.ok) {
    throw new Error(
      'error' in result && result.error?.message
        ? result.error.message
        : 'Unable to load your account.',
    );
  }

  return result as User;
}

export async function getMessages(
  conversationId: string,
  limit = 20,
  before?: string,
): Promise<MessagesResponse> {
  const authToken = (await cookies()).get('authToken')?.value;

  if (!authToken) {
    throw new Error('Authentication required.');
  }

  const params = new URLSearchParams({ limit: String(limit) });
  if (before) {
    params.set('before', before);
  }

  const response = await fetch(
    `${BASE_URL}/api/conversations/${encodeURIComponent(conversationId)}/messages?${params.toString()}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      cache: 'no-store',
    },
  );
  const result: MessagesResponse | { error?: { message?: string } } =
    await response.json();

  if (!response.ok) {
    throw new Error(
      'error' in result && result.error?.message
        ? result.error.message
        : 'Unable to load messages.',
    );
  }

  return result as MessagesResponse;
}

export async function sendMessage(
  conversationId: string,
  text: string,
): Promise<Message> {
  const authToken = (await cookies()).get('authToken')?.value;

  if (!authToken) {
    throw new Error('Authentication required.');
  }

  const response = await fetch(
    `${BASE_URL}/api/messages`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationId, text }),
      cache: 'no-store',
    },
  );
  const result: Message | { error?: { message?: string } } =
    await response.json();

  if (!response.ok) {
    throw new Error(
      'error' in result && result.error?.message
        ? result.error.message
        : 'Unable to send message.',
    );
  }

  return result as Message;
}