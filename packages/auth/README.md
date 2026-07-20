# @tanstackship/auth

> Authentication utilities for web apps. Password hashing, sessions, and OAuth helpers.

## Features

- 🔐 Password hashing using Web Crypto API
- 🍪 Cookie building and parsing
- 💾 Session management
- 🎲 Secure token generation

## Installation

```bash
npm install @tanstackship/auth
```

## Quick Start

```typescript
import { 
  hashPassword, 
  verifyPassword,
  createSession,
  buildCookie 
} from '@tanstackship/auth'

// Hash and verify passwords
const hash = await hashPassword('my-password')
const valid = await verifyPassword('my-password', hash)

// Create sessions
const session = createSession('user-123', 60 * 60 * 24 * 7) // 7 days
const cookie = buildCookie({
  name: 'session',
  value: session.id,
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
})
```

## API

### Password

- `hashPassword(password)` - Hash a password using SHA-256
- `verifyPassword(password, hash)` - Verify a password against a hash

### Session

- `createSession(userId, expiresIn?)` - Create a new session
- `storeSession(session)` - Store a session
- `getSession(id)` - Get a session by ID
- `deleteSession(id)` - Delete a session
- `isSessionExpired(session)` - Check if session is expired

### Cookie

- `buildCookie(options)` - Build a cookie string
- `parseCookies(header)` - Parse cookies from header

## License

MIT
