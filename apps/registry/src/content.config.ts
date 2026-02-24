import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

export const collections = {
	docs: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			published: z.boolean().default(true),
			order: z.number().default(0),
			tags: z.array(z.string()).optional(),
		}),
	}),
};
