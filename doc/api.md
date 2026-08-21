# Chat Application API Documentation

## Scope and Conventions

This is the standalone frontend-facing API design deliverable. The auth and user-search endpoints below are **verified** from the supplied API. The conversation, message, and real-time contracts are **proposed** where the supplied Swagger reference is incomplete.

**Base URL:** `https://frontend-task-chatapp.onrender.com/api`  
**Authentication:** Protected routes require `Authorization: Bearer <jwt-token>`.  
**Format:** JSON request and response bodies; timestamps use ISO 8601 UTC strings.

## Authentication & User Registration

### `POST /auth/login`
Single entry point for user authentication and registration. If the phone number exists in the database, it logs the user in; if the phone number is new, it creates a user profile automatically.

#### Endpoint Details
* **Method:** `POST`
* **URL:** `/auth/login`
* **Content-Type:** `application/json`
* **Auth Required:** No

#### Request Body
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `phone` | `string` | Yes | User's phone number | `"+15551234567"` |
| `name` | `string` | Yes | Full name of the user | `"Ada Lovelace"` |

**Example Request:**
```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

#### Behavior
The endpoint uses the phone number as the user's unique identifier:

* An existing phone number signs the user in.
* A new phone number creates the user with the supplied name, then signs that user in.

#### Success Response
* **Status:** `200 OK`

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "6a886e05e5d6aac97522d6bd",
    "name": "Ada Lovelace",
    "phone": "+15551234345",
    "createdAt": "2026-08-21T15:25:57.450Z"
  }
}
```

#### Error Responses

**`400 Bad Request` - Missing or invalid input**

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "path": "phone",
        "message": "Required"
      }
    ]
  }
}
```

### `GET /auth/me`
Returns the user associated with the supplied bearer token. Useful for restoring an authenticated session.

#### Endpoint Details
* **Method:** `GET`
* **URL:** `/auth/me`
* **Auth Required:** Yes, bearer token

#### Request Parameters
This endpoint does not accept path parameters, query parameters, or a request body.

| Header | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `Authorization` | Yes | Bearer token returned by `POST /auth/login`. | `Bearer <jwt-token>` |

**Example Request:**
```bash
curl -X GET "https://frontend-task-chatapp.onrender.com/api/auth/me" \
  -H "Accept: */*" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Success Response
* **Status:** `200 OK`

```json
{
  "_id": "6a886e05e5d6aac97522d6bd",
  "name": "Ada Lovelace",
  "phone": "+15551234345",
  "createdAt": "2026-08-21T15:25:57.450Z"
}
```

#### Error Responses

**`401 Unauthorized` - Missing bearer token**

```json
{
  "error": {
    "message": "No token provided",
    "code": "NO_TOKEN"
  }
}
```

## Users

### `GET /users/search`
Searches for users by name or phone number. Use the returned user identifier to start a one-to-one conversation.

#### Endpoint Details
* **Method:** `GET`
* **URL:** `/users/search`
* **Content-Type:** Not applicable
* **Auth Required:** Yes, bearer token

#### Query Parameters

| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `q` | `string` | Yes | Search term: a user's name or phone number. | `Ada` |

#### Request Headers

| Header | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `Authorization` | Yes | Bearer token returned by `POST /auth/login`. | `Bearer <jwt-token>` |

**Example Request:**
```bash
curl -X GET "https://frontend-task-chatapp.onrender.com/api/users/search?q=Ada" \
  -H "Accept: */*" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Success Response
* **Status:** `200 OK`

The response is an array of matching users.

```json
[
  {
    "_id": "6a882468e5d6aac97521e25e",
    "name": "Ada Lovelace",
    "phone": "+15551234567"
  },
  {
    "_id": "6a883617e5d6aac97521f5ed",
    "name": "Ada Updated",
    "phone": "+15551234100"
  }
]
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `string` | Unique identifier of the matching user. Use this when creating a conversation. |
| `name` | `string` | User's display name. |
| `phone` | `string` | User's phone number. |

