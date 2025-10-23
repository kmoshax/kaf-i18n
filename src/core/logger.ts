import pc from 'picocolors';

const levels = {
	SUCCESS: { icon: '✅', color: pc.green },
	INFO: { icon: 'ℹ️', color: pc.blue },
	WARN: { icon: '⚠️', color: pc.yellow },
	ERROR: { icon: '❌', color: pc.red },
	DEBUG: { icon: '🐞', color: pc.magenta },
} as const;

type LevelKey = keyof typeof levels;

class Logger {
	constructor(private defaults: LogOptions = {}) {}

	private getTimestamp(): string {
		const now = new Date();
		const hh = String(now.getHours()).padStart(2, '0');
		const mm = String(now.getMinutes()).padStart(2, '0');
		const ss = String(now.getSeconds()).padStart(2, '0');
		return pc.gray(`[${hh}:${mm}:${ss}]`);
	}

	private stringifyArg(arg: unknown) {
		if (typeof arg === 'object') return JSON.stringify(arg);
		return String(arg);
	}

	private formatMessage(options: LogOptions, args: unknown[]) {
		const icon = options.icon ?? '';
		const prefix = options.prefix ? `[${options.prefix.toUpperCase()}] ` : '';
		const message = args.map((a) => this.stringifyArg(a)).join(' ');
		return { icon, text: `${prefix}${message}` };
	}

	private shouldLogDebug(): boolean {
		const bunDebug = typeof Bun !== 'undefined' && Boolean(Bun.env?.DEBUG);
		return Boolean(process.env.DEBUG) || bunDebug;
	}

	private log(level: LogLevel, options: LogOptions = {}, ...args: unknown[]) {
		const { text } = this.formatMessage(options, args);
		console.log(
			`${this.getTimestamp()} [${options.icon ?? level.icon}] ${level.color(text)}`,
		);
	}

	private isLogOptions(obj: unknown): obj is LogOptions {
		return (
			typeof obj === 'object' &&
			obj !== null &&
			('icon' in obj || 'prefix' in obj)
		);
	}

	private makeMethod(levelKey: LevelKey, conditional?: () => boolean) {
		const level = levels[levelKey];
		return (message: unknown, opts?: LogOptions) => {
			if (conditional && !conditional()) return;
			const options = opts && this.isLogOptions(opts) ? opts : {};
			this.log(level, options, message);
		};
	}

	private buildOpts(local?: LogOptions) {
		return { ...this.defaults, ...(local ?? {}) } as LogOptions;
	}

	public child(opts: LogOptions) {
		return new Logger(this.buildOpts(opts));
	}

	// public methods
	info = this.makeMethod('INFO');
	success = this.makeMethod('SUCCESS');
	warn = this.makeMethod('WARN');
	error = this.makeMethod('ERROR');
	debug = this.makeMethod('DEBUG', () => this.shouldLogDebug());
}

export const logger = new Logger();
