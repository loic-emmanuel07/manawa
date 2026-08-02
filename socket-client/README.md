# @manawa/socket-client

Typed Socket.IO client SDK for the Manawa realtime API (conversations & messages).

This package is intentionally standalone — it has no dependency on the `backend`
package or on any workspace tooling, so it can be installed independently from
the `frontend` branch/repo without pulling in the backend's build.

## Install

From the frontend project:

```bash
npm install /path/to/manawa/socket-client
# or, once this repo's remote is reachable:
npm install "manawa@git+https://<repo-url>.git#path:socket-client"
```

Until this is published somewhere both branches can reach, the simplest option
during development is to copy the `socket-client/` folder into the frontend
project, or `npm link` it locally.

## Usage

```ts
import { ManawaSocketClient } from "@manawa/socket-client";

const client = new ManawaSocketClient({ url: "http://localhost:3000" });

// The token is the Supabase access token for the logged-in user —
// the backend's socket auth middleware validates it via supabase.auth.getUser().
client.connect(supabaseAccessToken);

client.onConnect(() => console.log("connected"));
client.onConnectError((err) => console.error("connection failed", err.message));

const unsubscribe = client.onMessageNew((message) => {
	console.log(message.conversationId, message.text);
});

const joinResult = await client.joinConversation(conversationId);
if (!joinResult.ok) {
	console.error(joinResult.error);
}

await client.sendMessage(conversationId, "hello");

// later
unsubscribe();
client.disconnect();
```

### React

```tsx
import { useEffect, useRef } from "react";
import { ManawaSocketClient, type Message } from "@manawa/socket-client";

function useManawaSocket(token: string | null) {
	const clientRef = useRef<ManawaSocketClient | null>(null);

	useEffect(() => {
		if (!token) return;
		const client = new ManawaSocketClient({ url: import.meta.env.VITE_BACKEND_URL });
		client.connect(token);
		clientRef.current = client;
		return () => client.disconnect();
	}, [token]);

	return clientRef;
}
```

## API surface

Actions (client → server, all return a `Promise<AckResponse<...>>` except the
fire-and-forget ones):

- `createConversation({ participantIds, name? })`
- `joinConversation(conversationId)`
- `leaveConversation(conversationId)`
- `sendMessage(conversationId, text)`
- `markMessageRead(conversationId, messageId)` — reserved, not handled by the backend yet
- `startTyping(conversationId)` / `stopTyping(conversationId)` — reserved, not handled by the backend yet

Subscriptions (server → client), each returns an unsubscribe function:

- `onConversationCreated`
- `onParticipantAdded` / `onParticipantRemoved` — reserved, not emitted by the backend yet
- `onMessageNew`
- `onMessageSeen` — reserved, not emitted by the backend yet
- `onUserTyping` / `onUserStoppedTyping` — reserved, not emitted by the backend yet
- `onUserOnline` / `onUserOffline` — reserved, not emitted by the backend yet

"Reserved" methods emit/listen on event names the backend already declares in
`sockets/events.ts` but doesn't wire up to a handler yet — calling them is safe,
they just won't do anything server-side until that lands.

For anything not covered here, `client.raw` exposes the underlying
`socket.io-client` `Socket` instance, typed with the same event maps.

## Auth

The backend's socket middleware requires `socket.handshake.auth.token` to be a
valid Supabase access token (`supabase.auth.getUser(token)`). Pass it as the
`token` argument to `connect()`. There is currently no automatic refresh/retry
on token expiry — reconnect with a fresh token when the Supabase session
refreshes.

## Development

```bash
npm install
npm run build   # emits dist/ (JS + .d.ts)
npm run dev     # tsc --watch
```

`src/events.ts` and the payload/domain shapes in `src/types.ts` mirror
`backend/src/sockets/events.ts` and `backend/src/types/index.ts` by hand,
since the backend and frontend live on separate branches and this package
isn't wired into a shared workspace. If the backend event contract changes,
update both sides.
