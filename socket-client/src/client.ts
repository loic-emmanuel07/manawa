import { type Socket, io } from "socket.io-client";
import { EVENTS } from "./events";
import type {
	AckResponse,
	ClientToServerEvents,
	Conversation,
	CreateConversationPayload,
	Message,
	ServerToClientEvents,
} from "./types";

type ManawaSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
type Unsubscribe = () => void;

export interface ManawaSocketClientOptions {
	/** Base URL of the backend, e.g. "http://localhost:3000" */
	url: string;
}

/**
 * Typed wrapper around socket.io-client for the Manawa realtime API.
 *
 * ```ts
 * const client = new ManawaSocketClient({ url: "http://localhost:3000" });
 * client.connect(supabaseAccessToken);
 * client.onMessageNew((message) => console.log(message));
 * await client.joinConversation(conversationId);
 * await client.sendMessage(conversationId, "hello");
 * ```
 */
export class ManawaSocketClient {
	private readonly url: string;
	private socket: ManawaSocket | null = null;

	constructor(options: ManawaSocketClientOptions) {
		this.url = options.url;
	}

	/** Opens the connection, authenticating with a Supabase access token. */
	connect(token: string): ManawaSocket {
		this.socket = io(this.url, {
			auth: { token },
		});
		return this.socket;
	}

	disconnect(): void {
		this.socket?.disconnect();
		this.socket = null;
	}

	get connected(): boolean {
		return this.socket?.connected ?? false;
	}

	/** Escape hatch for anything not covered by this wrapper. */
	get raw(): ManawaSocket {
		return this.requireSocket();
	}

	private requireSocket(): ManawaSocket {
		if (!this.socket) {
			throw new Error("ManawaSocketClient: not connected — call connect(token) first");
		}
		return this.socket;
	}

	// --- Connection lifecycle ---

	onConnect(handler: () => void): Unsubscribe {
		this.requireSocket().on("connect", handler);
		return () => this.socket?.off("connect", handler);
	}

	onDisconnect(handler: (reason: string) => void): Unsubscribe {
		this.requireSocket().on("disconnect", handler);
		return () => this.socket?.off("disconnect", handler);
	}

	onConnectError(handler: (error: Error) => void): Unsubscribe {
		this.requireSocket().on("connect_error", handler);
		return () => this.socket?.off("connect_error", handler);
	}

	// --- Client → Server actions ---

	createConversation(
		payload: CreateConversationPayload,
	): Promise<AckResponse<{ conversationId: string }>> {
		return new Promise((resolve) => {
			this.requireSocket().emit(EVENTS.CONVERSATION_CREATE, payload, resolve);
		});
	}

	joinConversation(conversationId: string): Promise<AckResponse> {
		return new Promise((resolve) => {
			this.requireSocket().emit(EVENTS.CONVERSATION_JOIN, { conversationId }, resolve);
		});
	}

	leaveConversation(conversationId: string): Promise<AckResponse> {
		return new Promise((resolve) => {
			this.requireSocket().emit(EVENTS.CONVERSATION_LEAVE, { conversationId }, resolve);
		});
	}

	sendMessage(conversationId: string, text: string): Promise<AckResponse> {
		return new Promise((resolve) => {
			this.requireSocket().emit(EVENTS.MESSAGE_SEND, { conversationId, text }, resolve);
		});
	}

	/** Not yet handled by the backend — reserved for when read receipts land. */
	markMessageRead(conversationId: string, messageId: string): void {
		this.requireSocket().emit(EVENTS.MESSAGE_READ, { conversationId, messageId });
	}

	/** Not yet handled by the backend — reserved for when typing indicators land. */
	startTyping(conversationId: string): void {
		this.requireSocket().emit(EVENTS.TYPING_START, { conversationId });
	}

	/** Not yet handled by the backend — reserved for when typing indicators land. */
	stopTyping(conversationId: string): void {
		this.requireSocket().emit(EVENTS.TYPING_STOP, { conversationId });
	}

	// --- Server → Client subscriptions ---

	onConversationCreated(handler: (conversation: Conversation) => void): Unsubscribe {
		this.requireSocket().on(EVENTS.CONVERSATION_CREATED, handler);
		return () => this.socket?.off(EVENTS.CONVERSATION_CREATED, handler);
	}

	onParticipantAdded(
		handler: (payload: { conversationId: string; userId: string }) => void,
	): Unsubscribe {
		this.requireSocket().on(EVENTS.PARTICIPANT_ADDED, handler);
		return () => this.socket?.off(EVENTS.PARTICIPANT_ADDED, handler);
	}

	onParticipantRemoved(
		handler: (payload: { conversationId: string; userId: string }) => void,
	): Unsubscribe {
		this.requireSocket().on(EVENTS.PARTICIPANT_REMOVED, handler);
		return () => this.socket?.off(EVENTS.PARTICIPANT_REMOVED, handler);
	}

	onMessageNew(handler: (message: Message) => void): Unsubscribe {
		this.requireSocket().on(EVENTS.MESSAGE_NEW, handler);
		return () => this.socket?.off(EVENTS.MESSAGE_NEW, handler);
	}

	onMessageSeen(
		handler: (payload: { conversationId: string; messageId: string; userId: string }) => void,
	): Unsubscribe {
		this.requireSocket().on(EVENTS.MESSAGE_SEEN, handler);
		return () => this.socket?.off(EVENTS.MESSAGE_SEEN, handler);
	}

	onUserTyping(handler: (payload: { conversationId: string; userId: string }) => void): Unsubscribe {
		this.requireSocket().on(EVENTS.USER_TYPING, handler);
		return () => this.socket?.off(EVENTS.USER_TYPING, handler);
	}

	onUserStoppedTyping(
		handler: (payload: { conversationId: string; userId: string }) => void,
	): Unsubscribe {
		this.requireSocket().on(EVENTS.USER_STOPPED_TYPING, handler);
		return () => this.socket?.off(EVENTS.USER_STOPPED_TYPING, handler);
	}

	onUserOnline(handler: (payload: { userId: string }) => void): Unsubscribe {
		this.requireSocket().on(EVENTS.USER_ONLINE, handler);
		return () => this.socket?.off(EVENTS.USER_ONLINE, handler);
	}

	onUserOffline(handler: (payload: { userId: string }) => void): Unsubscribe {
		this.requireSocket().on(EVENTS.USER_OFFLINE, handler);
		return () => this.socket?.off(EVENTS.USER_OFFLINE, handler);
	}
}
