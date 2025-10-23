import pc from 'picocolors';

const LEVELS = {
	SUCCESS: { icon: '✅', color: pc.green },
	INFO: { icon: 'ℹ️', color: pc.blue },
	WARN: { icon: '⚠️', color: pc.yellow },
	ERROR: { icon: '❌', color: pc.red },
	DEBUG: { icon: '🐞', color: pc.magenta },
} as const;

export class Logger {
	constructor(
		private readonly defaultPrefix = 'kaf-i18n',
		private readonly bound?: LogOptions,
	) {}

	private timeStamp(): string {
		const d = new Date();
		const hh = String(d.getHours()).padStart(2, '0');
		const mm = String(d.getMinutes()).padStart(2, '0');
		const ss = String(d.getSeconds()).padStart(2, '0');
		return pc.gray(`[${hh}:${mm}:${ss}]`);
	}

	private safeStringify(v: unknown) {
		try {
			if (typeof v === 'string') return v;
			if (typeof v === 'object' && v !== null) return JSON.stringify(v);
			return String(v);
		} catch {
			try {
				return String(v);
			} catch {
				return '[unserializable]';
			}
		}
	}

	private shouldLogDebug(): boolean {
		const bunHasDebug =
			typeof Bun !== 'undefined' && Boolean((Bun as any).env?.DEBUG);
		return Boolean(process.env.DEBUG) || bunHasDebug;
	}

	private mergedOptions(callOpts?: LogOptions): LogOptions {
		return { ...(this.bound ?? {}), ...(callOpts ?? {}) };
	}

	private output(level: LogLevel, opts: LogOptions, ...args: unknown[]) {
		if (level === LEVELS.DEBUG && !this.shouldLogDebug()) return;
		const merged = this.mergedOptions(opts);
		const prefix =
			merged.prefix === undefined ? this.defaultPrefix : merged.prefix;
		const prefixStr = prefix ? `[${prefix.toUpperCase()}] ` : '';
		const icon = merged.icon ?? level.icon;
		const msg = args.map((a) => this.safeStringify(a)).join(' ');
		console.log(
			`${this.timeStamp()} [${icon}] ${level.color(prefixStr + msg)}`,
		);
	}

	public info = (m: unknown, o?: LogOptions) =>
		this.output(LEVELS.INFO, o ?? {}, m);
	public success = (m: unknown, o?: LogOptions) =>
		this.output(LEVELS.SUCCESS, o ?? {}, m);
	public warn = (m: unknown, o?: LogOptions) =>
		this.output(LEVELS.WARN, o ?? {}, m);
	public error = (m: unknown, o?: LogOptions) =>
		this.output(LEVELS.ERROR, o ?? {}, m);
	public debug = (m: unknown, o?: LogOptions) =>
		this.output(LEVELS.DEBUG, o ?? {}, m);

	public child(options: LogOptions) {
		const merged = { ...(this.bound ?? {}), ...(options ?? {}) };
		return new Logger(this.defaultPrefix, merged);
	}
}

export const logger = new Logger();
