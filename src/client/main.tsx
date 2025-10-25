import { render } from 'hono/jsx/dom';
import { HeaderComponent } from './components/header';
import { initializeState, subscribe, updateState } from './state';
import { redo, undo } from './undo-manager';

const initialDataEl = document.getElementById('initial-data');
const initialData: InitialPayload = JSON.parse(
	initialDataEl?.textContent || '{}',
);

initializeState(initialData);

const headerContainer = document.getElementById('header-container');

subscribe((state) => {
	render(
		<HeaderComponent
			state={state}
			onSearch={(query) => updateState({ searchQuery: query })}
			onAddKey={() => {
				/* TODO */
			}}
			onUndo={undo}
			onRedo={redo}
		/>,
		headerContainer as HTMLElement,
	);
});
