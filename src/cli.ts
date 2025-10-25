#!/usr/bin/env bun

import { existsSync } from 'node:fs';

import cac from 'cac';
import prompts from 'prompts';

import { readConfig, writeConfig } from '@/core/config';
import { findLocalesPath } from '@/core/locales';
import { logger } from '@/core/logger';
import { startServer } from './server';

const cli = cac('kaf-i18n');

cli
	.command('[...args]', 'start i18n web ui editor')
	.option('-p, --port <port>', 'port to run the server on', { default: 2007 })
	.action(async (_args, options) => {
		logger.success('starting... ', { icon: '🚀' });

		let config = await readConfig();
		let localesPath = config?.baseLang;

		if (!localesPath) {
			localesPath = (await findLocalesPath()) || undefined;

			if (localesPath) {
				logger.success(
					`Auto-detected locales directory at: ./${localesPath.split('/').pop()}`,
					{ icon: '📂' },
				);

				const updatedConfig = { ...config, localesPath };
				await writeConfig(updatedConfig);
				config = updatedConfig;
			} else {
				const { path } = await prompts({
					type: 'text',
					name: 'path',
					message: 'Could not find a locales directory. Please enter the path:',
					initial: 'locales',
				});

				if (!path || !existsSync(path)) {
					logger.error('Invalid path. Exiting.');
				}

				const updatedConfig = { ...config, localesPath: path };
				await writeConfig(updatedConfig);
				config = updatedConfig;
			}
		}

		logger.success(`Serving translations from: ${localesPath}`, { icon: '📂' });
		startServer(localesPath as string, 'en', options.port);
	});

cli.help();
cli.version('1.0.0');
cli.parse();
