export const releaseUrl = 'https://github.com/alvarolorentedev/barklarm-app/releases/latest';
export const repositoryUrl = 'https://github.com/alvarolorentedev/barklarm-app';
export const socialImage = '/img/product/social-card.jpg';
export const socialImageAlt = 'Barklarm desktop app showing the Observers list';

export const nav = [
  { label: 'Integrations', href: '/#integrations' },
  { label: 'Docs', href: '/docs/intro' },
  { label: 'Blog', href: '/blog' },
];

export const integrations = [
  { name: 'GitHub Actions', slug: 'github-actions', image: '/img/product/githubactions.svg' },
  { name: 'Azure DevOps', slug: 'azure-devops', image: '/img/product/azure-devops.svg' },
  { name: 'Datadog', slug: 'datadog-monitors', image: '/img/product/datadog.svg' },
  { name: 'Sentry', slug: 'sentry', image: '/img/product/sentry.svg' },
  { name: 'New Relic', slug: 'new-relic', image: '/img/product/newrelic.svg' },
  { name: 'CCTray', slug: 'cctray' },
];

export function canonicalPath(path: string) {
  return path.replace(/(?:\/index)?\.html$|\/$/g, '') || '/';
}
