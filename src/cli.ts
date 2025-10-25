#!/usr/bin/env bun

import { existsSync } from 'node:fs';

import cac from 'cac';
import prompts from 'prompts';

import { readConfig, writeConfig } from '@/core/config';
import { findLocalesPath, loadLocales } from '@/core/locales';
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

		if (!localesPath || !existsSync(localesPath)) {
			localesPath = (await findLocalesPath()) || undefined;

			if (localesPath) {
				logger.success(
					`Auto-detected locales directory at: ./${localesPath.split('/').pop()}`,
					{ icon: '📂' },
				);

				config = { ...config, localesPath };
				await writeConfig(config);
			} else {
				const { path } = await prompts({
					type: 'text',
					name: 'path',
					message: 'Could not find a locales directory. Please enter the path:',
					initial: 'locales',
				});

				if (!path || !existsSync(path)) {
					logger.error('Invalid path. Exiting.');
					process.exit(1);
				}

				config = { ...config, localesPath: path };
				await writeConfig(config);
			}
		}

		logger.success(`Serving translations from: ${localesPath}`, { icon: '📂' });

		let baseLang = config?.baseLang;
		if (!baseLang) {
			logger.info(
				'Base language not configured, attempting to auto-detect...',
				{ icon: '🔎' },
			);

			const localesData = await loadLocales(localesPath as string);
			const availableLangs = Object.keys(localesData).sort();

			if (availableLangs.length > 0) {
				baseLang = availableLangs.includes('en') ? 'en' : availableLangs[0];
				logger.success(`Auto-detected "${baseLang}" as the base language.`);
			} else {
				baseLang = 'en';
				logger.warn(`No locale files found. Defaulting base language to "en".`);
			}

			config = { ...config, localesPath: localesPath as string, baseLang };
			await writeConfig(config);
			logger.success(`Configuration saved to .kaf-i18nrc.json`, { icon: '💾' });
		}

		startServer(localesPath as string, baseLang as string, options.port);
	});

cli.help();
cli.version('1.0.0');
cli.parse();
