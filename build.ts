import { $ } from 'bun';
import { logger } from '@/core/logger';

const log = logger.child({ prefix: 'build' });

log.info('cleaning up old build...', { icon: '🧹' });

await $`rm -rf dist`.catch(() =>
	log.warn('can not remove old build files..', { icon: '⚠️' }),
);

log.warn('building package ...', { icon: '📦' });

const cliResult = await Bun.build({
	entrypoints: ['./src/cli.ts'],
	outdir: './dist',
	target: 'node',
	splitting: true,
	minify: true,
});

const clientResult = await Bun.build({
	entrypoints: ['./src/client/main.tsx'],
	outdir: './dist',
	target: 'browser',
	splitting: true,
	minify: true,
});

if (!cliResult.success || !clientResult.success) {
	log.error('building failed', { icon: '❌' });

	for (const message of [...cliResult.logs, ...clientResult.logs]) log.error(message);

	process.exit(1);
}

await $`mv dist/main.js public/js/client.bundle.js`;

log.success('build successful!', { icon: '✅' });
