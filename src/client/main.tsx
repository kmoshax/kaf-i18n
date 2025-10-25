import { render } from 'hono/jsx/dom';

import { autoTranslate, saveLocales } from './api';
import { showAddKeyModal } from './components/add-key-modal';
import { HeaderComponent } from './components/header';
import { TranslationTable } from './components/translation-table';
import { getState, initializeState, subscribe, updateState } from './state';

import { pushToUndoStack, redo, undo } from './undo-manager';

let saveTimeout: number | null = null;

const initialDataEl = document.getElementById('initial-data');
const initialData: InitialPayload = JSON.parse(
	initialDataEl?.textContent.replace(/&quot;/gi, '"') || '{}',
);

initializeState(initialData);

const headerContainer = document.getElementById('header-container');
const mainContentContainer = document.getElementById('main-content');

const handleAddKey = (newKey: string) => {
	const { locales, baseLang } = getState();
	if (newKey && !locales[baseLang]?.[newKey]) {
		pushToUndoStack(locales);
		const newLocales = JSON.parse(JSON.stringify(locales));
		Object.keys(newLocales).forEach((lang) => {
			newLocales[lang][newKey] = '';
		});
		updateState({ locales: newLocales });
	} else if (newKey) {
		alert('Key already exists.');
	}
};

const handleValueChange = (key: string, lang: string, value: string) => {
	const currentLocales = getState().locales;

	if (currentLocales[lang]?.[key] !== value) {
		pushToUndoStack(currentLocales);
		const newLocales = JSON.parse(JSON.stringify(currentLocales));
		newLocales[lang][key] = value;
		updateState({ locales: newLocales });
	}
};

const handleAutoTranslate = async (key: string, lang: string) => {
	const { locales, baseLang } = getState();

	const baseLangLocales = locales[baseLang as string];
	if (!baseLangLocales || !baseLangLocales[key]) {
		return alert('Base language text is empty.');
	}
	const textToTranslate = baseLangLocales[key];
	try {
		const translation = await autoTranslate(textToTranslate, lang, baseLang);
		// ... update state with the new translation
	} catch (_e) {
		alert('Translation failed.');
	}
};

subscribe((state) => {
	render(
		<HeaderComponent
			state={state}
			onSearch={(query) => updateState({ searchQuery: query })}
			onAddKey={() => showAddKeyModal(handleAddKey)}
			onUndo={undo}
			onRedo={redo}
		/>,
		headerContainer as HTMLElement,
	);

	render(
		<TranslationTable
			state={state}
			onValueChange={handleValueChange}
			onDeleteKey={() => {
				/* TODO */
			}}
			onAutoTranslate={handleAutoTranslate}
		/>,
		mainContentContainer as HTMLElement,
	);

	if (saveTimeout) clearTimeout(saveTimeout);
	updateState({ isSaving: true });
	saveTimeout = window.setTimeout(async () => {
		await saveLocales(state.locales);
		updateState({ isSaving: false });
	}, 1000);
});
