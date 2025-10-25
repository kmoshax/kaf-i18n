import { jsxRenderer } from 'hono/jsx-renderer';

export const renderer = jsxRenderer(({ children }) => (
	<html lang="en" data-theme="dark">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>kaf-i18n editor</title>
			
			<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js" defer />
			<link href="/public/styles.css" rel="stylesheet" />
			<script src="/public/js/client.bundle.js" defer />
		</head>

		<body>
			<div id="root">{children}</div>
		</body>
	</html>
));
