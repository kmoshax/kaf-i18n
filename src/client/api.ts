export async function saveLocales(locales: LocaleData) {
	return fetch('/api/save', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(locales),
	});
}
