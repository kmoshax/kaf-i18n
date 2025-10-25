import { render } from 'hono/jsx/dom';

import { HeaderComponent } from './components/header';
import { TranslationTable } from './components/translation-table';
import { initializeState, subscribe, updateState } from './state';

import { redo, undo } from './undo-manager';

const initialDataEl = document.getElementById('initial-data');
const initialData: InitialPayload = JSON.parse(
	initialDataEl?.textContent || '{}',
);

initializeState(initialData);

const headerContainer = document.getElementById('header-container');
const mainContentContainer = document.getElementById('main-content');

subscribe((state) => {
	render(
		<HeaderComponent
			state={state}
			onSearch={(query) => updateState({ searchQuery: query })}
			onAddKey={() => {/* TODO */ }}
			onUndo={undo}
			onRedo={redo}
		/>,
		headerContainer as HTMLElement,
	);

    render(
    <TranslationTable
      state={state}
      onValueChange={() => { /* TODO */ }}
      onDeleteKey={() => { /* TODO */ }}
      onAutoTranslate={() => { /* TODO */ }}
    />, 
    mainContentContainer as HTMLElement
  );
});
