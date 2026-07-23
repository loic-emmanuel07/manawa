// src/sockets/events.ts
export const EVENTS = {
	// === Client → Serveur ===

	CONVERSATION_JOIN: "conversation:join",
	CONVERSATION_CREATE: "conversation:create",
	CONVERSATION_LEAVE: "conversation:leave",

	MESSAGE_SEND: "message:send",
	MESSAGE_READ: "message:read",

	// Présence / activité
	TYPING_START: "typing:start",
	TYPING_STOP: "typing:stop",

	// === Serveur → Client ===

	CONVERSATION_CREATED: "conversation:created",
	PARTICIPANT_ADDED: "participant:added",
	PARTICIPANT_REMOVED: "participant:removed",

	MESSAGE_NEW: "message:new",
	MESSAGE_SEEN: "message:seen",

	USER_TYPING: "user:typing",
	USER_STOPPED_TYPING: "user:stopped_typing",
	USER_ONLINE: "user:online",
	USER_OFFLINE: "user:offline",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