## Conversations

### `GET /conversations`
Returns the conversations that the current user is part of, including direct and group conversations.

#### Endpoint Details
* **Method:** `GET`
* **URL:** `/conversations`
* **Content-Type:** Not applicable
* **Auth Required:** Yes, bearer token

#### Request Parameters
This endpoint does not accept path parameters, query parameters, or a request body.

| Header | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `Authorization` | Yes | Bearer token returned by `POST /auth/login`. | `Bearer <jwt-token>` |

**Example Request:**
```bash
curl -X GET "https://frontend-task-chatapp.onrender.com/api/conversations" \
  -H "Accept: */*" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Success Response
* **Status:** `200 OK`

```json
{
  "data": []
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `data` | `array` | Conversations for the authenticated user. An empty array means the user is not yet part of any direct or group conversation. |

**`401 Unauthorized` - Missing bearer token**
```json
{
  "error": {
    "message": "No token provided",
    "code": "NO_TOKEN"
  }
}
```

### `POST /conversations`
Starts or opens a one-to-one conversation with another user.

#### Endpoint Details
* **Method:** `POST`
* **URL:** `/conversations`
* **Content-Type:** `application/json`
* **Auth Required:** Yes, bearer token

#### Request Body

| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | `string` | Yes | Unique identifier of the other user in the direct conversation. | `"6a882468e5d6aac97521e25e"` |

**Example Request:**
```json
{
  "userId": "6a882468e5d6aac97521e25e"
}
```

#### Success Response
* **Status:** `200 OK`

```json
{
  "_id": "6a8889e3e5d6aac97523a01f",
  "participants": [
    "6a886e05e5d6aac97522d6bd",
    "6a882468e5d6aac97521e25e"
  ],
  "createdAt": "2026-08-21T17:24:51.654Z"
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `string` | Unique identifier of the direct conversation. |
| `participants` | `string[]` | User identifiers for the two conversation members. |
| `createdAt` | `string` | ISO 8601 timestamp for when the conversation was created. |

**`401 Unauthorized` - Missing bearer token**
```json
{
  "error": {
    "message": "No token provided",
    "code": "NO_TOKEN"
  }
}
```

### `GET /conversations/{id}/messages`
Retrieve message history for a specific conversation, with support for cursor-based pagination to load older messages.

#### Endpoint Details
* **Method:** `GET`
* **URL:** `/conversations/{id}/messages`
* **Content-Type:** Not applicable
* **Auth Required:** Yes, bearer token[cite: 1]

#### Request Parameters

| Location | Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Header` | `Authorization` | `string` | Yes | Bearer token returned by `POST /auth/login`. | `Bearer <jwt-token>`[cite: 1] |
| `Path` | `id` | `string` | Yes | The conversation ID. | `"6a882468e5d6aac97521e25e"`[cite: 1] |
| `Query` | `limit` | `integer` | No | Maximum number of messages to return per page. | `20`[cite: 1] |
| `Query` | `before` | `string` | No | Message ID cursor for fetching the page of messages sent prior to a given message. | `"msg_12345"`[cite: 1] |

**Example Request:**
```bash
curl -X GET "[https://frontend-task-chatapp.onrender.com/api/conversations/6a882468e5d6aac97521e25e/messages?limit=20](https://frontend-task-chatapp.onrender.com/api/conversations/6a882468e5d6aac97521e25e/messages?limit=20)" \
  -H "accept: */*" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Error Response
* **Status:** `404 OK`

```json
{
  "error": {
    "message": "Conversation not found",
    "code": "NOT_FOUND"
  }
}
```

  
**`401 Unauthorized` - Missing bearer token**
```json
{
  "error": {
    "message": "No token provided",
    "code": "NO_TOKEN"
  }
}
```

## Groups

### `POST /conversations/group`
Create a group conversation. The creator automatically becomes an admin.

#### Endpoint Details
* **Method:** `POST`
* **URL:** `/conversations/group`
* **Content-Type:** `application/json`
* **Auth Required:** Yes, bearer token

#### Request Parameters

| Header | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `Authorization` | Yes | Bearer token returned by `POST /auth/login`. | `Bearer <jwt-token>` |

**Request Body** *(Required)*[cite: 1]

| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | Name of the group conversation. | `"Project Team"`[cite: 1] |
| `participantIds` | `array` | Yes | Array of user IDs to include in the group (minimum 3 members total including creator). | `["6a882468e5d6aac97521e25e", "6a886e05e5d6aac97522d6bd"]`[cite: 1] |

**Example Request:**
```bash
curl -X POST "[https://frontend-task-chatapp.onrender.com/api/conversations/group](https://frontend-task-chatapp.onrender.com/api/conversations/group)" \
  -H "Accept: */*" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Team",
    "participantIds": [
      "6a882468e5d6aac97521e25e",
      "6a886e05e5d6aac97522d6bd"
    ]
  }'
