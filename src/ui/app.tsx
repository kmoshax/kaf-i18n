interface AppProps {
	initialData: { locales: LocaleData; baseLang: string };
}

export const App = ({ initialData }: AppProps) => {
	return (
		<>
			<div id="header-container" class="container mx-auto py-4" />
			<main id="main-content" class="container mx-auto" />
			<div id="modal-container" />
			<script id="initial-data" type="application/json">
				{JSON.stringify(initialData)}
			</script>
		</>
	);
};