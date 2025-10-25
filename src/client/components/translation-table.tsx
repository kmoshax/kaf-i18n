import { Icon } from './icon';

interface TableProps {
	state: AppState;
	onValueChange: (key: string, lang: string, value: string) => void;
	onDeleteKey: (key: string) => void;
	onAutoTranslate: (key: string, lang: string) => void;
}

export const TranslationTable = ({ state, onValueChange, onDeleteKey, onAutoTranslate}: TableProps) => {
	const { locales, searchQuery, baseLang } = state;
	const languages = Object.keys(locales);
	const keys = Object.keys(locales[baseLang] || {}).sort();
	const filteredKeys = searchQuery
		? keys.filter((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
		: keys;

	return (
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Key</th>
						{languages.map((lang) => (
							<th>{lang}</th>
						))}
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredKeys.map((key) => (
						<tr key={key}>
							<td class="font-mono text-sm">{key}</td>
							{languages.map((lang) => (
								<td key={lang}>
									<div class="flex items-start gap-1">
										<textarea
											class="textarea textarea-bordered w-full"
											onInput={(e) =>
												onValueChange(
													key,
													lang,
													(e.target as HTMLTextAreaElement).value,
												)
											}
										>
											{locales[lang]?.[key] || ''}
										</textarea>
										{lang !== baseLang && (
											<button
                                                type='button'
												class="btn btn-sm btn-ghost"
												title={`Auto-translate from ${baseLang}`}
												onClick={() => onAutoTranslate(key, lang)}
											>
												<Icon name="sparkles" />
											</button>
										)}
									</div>
								</td>
							))}
							<td class="text-right">
								<button
                                    type='button'
									class="btn btn-sm btn-ghost text-error"
									title="Delete key"
									onClick={() => onDeleteKey(key)}
								>
									<Icon name="trash-2" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
