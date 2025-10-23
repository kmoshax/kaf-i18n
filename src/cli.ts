#!/usr/bin/env bun

import cac from 'cac';

const cli = cac('kaf-i18n');

cli
	.command('[...args]', 'start i18n web ui editor')
	.option('-p, --port <port>', 'port to run the server on', { default: 2007 })
	.action(async (args, options) => {
        console.log('[kaf-i18n] 🚀 starting... ')
    });
