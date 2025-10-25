import type { Context } from 'hono';
import { generateTypes, saveLocales } from '@/core/locales';

export const saveLocalesHandler = async (c: Context) => {
	const updatedLocales = await c.req.json<LocaleData>();
	const localesPath = c.get('localesPath');

	await saveLocales(localesPath, updatedLocales);
	await generateTypes(localesPath, updatedLocales);

	return c.json({ success: true });
};

export const translateHandler = async (c: Context) => {
	const { text, targetLang, sourceLang } = await c.req.json();

	try {
		// TODO: TRANSLATION FUNCTION
		return c.json({ translation: null });
	} catch (error) {
		return c.json({ error: `Translation failed: ${error}` }, 500);
	}
};
