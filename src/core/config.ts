import fs from 'node:fs/promises';
import path from 'node:path';

const CONFIG_FILE = '.kaf-i18n.json';

export const readConfig = async (): Promise<Config | null> => {
	const configPath = path.join(process.cwd(), CONFIG_FILE);
	const content = await fs.readFile(configPath, 'utf-8');

	return JSON.parse(content);
};

export const writeConfig = async (config: Config) => {
	const configPath = path.join(process.cwd(), CONFIG_FILE);

	await fs.writeFile(configPath, JSON.stringify(config, null, 2));
};
