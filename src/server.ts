import { Hono } from 'hono';

const server = new Hono();

server.get('/', (c) => c.text('hello from kaf-i18n'));

export default {
	fetch: server.fetch,
};
