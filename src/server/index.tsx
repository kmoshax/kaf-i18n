import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { logger } from '@/core/logger';
import { renderer } from '@/ui/renderer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicRoot = path.join(__dirname, '..', 'public');

export const startServer = async (
	path: string,
	baseLang: string,
	port: number,
) => {
	const app = new Hono();

	app.use(
		'/public/*',
		serveStatic({
			root: publicRoot,
			rewriteRequestPath: (p) => p.replace(/^\/public/, ''),
		}),
	);

	app.use(renderer);

	app.get('/', (c) =>
		c.render(
			<>
				<p>Hiii</p>
				<button type="button" className="btn">
					Default
				</button>
				<button type="button" className="btn btn-primary">
					Primary
				</button>
			</>,
		),
	);

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
