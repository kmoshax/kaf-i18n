/** biome-ignore-all lint/correctness/noUnusedVariables: this is global types */
type LogLevel = {
	icon: string;
	color: (str: string | number) => string;
};

type LogLevelKey = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'DEBUG';

type LogOptions = {
	icon?: string;
	prefix?: string;
};
