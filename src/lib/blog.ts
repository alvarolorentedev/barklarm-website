import { getCollection } from 'astro:content';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

export async function posts() {
  const entries = await getCollection('blog');
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function displayDate(date: Date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export const postPath = (slug: string) => `/blog/${slug}`;

export async function feedPosts() {
  const renderer = await createMarkdownProcessor();
  return Promise.all((await posts()).map(async ({ body, data }) => ({
    ...data,
    content: (await renderer.render(body ?? '')).code,
  })));
}
