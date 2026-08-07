// Outil de dev interactif : simule un client (HTTP + Socket.IO) pour tester
// register/login/conversations/messages à la main, faute de tests automatisés.
// Usage: npm run dev:tui   (le serveur doit déjà tourner, cf. `npm run dev`)
import blessed from "neo-blessed";
import { io, type Socket } from "socket.io-client";
import { EVENTS } from "../src/sockets/events";

const API_URL =
	process.env.API_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

// --- Types des réponses HTTP / acks socket, pour ne pas manipuler du `any` partout ---

interface ErrorResponse {
	error: string;
}
interface RegisterResponse {
	user: { id: string; email: string; displayName: string };
}
interface LoginResponse {
	user: { id: string; email: string; displayName?: string; avatarUrl?: string };
	session: { access_token: string; refresh_token: string };
}
type CreateAck =
	| { ok: true; conversationId: string }
	| { ok: false; error: string };
type SimpleAck = { ok: true } | { ok: false; error: string };

interface TuiState {
	token?: string;
	userId?: string;
	email?: string;
	socket?: Socket;
	lastConversationId?: string;
}
const state: TuiState = {};

// --- Variables "@" : @me et @conv s'expansent avant parsing, pour éviter de
// recopier des UUID à la main (@me -> son propre id, @conv -> la dernière
// conversation créée/rejointe). Non résolue -> laissée telle quelle (l'usage
// de la commande visée signalera l'argument manquant/invalide).
const VARS: Record<string, () => string | undefined> = {
	"@me": () => state.userId,
	"@conv": () => state.lastConversationId,
};

function resolveVars(line: string): string {
	return line.replace(/@me\b|@conv\b/g, (token) => VARS[token]?.() ?? token);
}

// --- UI ---

const screen = blessed.screen({
	smartCSR: true,
	title: "Manawa · Socket TUI",
});

const statusBar = blessed.box({
	top: 0,
	left: 0,
	width: "100%",
	height: 3,
	border: "line",
	tags: true,
	style: { border: { fg: "cyan" } },
});

const logBox = blessed.log({
	top: 3,
	left: 0,
	width: "100%",
	bottom: 3,
	border: "line",
	tags: true,
	mouse: true,
	scrollable: true,
	alwaysScroll: true,
	scrollbar: { ch: " ", style: { inverse: true } },
	style: { border: { fg: "cyan" } },
});

const inputBox = blessed.textbox({
	bottom: 0,
	left: 0,
	width: "100%",
	height: 3,
	border: "line",
	label: " command (help, @me, @conv, ↑↓ history, ⇥ complete) ",
	inputOnFocus: true,
	style: { border: { fg: "cyan" }, focus: { border: { fg: "yellow" } } },
});

screen.append(statusBar);
screen.append(logBox);
screen.append(inputBox);

type LogKind = "info" | "success" | "warn" | "error" | "event" | "input";
const LOG_COLORS: Record<LogKind, string> = {
	info: "cyan",
	success: "green",
	warn: "yellow",
	error: "red",
	event: "magenta",
	input: "white",
};

function logLine(kind: LogKind, text: string): void {
	const color = LOG_COLORS[kind];
	logBox.log(`{${color}-fg}${blessed.escape(text)}{/${color}-fg}`);
	screen.render();
}

// --- Indicateur "travail en cours" (spinner), pour les commandes async
// (register/login en HTTP, create/join/leave/send en attente d'un ack socket)
// qui autrement ne laissent rien voir pendant potentiellement plusieurs secondes.

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let pending = 0;
let spinnerFrame = 0;
let spinnerTimer: ReturnType<typeof setInterval> | undefined;

function setBusy(busy: boolean): void {
	pending += busy ? 1 : -1;
	if (pending > 0 && !spinnerTimer) {
		spinnerTimer = setInterval(() => {
			spinnerFrame = (spinnerFrame + 1) % SPINNER_FRAMES.length;
			renderStatus();
		}, 80);
	} else if (pending <= 0 && spinnerTimer) {
		clearInterval(spinnerTimer);
		spinnerTimer = undefined;
	}
	renderStatus();
}

function renderStatus(): void {
	const busy =
		pending > 0
			? `{yellow-fg}${SPINNER_FRAMES[spinnerFrame]} working…{/yellow-fg}  `
			: "";
	const connection = state.socket?.connected
		? "{green-fg}● connected{/green-fg}"
		: "{red-fg}○ disconnected{/red-fg}";
	const user = state.email
		? `${state.email} (${state.userId})`
		: "{grey-fg}not logged in{/grey-fg}";
	const socketId = state.socket?.id ?? "-";
	statusBar.setContent(
		` ${busy}${connection}  {bold}user:{/bold} ${user}  {bold}socket:{/bold} ${socketId}  {bold}api:{/bold} ${API_URL}`,
	);
	screen.render();
}

// --- HTTP helpers ---

