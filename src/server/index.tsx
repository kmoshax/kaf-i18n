import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { loadLocales } from '@/core/locales';
import { logger } from '@/core/logger';
import { App } from '@/ui/app';
import { renderer } from '@/ui/renderer';
import { saveLocalesHandler, translateHandler } from './handlers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicRoot = path.join(__dirname, '..', 'public');

export const startServer = async (
	path: string,
	baseLang: string,
	port: number,
) => {
	const app = new Hono();

	let localesData: LocaleData = await loadLocales(path);

	app.use(renderer);

	app.use(
		'/public/*',
		serveStatic({
			root: publicRoot,
			rewriteRequestPath: (p) => p.replace(/^\/public/, ''),
		}),
	);

	app.get('/', (c) => {
		const initialData = { locales: localesData, baseLang: baseLang };

		return c.render(<App initialData={initialData} />);
	});

	const api = new Hono();
	api.post('/save', saveLocalesHandler);
	api.post('/translate', translateHandler);
	app.route('/api', api);

	
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
