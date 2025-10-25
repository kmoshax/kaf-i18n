import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { logger } from '@/core/logger';

export const commonPaths = ['locales', 'src/locales', 'public/locales'];

export const isDirectory = async (path: string): Promise<boolean> => {
	try {
		const stat = await fs.stat(path);
		return stat.isDirectory();
	} catch {
		return false;
	}
};

export const findLocalesPath = async (): Promise<string | null> => {
	for (const pathName of commonPaths) {
		const fullPath = path.join(process.cwd(), pathName);

		if (existsSync(fullPath) && (await isDirectory(fullPath))) return fullPath;
	}

	return null;
};

export const loadLocales = async (localesPath: string): Promise<LocaleData> => {
	const files = await fs.readdir(localesPath);

	const data: LocaleData = {};

	for (const file of files) {
		if (file.endsWith('.json')) {
			const lang = path.basename(file);
			const filePath = path.join(localesPath, file);

			try {
				const content = await fs.readFile(filePath, 'utf-8');

				data[lang] = JSON.parse(content);
			} catch (error) {
				logger.error(`error parsing ${filePath}: ${error}`, { icon: '❌' });
			}
		}
	}

    return data;
};
