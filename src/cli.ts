#!/usr/bin/env bun

import cac from 'cac';
import { logger } from '@/core/logger';
import server from '@/server';

const cli = cac('kaf-i18n');

cli
	.command('[...args]', 'start i18n web ui editor')
	.option('-p, --port <port>', 'port to run the server on', { default: 2007 })
	.action(async (_args, options) => {
		logger.success('🚀 starting... ');

		Bun.serve({
			development: process.env.NODE_ENV === 'development',
			port: options.port,
			fetch: server.fetch,
		});

		logger.success(`Web UI is running at http://localhost:${options.port}`, {
			icon: '🎉',
		});
	});

cli.help();
cli.version('1.0.0');
cli.parse();
