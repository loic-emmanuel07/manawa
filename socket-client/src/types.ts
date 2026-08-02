// --- Domain models (mirrors backend/src/db/schema.ts) ---

export interface Conversation {
	id: string;
	isGroup: boolean;
	name: string | null;
	createdAt: string;
	participantIds: string[];
}

export interface Message {
	id: string;
	conversationId: string;
	senderId: string;
	text: string;
	createdAt: string;
}

// --- Ack payloads (mirrors the `ack({ ok, ... })` calls in backend handlers) ---

export type AckResponse<T = Record<string, never>> =
	| ({ ok: true } & T)
	| { ok: false; error: string };

export interface CreateConversationPayload {
	participantIds: string[];
	name?: string;
}

// --- Typed event maps for socket.io-client's Socket<ServerToClient, ClientToServer> ---
// TYPING_START/STOP and MESSAGE_READ are declared for forward-compatibility but are
// not yet handled by the backend — emitting them is currently a no-op server-side.

export interface ServerToClientEvents {
	"conversation:created": (conversation: Conversation) => void;
	"participant:added": (payload: { conversationId: string; userId: string }) => void;
	"participant:removed": (payload: { conversationId: string; userId: string }) => void;
	"message:new": (message: Message) => void;
	"message:seen": (payload: {
		conversationId: string;
		messageId: string;
		userId: string;
	}) => void;
	"user:typing": (payload: { conversationId: string; userId: string }) => void;
	"user:stopped_typing": (payload: { conversationId: string; userId: string }) => void;
	"user:online": (payload: { userId: string }) => void;
	"user:offline": (payload: { userId: string }) => void;
}

export interface ClientToServerEvents {
	"conversation:create": (
		payload: CreateConversationPayload,
		ack: (res: AckResponse<{ conversationId: string }>) => void,
	) => void;
	"conversation:join": (
		payload: { conversationId: string },
		ack: (res: AckResponse) => void,
	) => void;
	"conversation:leave": (
		payload: { conversationId: string },
		ack: (res: AckResponse) => void,
	) => void;
	"message:send": (
		payload: { conversationId: string; text: string },
		ack: (res: AckResponse) => void,
	) => void;
	"message:read": (payload: { conversationId: string; messageId: string }) => void;
	"typing:start": (payload: { conversationId: string }) => void;
	"typing:stop": (payload: { conversationId: string }) => void;
}
