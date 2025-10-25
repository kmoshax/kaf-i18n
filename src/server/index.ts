import { Hono } from 'hono';
import { logger } from '@/core/logger';

export const startServer = async (
	path: string,
	baseLang: string,
	port: number,
) => {
	const app = new Hono();

	app.get('/', (c) => c.text('Hello from Kaf-i18n!'));

	Bun.serve({
		development: process.env.NODE_ENV === 'development',
		port: port,
		fetch: app.fetch,
	});

	logger.success(
		`Web UI is running at http://localhost:${port} in ${process.env.NODE_ENV} mode`,
		{ icon: '🎉' },
	);
};
