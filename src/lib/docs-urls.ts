import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { canonicalPath } from './site';

type Entry = StarlightRouteData['sidebar'][number];
const cleanLink = (href: string) => href.startsWith('/docs/') ? canonicalPath(href) : href;
const cleanEntry = (entry: Entry): Entry =>
  entry.type === 'group'
    ? { ...entry, entries: entry.entries.map(cleanEntry) }
    : { ...entry, href: cleanLink(entry.href) };

export const onRequest = defineRouteMiddleware(({ locals, site, url }) => {
  const route = locals.starlightRoute;
  const canonical = new URL(canonicalPath(url.pathname), site).href;

  // GitHub Pages serves these .html files at the existing extensionless URLs.
  route.sidebar = route.sidebar.map(cleanEntry);
  for (const direction of ['prev', 'next'] as const) {
    const link = route.pagination[direction];
    if (link) route.pagination[direction] = { ...link, href: cleanLink(link.href) };
  }
  route.head = route.head.map(entry => {
    if (entry.tag === 'link' && entry.attrs?.rel === 'canonical') {
      return { ...entry, attrs: { ...entry.attrs, href: canonical } };
    }
    if (entry.tag === 'meta' && entry.attrs?.property === 'og:url') {
      return { ...entry, attrs: { ...entry.attrs, content: canonical } };
    }
    return entry;
  });
});
