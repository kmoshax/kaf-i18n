/** biome-ignore-all lint/correctness/noUnusedVariables: this is global types */

type StateListener = (state: AppState) => void;

interface AppState {
	locales: LocaleData;
	searchQuery: string;
	isSaving: boolean;
	baseLang: string;
}