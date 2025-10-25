import { canUndo, canRedo } from '../undo-manager';
import { Icon } from './icon';

interface HeaderProps {
	state: AppState;
	onSearch: (query: string) => void;
	onAddKey: () => void;
	onUndo: () => void;
	onRedo: () => void;
}

export const HeaderComponent = ({ state, onSearch, onAddKey, onUndo, onRedo}: HeaderProps) => {
	const { searchQuery, isSaving, baseLang } = state;

	return (
		<header class="navbar bg-base-100 p-0">
			<div class="navbar-start">
				<h1 class="text-2xl font-bold">kaf-i18n</h1>
				<div class="badge badge-outline ml-4">Base: {baseLang}</div>
			</div>
			<div class="navbar-center">
				<div class="form-control">
					<input
						type="search"
						placeholder="Search keys..."
						class="input input-bordered w-64"
						value={searchQuery}
						onInput={(e) => onSearch((e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
			<div class="navbar-end gap-2">
				<div class="flex items-center gap-2 mr-4">
					<div class={`badge ${isSaving ? 'badge-warning' : 'badge-success'}`}>
						{isSaving ? 'Saving...' : 'Saved'}
					</div>
				</div>
				<button
					type="button"
					class="btn btn-ghost"
					onClick={onUndo}
					disabled={!canUndo()}
					title="Undo"
				>
					<Icon name="undo-2" />
				</button>
				<button
					type="button"
					class="btn btn-ghost"
					onClick={onRedo}
					disabled={!canRedo()}
					title="Redo"
				>
					<Icon name="redo-2" />
				</button>
				<button type="button" class="btn btn-primary" onClick={onAddKey}>
					Add Key
				</button>
			</div>
		</header>
	);
};
