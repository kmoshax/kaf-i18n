export const saveLocales = async (locales: LocaleData) => {
	return fetch('/api/save', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(locales),
	});
};

export const autoTranslate = async (
	text: string,
	targetLang: string,
	sourceLang: string,
) => {
	const res = await fetch('/api/translate', {
		/* TODO */
	});
	if (!res.ok) throw new Error('Translation failed');
	const { translation } = await res.json();
	return translation;
};
