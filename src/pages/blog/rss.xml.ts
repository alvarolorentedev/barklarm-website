import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { feedPosts, postPath } from '../../lib/blog';

export const GET: APIRoute = async ({ site }) => rss({
  title: 'Barklarm Blog',
  description: 'Release notes and updates from Barklarm.',
  site: site!,
  items: (await feedPosts()).map(data => ({
    title: data.title,
    description: data.description,
    pubDate: data.date,
    link: postPath(data.slug),
    content: data.content,
    categories: data.tags,
  })),
});