```
  
#### Error Response
* **Status:** `400 OK`

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "path": "participantIds",
        "message": "a group needs at least 3 members"
      }
    ]
  }
}
```

  
**`401 Unauthorized` - Missing bearer token**
```json
{
  "error": {
    "message": "No token provided",
    "code": "NO_TOKEN"
  }
}
```


### `POST /conversations/{id}/participants`
Add one or more members to an existing group conversation (admins only).

#### Endpoint Details
* **Method:** `POST`
* **URL:** `/conversations/{id}/participants`
* **Content-Type:** `application/json`
* **Auth Required:** Yes, bearer token

#### Request Parameters

| Location | Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Header` | `Authorization` | `string` | Yes | Bearer token returned by `POST /auth/login`. | `Bearer <jwt-token>` |
| `Path` | `id` | `string` | Yes | The target group conversation ID. | `"6a8837e9e5d6aac97521fab4"` |

**Request Body** *(Required)*

| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `userIds` | `array` | Yes | Array of user IDs to add to the group. | `["6a882468e5d6aac97521e25e"]` |

**Example Request:**
```bash
curl -X POST "[https://frontend-task-chatapp.onrender.com/api/conversations/6a8837e9e5d6aac97521fab4/participants](https://frontend-task-chatapp.onrender.com/api/conversations/6a8837e9e5d6aac97521fab4/participants)" \
  -H "accept: */*" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": [
      "6a882468e5d6aac97521e25e"
    ]
  }'
```

## Messages

### `POST /messages`
Send a message to a direct or group conversation. Messages sent via this REST endpoint are also broadcast in real time over WebSockets using the `message:new` event.

#### Endpoint Details
* **Method:** `POST`
* **URL:** `/messages`
* **Content-Type:** `application/json`
* **Auth Required:** Yes, bearer token

#### Request Parameters

| Header | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `Authorization` | Yes | Bearer token returned by `POST /auth/login`. | `Bearer <jwt-token>` |

**Request Body** *(Required)*

| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `conversationId` | `string` | Yes | The target conversation ID where the message will be posted. | `"6a8889e3e5d6aac97523a01f"` |
| `text` | `string` | Yes | Message text content (must not be empty or whitespace-only). | `"Hello!"`[cite: 1] |

**Example Request:**
```bash
curl -X POST "[https://frontend-task-chatapp.onrender.com/api/messages](https://frontend-task-chatapp.onrender.com/api/messages)" \
  -H "accept: */*" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "6a8889e3e5d6aac97523a01f",
    "text": "Hello!"
  }'
```

**Response Body**
* **Status:** `200 OK`

```json{
  "_id": "6a889565e5d6aac97523f2fd",
  "conversation": "6a8889e3e5d6aac97523a01f",
  "sender": "6a886e05e5d6aac97522d6bd",
  "text": "Hello!",
  "createdAt": "2026-08-21T18:13:57.078Z"
}
```