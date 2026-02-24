// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
// import rehypeHighlight from 'rehype-highlight';
// import rehypeAddClasses from 'rehype-add-classes';
import remarkGfm from 'remark-gfm';
import vayloadDarkShiki from '@shiki/theme-vayload';

export default defineConfig({
	site: 'https://plugins.vayload.dev',
	output: 'static',
	integrations: [react(), mdx()],
	vite: {
		plugins: [tailwindcss()],
		server: {
			port: 8060,
			strictPort: true,
			allowedHosts: ['plugins.vayload.me'],
			hmr: {
				protocol: 'ws',
				host: 'localhost',
				port: 8060,
				path: 'vite',
			},
		},
	},
	devToolbar: {
		enabled: false,
	},
	server: {
		port: 8060,
	},
	markdown: {
		shikiConfig: {
			// @ts-ignore
			theme: vayloadDarkShiki,
		},
		remarkPlugins: [remarkGfm],
	},
});
