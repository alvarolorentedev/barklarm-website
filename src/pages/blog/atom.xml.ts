import type { APIRoute } from 'astro';
import { feedPosts, postPath } from '../../lib/blog';

const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
const xml = (value: string) => value.replace(/[&<>"']/g, char => entities[char]);

export const GET: APIRoute = async ({ site }) => {
  const entries = await feedPosts();
  const blog = xml(new URL('/blog', site).href);
  const feed = xml(new URL('/blog/atom.xml', site).href);
  const updated = entries[0]?.date.toISOString() ?? '2021-05-11T00:00:00.000Z';
  return new Response(`<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Barklarm Blog</title>
  <id>${blog}</id>
  <link href="${blog}" />
  <link rel="self" href="${feed}" />
  <updated>${updated}</updated>
  ${entries.map(data => {
    const url = xml(new URL(postPath(data.slug), site).href);
    return `<entry>
    <title>${xml(data.title)}</title>
    <id>${url}</id>
    <link href="${url}" />
    <updated>${data.date.toISOString()}</updated>
    <author><name>${xml(data.authors)}</name></author>
    <summary>${xml(data.description)}</summary>
    <content type="html">${xml(data.content)}</content>
  </entry>`;
  }).join('\n')}
</feed>`, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
