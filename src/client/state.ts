const listeners: StateListener[] = [];

let state: AppState = {
	locales: {},
	searchQuery: '',
	isSaving: false,
	baseLang: 'en',
};

export const initializeState = (initialData: { locales: LocaleData; baseLang: string}) => {
	state = {
		...state,
		locales: initialData.locales,
		baseLang: initialData.baseLang,
	};
	
	notify();
}

export const subscribe = (listener: StateListener) => listeners.push(listener);

export const notify = () => listeners.forEach((listener) => { listener(state); });

export const getState = () => state;

export const updateState = (updates: Partial<AppState>) => {
	state = { ...state, ...updates };
	notify();
}
