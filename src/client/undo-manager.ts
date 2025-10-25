import { getState, updateState } from "./state";

let undoStack: LocaleData[] = [];
let redoStack: LocaleData[] = [];

export function pushToUndoStack(locales: LocaleData) {
	undoStack.push(JSON.parse(JSON.stringify(locales)));
	redoStack = [];
	if (undoStack.length > 50) undoStack.shift();
}

export function undo() {
	if (undoStack.length > 0) {
		const prevState = undoStack.pop();
		redoStack.push(JSON.parse(JSON.stringify(getState().locales)));
		updateState({ locales: prevState });
	}
}

export function redo() {
	if (redoStack.length > 0) {
		const nextState = redoStack.pop();
		undoStack.push(JSON.parse(JSON.stringify(getState().locales)));
		updateState({ locales: nextState });
	}
}

export const canUndo = () => undoStack.length > 0;
export const canRedo = () => redoStack.length > 0;
