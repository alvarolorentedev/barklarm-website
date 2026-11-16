import { copyFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://www.barklarm.com',
  trailingSlash: 'never',
  prefetch: false,
  build: { format: 'file' },
  integrations: [
    sitemap({ filter: (url) => new URL(url).pathname !== '/search' }),
    {
      name: 'legacy-sitemap-url',
      hooks: {
        'astro:build:done': ({ dir }) =>
          copyFile(new URL('sitemap-index.xml', dir), new URL('sitemap.xml', dir)),
      },
    },
    starlight({
      title: 'Barklarm',
      disable404Route: true,
      routeMiddleware: './src/lib/docs-urls.ts',
      favicon: '/img/favicon.ico',
      editLink: { baseUrl: 'https://github.com/alvarolorentedev/barklarm-website/edit/main/' },
      customCss: ['@fontsource-variable/inter', './src/styles/docs.css'],
      components: {
        Header: './src/components/DocsHeader.astro',
        Head: './src/components/DocsHead.astro',
        PageTitle: './src/components/DocsTitle.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
      },
      sidebar: [
        { slug: 'docs/intro' },
        { slug: 'docs/quick-start' },
        {
          label: 'Application',
          items: [
            { slug: 'docs/category/application' },
            { slug: 'docs/application/menu' },
            { slug: 'docs/application/configuration-window' },
            { slug: 'docs/application/notifications' },
          ],
        },
        {
          label: 'Configuration',
          items: [
            { slug: 'docs/configuration' },
            { slug: 'docs/configuration/github-actions' },
            { slug: 'docs/configuration/datadog-monitors' },
            { slug: 'docs/configuration/sentry' },
            { slug: 'docs/configuration/new-relic' },
            { slug: 'docs/configuration/azure-devops' },
            {
              label: 'CCTray',
              collapsed: true,
              items: [
                { slug: 'docs/configuration/cctray' },
                { autogenerate: { directory: 'docs/configuration/cctray' } },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