async function postJson<T>(
	path: string,
	body: unknown,
): Promise<{ ok: boolean; status: number; data: T | ErrorResponse }> {
	const res = await fetch(`${API_URL}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const data = (await res.json()) as T | ErrorResponse;
	return { ok: res.ok, status: res.status, data };
}

// --- Socket connection ---

function connectSocket(): void {
	if (!state.token) {
		logLine("warn", "Login first (or run: connect)");
		return;
	}
	state.socket?.disconnect();

	const socket = io(API_URL, { auth: { token: state.token } });
	state.socket = socket;

	socket.on("connect", () => {
		logLine("success", `Socket connected -> ${socket.id}`);
		renderStatus();
	});
	socket.on("disconnect", (reason) => {
		logLine("warn", `Socket disconnected (${reason})`);
		renderStatus();
	});
	socket.on("connect_error", (err) => {
		logLine("error", `Socket connect_error: ${err.message}`);
	});
	socket.on(EVENTS.CONVERSATION_CREATED, (payload) => {
		logLine(
			"event",
			`${EVENTS.CONVERSATION_CREATED} ${JSON.stringify(payload)}`,
		);
	});
	socket.on(EVENTS.MESSAGE_NEW, (payload) => {
		logLine("event", `${EVENTS.MESSAGE_NEW} ${JSON.stringify(payload)}`);
	});
}

// --- Commands ---

const HELP = [
	"register <email> <password> <displayName>",
	"login <email> <password>",
	"connect                                    (reconnect socket with current token)",
	"create <id1,id2,...> [name]                (conversation:create)",
	"join <conversationId>                      (conversation:join)",
	"leave <conversationId>                     (conversation:leave)",
	"send <conversationId> <text...>            (message:send)",
	"whoami",
	"clear",
	"quit / exit",
	"",
	"@me   -> your own userId",
	"@conv -> last created/joined conversationId",
	"Up/Down: command history · Tab: complete command name",
];

async function cmdRegister(args: string[]): Promise<void> {
	const [email, password, ...nameParts] = args;
	if (!email || !password || nameParts.length === 0) {
		logLine("warn", "Usage: register <email> <password> <displayName>");
		return;
	}
	const displayName = nameParts.join(" ");
	const { ok, status, data } = await postJson<RegisterResponse>(
		"/auth/register",
		{
			email,
			password,
			displayName,
		},
	);
	if (!ok) {
		logLine(
			"error",
			`Register failed (${status}): ${(data as ErrorResponse).error}`,
		);
		return;
	}
	const { user } = data as RegisterResponse;
	logLine("success", `Registered -> ${user.id} (${user.email})`);
}

async function cmdLogin(args: string[]): Promise<void> {
	const [email, password] = args;
	if (!email || !password) {
		logLine("warn", "Usage: login <email> <password>");
		return;
	}
	const { ok, status, data } = await postJson<LoginResponse>("/auth/login", {
		email,
		password,
	});
	if (!ok) {
		logLine(
			"error",
			`Login failed (${status}): ${(data as ErrorResponse).error}`,
		);
		return;
	}
	const { user, session } = data as LoginResponse;
	state.token = session.access_token;
	state.userId = user.id;
	state.email = user.email;
	logLine("success", `Logged in -> ${user.id} (${user.email})`);
	renderStatus();
	connectSocket();
}

// Ces commandes retournent une Promise résolue par l'ack, plutôt que de rendre
// la main tout de suite : c'est ce qui permet à handleCommand() de garder le
// spinner affiché jusqu'à la réponse du serveur, pas juste jusqu'à l'emit.

function cmdCreate(args: string[]): Promise<void> {
	return new Promise((resolve) => {
		if (!state.socket) {
			logLine("warn", "Connect first (login)");
			return resolve();
		}
		const [idsRaw, ...nameParts] = args;
		if (!idsRaw) {
			logLine("warn", "Usage: create <id1,id2,...> [name]");
			return resolve();
		}
		const participantIds = idsRaw.split(",").filter(Boolean);
		const name = nameParts.join(" ") || undefined;
		state.socket.emit(
			EVENTS.CONVERSATION_CREATE,
			{ participantIds, name },
			(ack: CreateAck) => {
				if (ack.ok) {
					state.lastConversationId = ack.conversationId;
					logLine(
						"success",
						`Conversation created -> ${ack.conversationId} (@conv)`,
					);
				} else {
					logLine("error", `create failed: ${ack.error}`);
				}
				resolve();
			},
		);
	});
}

function cmdJoin(args: string[]): Promise<void> {
	return new Promise((resolve) => {
		if (!state.socket) {
			logLine("warn", "Connect first (login)");
			return resolve();
		}
		const [conversationId] = args;
		if (!conversationId) {
			logLine("warn", "Usage: join <conversationId>");
			return resolve();
		}
		state.socket.emit(
			EVENTS.CONVERSATION_JOIN,
			{ conversationId },
			(ack: SimpleAck) => {
				if (ack.ok) {
					state.lastConversationId = conversationId;
					logLine("success", `Joined -> ${conversationId} (@conv)`);
				} else {
					logLine("error", `join failed: ${ack.error}`);
				}
				resolve();
			},
		);
	});
}

function cmdLeave(args: string[]): Promise<void> {
	return new Promise((resolve) => {
		if (!state.socket) {
			logLine("warn", "Connect first (login)");
			return resolve();
		}
		const [conversationId] = args;
		if (!conversationId) {
			logLine("warn", "Usage: leave <conversationId>");
			return resolve();
		}
		state.socket.emit(
			EVENTS.CONVERSATION_LEAVE,
			{ conversationId },
			(ack: SimpleAck) => {
				if (ack.ok) logLine("success", `Left -> ${conversationId}`);
				else logLine("error", `leave failed: ${ack.error}`);
				resolve();
			},
		);
	});
}

function cmdSend(args: string[]): Promise<void> {
	return new Promise((resolve) => {
		if (!state.socket) {
			logLine("warn", "Connect first (login)");
			return resolve();
		}
		const [conversationId, ...textParts] = args;
		const text = textParts.join(" ");
		if (!conversationId || !text) {
			logLine("warn", "Usage: send <conversationId> <text...>");
			return resolve();
		}
		state.socket.emit(
			EVENTS.MESSAGE_SEND,
			{ conversationId, text },
			(ack: SimpleAck) => {
				if (ack.ok) logLine("success", "Message sent");
				else logLine("error", `send failed: ${ack.error}`);
				resolve();
			},
		);
	});
}

function cmdWhoami(): void {
	if (!state.userId) {
		logLine("info", "Not logged in");
		return;
	}
	logLine(
		"info",
		`${state.email} (${state.userId}) — socket: ${state.socket?.id ?? "disconnected"}`,
	);
}

const COMMANDS: Record<string, (args: string[]) => void | Promise<void>> = {
	help: () => {
		for (const line of HELP) logLine("info", line);
	},
	register: cmdRegister,
	login: cmdLogin,
	connect: () => connectSocket(),
	create: cmdCreate,
	join: cmdJoin,
	leave: cmdLeave,
	send: cmdSend,
	whoami: cmdWhoami,
	clear: () => {
		logBox.setContent("");
		screen.render();
	},
	quit: () => process.exit(0),
	exit: () => process.exit(0),
};

async function handleCommand(rawLine: string): Promise<void> {
	if (!rawLine) return;
	logLine("input", `> ${rawLine}`);

	const [cmd, ...args] = resolveVars(rawLine).trim().split(/\s+/);
	const handler = COMMANDS[cmd.toLowerCase()];
	if (!handler) {
		logLine("warn", `Unknown command: ${cmd} (type "help")`);
		return;
	}
	setBusy(true);
	try {
		await handler(args);
	} catch (err) {
		logLine(
			"error",
			`Command failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	} finally {
		setBusy(false);
	}
}

