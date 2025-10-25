import { jsx, render } from 'hono/jsx/dom';

const modalContainer = document.getElementById('modal-container');

const AddKeyModalComponent = ({
	onAdd,
	onCancel,
}: {
	onAdd: (key: string) => void;
	onCancel: () => void;
}) => {
	const handleSubmit = (e: Event) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const key = formData.get('key') as string;
		onAdd(key.trim());
	};

	return (
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Add New Translation Key</h3>
				<form onSubmit={handleSubmit}>
					<div class="form-control py-4">
						<label class="label" for="key">
							<span class="label-text">Key Name</span>
						</label>
						<input
							type="text"
							placeholder="e.g. user.profile.title"
							class="input input-bordered w-full"
							name="key"
							required
						/>
					</div>
					<div class="modal-action">
						<button type="button" class="btn btn-ghost" onClick={onCancel}>
							Cancel
						</button>
						<button type="submit" class="btn btn-primary">
							Add Key
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const hideAddKeyModal = () => {
	render(null, modalContainer as HTMLElement);
}

export const showAddKeyModal = (onAdd: (key: string) => void) => {
	const handleAdd = (key: string) => {
		hideAddKeyModal();
		onAdd(key);
	};

	render(
		<AddKeyModalComponent onAdd={handleAdd} onCancel={hideAddKeyModal} />,
		modalContainer as HTMLElement,
	);
}

