#!/usr/bin/env bun

import cac from 'cac';
import { logger } from '@/core/logger';

const cli = cac('kaf-i18n');

cli
	.command('[...args]', 'start i18n web ui editor')
	.option('-p, --port <port>', 'port to run the server on', { default: 2007 })
	.action(async (args, options) => {
		logger.success('[kaf-i18n] 🚀 starting... ');
	});

cli.help();
cli.version('1.0.0');
cli.parse();