// --- Wiring ---

// Historique (↑/↓). blessed ne fait rien de spécial avec ces touches sur un
// textbox (`ch` reste vide pour les flèches), donc pas de conflit avec la saisie.
const history: string[] = [];
let historyIndex = -1; // -1 = pas en train de naviguer
let draftBeforeHistory = "";

inputBox.key(["up"], () => {
	if (history.length === 0) return;
	if (historyIndex === -1) draftBeforeHistory = inputBox.getValue();
	historyIndex = Math.min(historyIndex + 1, history.length - 1);
	inputBox.setValue(history[history.length - 1 - historyIndex]);
	screen.render();
});

inputBox.key(["down"], () => {
	if (historyIndex === -1) return;
	historyIndex--;
	inputBox.setValue(
		historyIndex === -1
			? draftBeforeHistory
			: history[history.length - 1 - historyIndex],
	);
	screen.render();
});

// Complétion du nom de commande (Tab). Contrairement aux flèches, Tab a un `ch`
// ('\t') que le textbox interne accepte et append tel quel : on laisse ce
// comportement se produire puis on corrige au tick suivant (setImmediate),
// plutôt que de se battre avec l'ordre des listeners "keypress".
inputBox.key(["tab"], () => {
	setImmediate(() => {
		const current = inputBox.getValue().replace(/\t$/, "");
		if (current.includes(" ")) {
			inputBox.setValue(current);
			screen.render();
			return;
		}
		const matches = Object.keys(COMMANDS).filter((name) =>
			name.startsWith(current.toLowerCase()),
		);
		if (matches.length === 1) {
			inputBox.setValue(`${matches[0]} `);
		} else {
			inputBox.setValue(current);
			if (matches.length > 1)
				logLine("info", `Suggestions: ${matches.join(", ")}`);
		}
		screen.render();
	});
});

inputBox.on("submit", async (value: string) => {
	const trimmed = value.trim();
	if (trimmed && history[history.length - 1] !== trimmed) history.push(trimmed);
	historyIndex = -1;

	inputBox.clearValue();
	inputBox.focus();
	screen.render();
	await handleCommand(trimmed);
});

inputBox.key(["C-c"], () => process.exit(0));
screen.key(["C-c"], () => process.exit(0));

inputBox.focus();
renderStatus();
logLine("info", `Connected to ${API_URL}. Type "help" for the command list.`);
screen.render();
