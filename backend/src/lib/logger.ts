// Petit logger coloré (chalk) au-dessus de console.*
// Utilisez createLogger("scope") plutôt que console.log/warn/error directement,
// pour garder des logs homogènes et identifier facilement leur origine.
import path from "node:path";
import chalk from "chalk";

const LEVELS = ["debug", "info", "success", "warn", "error"] as const;
export type LogLevel = (typeof LEVELS)[number];

const isDev = process.env.MODE !== "RELEASE";

const LEVEL_STYLES: Record<LogLevel, chalk.Chalk> = {
	debug: chalk.gray,
	info: chalk.cyan,
	success: chalk.green,
	warn: chalk.yellow,
	error: chalk.red,
};

const LEVEL_LABELS: Record<LogLevel, string> = {
	debug: "DEBUG",
	info: "INFO",
	success: " OK ",
	warn: "WARN",
	error: "ERROR",
};

const CONSOLE_METHOD: Record<LogLevel, "log" | "warn" | "error"> = {
	debug: "log",
	info: "log",
	success: "log",
	warn: "warn",
	error: "error",
};

export interface Logger {
	debug(message: string, ...meta: unknown[]): void;
	info(message: string, ...meta: unknown[]): void;
	success(message: string, ...meta: unknown[]): void;
	warn(message: string, ...meta: unknown[]): void;
	error(message: string, ...meta: unknown[]): void;
}

// --- Groupes imbriqués (façon console.group/groupEnd, mais avec des branches "│") ---

const GROUP_BRANCH = "│    ";
// Une couleur par niveau de profondeur, cyclique (le niveau N réutilise la couleur N % length).
const BRANCH_COLORS: readonly chalk.Chalk[] = [
	chalk.cyan,
	chalk.magenta,
	chalk.yellow,
	chalk.green,
	chalk.blue,
	chalk.redBright,
];
let groupDepth = 0;

function colorFor(level: number): chalk.Chalk {
	return BRANCH_COLORS[level % BRANCH_COLORS.length];
}

function indent(depth: number): string {
	let out = "";
	for (let level = 0; level < depth; level++) {
		out += colorFor(level)(GROUP_BRANCH);
	}
	return out;
}

/** Ouvre un groupe : imprime le titre au niveau courant, puis indente les logs suivants. */
export function group(title: string): void {
	console.log(`${indent(groupDepth)}${colorFor(groupDepth).bold(title)}`);
	groupDepth++;
}

/** Ferme le groupe le plus récent. */
export function groupEnd(): void {
	groupDepth = Math.max(0, groupDepth - 1);
}

// --- Localisation de fonctions (pour l'affichage "name -> file(line, col)") ---

const locations = new WeakMap<(...args: never[]) => unknown, string>();

/**
 * À appeler au niveau module, juste à côté de la déclaration d'une fonction,
 * pour mémoriser où elle est définie. `entry()` va ensuite pouvoir l'afficher.
 */
export function locate<T extends (...args: never[]) => unknown>(fn: T): T {
	const callSite = new Error().stack?.split("\n")[2] ?? "";
	const match =
		callSite.match(/\((.+):(\d+):(\d+)\)$/) ??
		callSite.match(/at (.+):(\d+):(\d+)$/);
	if (match) {
		const [, file, line, column] = match;
		locations.set(
			fn,
			`${path.relative(process.cwd(), file)}(${line}, ${column})`,
		);
	}
	return fn;
}

/** Affiche une entrée de registre ("name -> file(line, col)") au niveau du groupe courant. */
export function entry(name: string, fn: (...args: never[]) => unknown): void {
	const location = locations.get(fn) ?? "unknown location";
	console.log(
		`${indent(groupDepth)}${colorFor(groupDepth)(name)} ${chalk.dim("->")} ${chalk.dim(location)}`,
	);
}

function write(
	level: LogLevel,
	scope: string,
	message: string,
	meta: unknown[],
): void {
	if (level === "debug" && !isDev) return;

	const style = LEVEL_STYLES[level];
	const prefix = `${indent(groupDepth)}${style.bold(LEVEL_LABELS[level])} ${chalk.dim(`[${scope}]`)}`;
	console[CONSOLE_METHOD[level]](prefix, message, ...meta);
}

export function createLogger(scope: string): Logger {
	return {
		debug: (message, ...meta) => write("debug", scope, message, meta),
		info: (message, ...meta) => write("info", scope, message, meta),
		success: (message, ...meta) => write("success", scope, message, meta),
		warn: (message, ...meta) => write("warn", scope, message, meta),
		error: (message, ...meta) => write("error", scope, message, meta),
	};
}

export default createLogger("app");
