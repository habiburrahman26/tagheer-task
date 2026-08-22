# Chat App

* **Part 1 & 2 (Chat Application):** [https://tagheer-task.vercel.app/](https://tagheer-task.vercel.app/)
* **GitHub Repository:** [https://github.com/habiburrahman26/tagheer-task](https://github.com/habiburrahman26/tagheer-task)

A responsive real-time chat application built with **Next.js, React, TypeScript, Tailwind CSS, REST APIs, and Socket.io**.

The application provides authenticated messaging with conversation lists, user search, real-time message updates, optimistic sending, pagination, and responsive layouts for desktop and mobile.

---

## Tech Stack

- **Next.js** — App Router
- **React** — UI and component architecture
- **TypeScript** — Type-safe application code
- **Tailwind CSS** — For styling
- **Socket.io** — Real-time message and conversation updates
- **Heroicons** — UI icons
- **DiceBear** — Deterministic user avatars
- **REST API** — Authentication, users, conversations, and messages

---

## Architecture

I chose **Next.js with the App Router** because the application requires routing, authentication boundaries, and both server-side and client-side behavior.

Authenticated REST requests are handled through **Server Actions**. The JWT is stored in an `httpOnly` `authToken` cookie, allowing the server to read the token securely and attach it to API requests as:

```http
Authorization: Bearer <token>
```

The authentication token is therefore not directly exposed to client-side JavaScript.

For real-time communication, the application uses **Socket.io** for live message and conversation updates. This allows the UI to react to incoming events without requiring continuous REST polling.

---

## Key Features

### Authentication

- Login through the provided authentication API
- Secure JWT storage using an `httpOnly` cookie
- Protected application routes
- Server-side authentication checks

### Conversations

- Conversation list
- Direct and group conversation support
- Conversation search
- Active conversation state
- Responsive conversation sidebar

### Messaging

- Send and receive messages
- Real-time Socket.io updates
- Optimistic message sending
- Duplicate-message prevention
- Sender-specific message alignment
- Automatic scrolling when appropriate
- Loading and error states
- Cursor-based pagination for older messages

### Responsive UI

The interface is designed around familiar chat application patterns:

- Two-pane workspace on desktop
- Stacked layout on smaller screens
- Right-aligned outgoing messages
- Left-aligned incoming messages
- Clear visual hierarchy
- Responsive conversation navigation

---

## Design Decisions

### Visual Design

The interface uses a warm ivory background with coral as the primary accent, supported by dark navy, mint, and yellow tones.

The goal was to create a friendly visual identity while keeping the conversation itself as the primary focus.

### Message Layout

Messages follow common chat conventions:

- **Outgoing messages:** aligned to the right
- **Incoming messages:** aligned to the left

This makes message ownership immediately recognizable.

### Loading, Empty, and Error States

The application includes explicit loading, empty, and error states rather than assuming that API requests will always succeed.

This keeps the UI understandable while data is being fetched or when something goes wrong.

### Optimistic Updates

When a user sends a message, the UI updates immediately instead of waiting for the server response.

The application then reconciles the optimistic message with the server response and prevents duplicate messages when the corresponding Socket.io event is received.

### Pagination

Older messages are loaded using cursor-based pagination rather than loading the entire conversation history at once.

This keeps the initial conversation load smaller and provides a better foundation for larger conversations.

---

## API Integration

The frontend communicates with the backend through REST endpoints for operations such as:

- Authentication
- User search
- Conversation retrieval
- Message retrieval
- Message creation

Real-time updates are handled separately through Socket.io.

This separation allows REST to remain responsible for persistent data operations while Socket.io provides live updates to the interface.

---

## Trade-offs

### Server Actions

Using Server Actions provides a convenient and secure place to read the `httpOnly` authentication cookie before making authenticated API requests.

The trade-off is that this approach is more tightly coupled to Next.js than a standalone API client would be.

If the frontend needed to support multiple clients or frameworks, a dedicated API client layer would provide better reusability.

### Socket.io

Socket.io provides a straightforward event-driven model for real-time communication.

The trade-off is additional complexity around:

- Connection lifecycle
- Reconnection
- Duplicate events
- Optimistic updates
- Offline states

For this application, the benefits of real-time updates outweigh that additional complexity.

---

## AI-Assisted Development

AI tools were used during development for:

- Exploring the existing codebase
- Debugging TypeScript and React issues
- Exploring component structures
- Generating initial styling ideas
- Drafting API documentation
- Investigating integration issues

AI-generated output was reviewed and adapted rather than accepted unchanged.

Important implementation decisions were made and validated manually, including:

- Preserving the Next.js architecture
- Keeping authentication tokens in secure `httpOnly` cookies
- Adjusting API response types for direct and group conversations
- Implementing optimistic message updates
- Adding message deduplication
- Correcting generated API integration details
- Validating Socket.io behavior

AI was used as a development assistant rather than as a replacement for implementation and review.

---

## What I Would Improve

Given additional development time, I would focus on the following improvements.

### Testing

Add automated tests covering:

- Authentication
- Protected routes
- Conversation loading
- Message pagination
- Optimistic message sending
- Socket.io events
- Error states

### API Client and Shared Types

Extract the API client and shared TypeScript types into dedicated modules.

This would reduce coupling between UI components and backend implementation details and make the codebase easier to maintain.

### Real-Time Reliability

Improve Socket.io handling with:

- Better reconnection behavior
- Connection status indicators
- Offline states
- Message retry handling
- More robust event reconciliation

### Read Receipts

Add a backend-supported read-receipt contract and expose message states such as:

```text
sent → delivered → read
```

### Client-Side Caching

Replace refresh-triggered conversation fetching with a shared client-side cache.

This would make conversation updates more efficient and reduce unnecessary API requests.

### Accessibility

Further improve:

- Keyboard navigation
- Focus management
- Search result navigation
- Screen-reader labels
- Message interaction accessibility

### Monitoring

For production deployment, I would add application monitoring and error tracking to identify API failures, socket connection issues, and unexpected client-side errors.

---

## Summary

The application was designed around three main priorities:

1. **Secure authentication**
2. **Responsive and familiar chat UX**
3. **Real-time communication**

Next.js provides the application structure and server-side authentication boundary, REST handles persistent data operations, and Socket.io provides real-time updates.

The implementation intentionally balances simplicity with production-oriented concerns such as optimistic updates, pagination, error handling, authentication security, and responsive design.