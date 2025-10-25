import { logger } from '@/core/logger';
import { initializeState, subscribe } from './state';

const initialDataEl = document.getElementById('initial-data');
const initialData: InitialPayload = JSON.parse(
	initialDataEl?.textContent || '{}',
);

initializeState(initialData);

subscribe((state) => {
	logger.debug('State changed, re-rendering...');
	// Render functions will go here
});
