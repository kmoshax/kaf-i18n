import { $ } from 'bun';
import { logger } from '@/core/logger';

const log = logger.child({ prefix: 'build' });

log.info('cleaning up old build...', { icon: '🧹' });

await $`rm -rf dist`.catch(() =>
	log.warn('can not remove old build files..', {
		icon: '⚠️',
		prefix: 'build',
	}),
);

log.warn('building package ...', { icon: '📦' });

const result = await Bun.build({
	entrypoints: ['./src/index.ts', './src/cli.ts'],
	outdir: './dist',
	target: 'bun',
	splitting: true,
	minify: true,
});

if (!result.success) {
	log.error('building failed', { icon: '❌' });

	for (const message of result.logs) log.error(message);

	process.exit(1);
}

log.success('build successful!', { icon: '✅' });
