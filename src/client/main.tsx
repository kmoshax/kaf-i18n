import { render } from 'hono/jsx/dom';

import { showAddKeyModal } from './components/add-key-modal';
import { HeaderComponent } from './components/header';
import { TranslationTable } from './components/translation-table';
import { getState, initializeState, subscribe, updateState } from './state';

import { pushToUndoStack, redo, undo } from './undo-manager';

const initialDataEl = document.getElementById('initial-data');
const initialData: InitialPayload = JSON.parse(
	initialDataEl?.textContent || '{}',
);

initializeState(initialData);

const headerContainer = document.getElementById('header-container');
const mainContentContainer = document.getElementById('main-content');

const handleAddKey = (newKey: string) => {
  const { locales, baseLang } = getState();
  if (newKey && !locales[baseLang]?.[newKey]) {
    pushToUndoStack(locales);
    const newLocales = JSON.parse(JSON.stringify(locales));
    Object.keys(newLocales).forEach(lang => {
      newLocales[lang][newKey] = '';
    });
    updateState({ locales: newLocales });
  } else if (newKey) { alert('Key already exists.'); }
}

const handleValueChange = (key: string, lang: string, value: string) => {
  const currentLocales = getState().locales;

  if (currentLocales[lang]?.[key] !== value) {
    pushToUndoStack(currentLocales);
    const newLocales = JSON.parse(JSON.stringify(currentLocales));
    newLocales[lang][key] = value;
    updateState({ locales: newLocales });
  }
}

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
      onDeleteKey={() => { /* TODO */ }}
      onAutoTranslate={() => { /* TODO */ }}
    />, 
    mainContentContainer as HTMLElement
  );
});
