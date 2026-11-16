import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

const docs = defineCollection({
  loader: docsLoader({
    generateId: ({ entry, data }) =>
      typeof data.slug === 'string' ? data.slug : entry.replace(/(?:\/index)?\.mdx?$/, ''),
  }),
  schema: docsSchema(),
});

const blog = defineCollection({
  loader: glob({ base: './blog', pattern: '*.md' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    authors: z.string(),
    tags: z.array(z.string()),
  }),
});

const i18n = defineCollection({ loader: i18nLoader(), schema: i18nSchema() });

export const collections = { docs, blog, i18n };
