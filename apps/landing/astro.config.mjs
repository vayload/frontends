// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import vayloadDarkShiki from '@shiki/theme-vayload';

export default defineConfig({
	site: 'https://vayload.dev',
	integrations: [mdx()],
	vite: {
		plugins: [tailwindcss()],
		server: {
			port: 8050,
			strictPort: true,
			allowedHosts: ['vayload.me'],
			hmr: {
				protocol: 'ws',
				host: 'localhost',
				port: 8050,
				path: 'vite',
			},
		},
	},
	devToolbar: {
		enabled: false,
	},
	server: {
		port: 8050,
	},
	markdown: {
		shikiConfig: {
			// @ts-ignore
			theme: vayloadDarkShiki,
		},
		remarkPlugins: [remarkGfm],
	},
});
