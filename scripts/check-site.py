"""Check the production artifact against the site's public URL and metadata contracts."""

import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from xml.etree import ElementTree

SITE = 'https://www.barklarm.com'
DIST = Path('dist')
errors = []


def require(condition, message):
    if not condition:
        errors.append(message)


def resolve(path):
    local = DIST / unquote(path).lstrip('/')
    if not path.endswith('/') and local.is_file():
        return local
    if not path.endswith('/') and not local.suffix and local.with_suffix('.html').is_file():
        return local.with_suffix('.html')
    return local / 'index.html'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.ids = set()
        self.metadata = {}
        self.canonical = []
        self.h1_count = 0
        self.schemas = []
        self.in_schema = False
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'h1':
            self.h1_count += 1
        if tag == 'meta':
            self.metadata[attrs.get('name') or attrs.get('property')] = attrs.get('content', '')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs['href'])
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.in_schema = True
        for key in ('href', 'src', 'poster'):
            if attrs.get(key) and tag in {'a', 'img', 'link', 'script', 'source', 'track', 'video'}:
                self.links.append(attrs[key])

    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_schema = False

    def handle_data(self, data):
        if self.in_schema:
            self.schemas.append(data)


pages = {path: Page(path.read_text()) for path in DIST.rglob('*.html')}
legacy = Path('scripts/legacy-urls.txt').read_text().splitlines()
for url in legacy:
    require(resolve(urlsplit(url).path) in pages, f'Missing legacy page: {url}')

sitemap_index = ElementTree.parse(DIST / 'sitemap.xml')
sitemap = [
    url.text
    for loc in sitemap_index.findall('.//{*}loc')
    for url in ElementTree.parse(resolve(urlsplit(loc.text).path)).findall('.//{*}loc')
]
require(set(legacy) - {f'{SITE}/search'} <= set(sitemap), 'Legacy indexable pages missing from sitemap')
require(len(sitemap) == len(set(sitemap)), 'Duplicate sitemap URLs')
descriptions = set()
for url in sitemap:
    page = pages.get(resolve(urlsplit(url).path))
    require(page is not None, f'Sitemap page missing: {url}')
    if page is None:
        continue
    require(urlsplit(url).netloc == urlsplit(SITE).netloc, f'Unexpected sitemap host: {url}')
    require(page.canonical == [url], f'Incorrect canonical for {url}: {page.canonical}')
    require(page.metadata.get('og:url') == url, f'Incorrect social URL for {url}')
    require(page.h1_count == 1, f'Expected one H1 for {url}')
    for key in ('description', 'og:title', 'og:image', 'og:description'):
        require(bool(page.metadata.get(key)), f'Missing {key} for {url}')
    require('noindex' not in page.metadata.get('robots', ''), f'Noindex page in sitemap: {url}')
    description = page.metadata.get('description')
    require(description not in descriptions, f'Duplicate description for {url}')
    descriptions.add(description)

for path, page in pages.items():
    relative = path.relative_to(DIST).as_posix()
    base = f'/{relative}' if relative.endswith('/index.html') else f'/{relative.removesuffix(".html")}'
    for link in page.links:
        url = urlsplit(urljoin(f'{SITE}{base}', link))
        if url.netloc != urlsplit(SITE).netloc or url.scheme != 'https':
            continue
        target = resolve(url.path)
        require(target.is_file(), f'{path}: missing link {link}')
        if url.fragment and target in pages:
            require(unquote(url.fragment) in pages[target].ids, f'{path}: missing anchor {link}')
    for schema in page.schemas:
        try:
            json.loads(schema)
        except ValueError:
            errors.append(f'{path}: invalid structured data')

anchors = {
    '/docs/quick-start': {'getting-started', 'install', 'manual', 'using-package-manager'},
    '/docs/application/menu': {'summary-icon', 'menu', 'legend'},
    '/docs/intro': {'what-is-barklarm', 'is-barklarm-for-me', 'ready-to-get-started'},
}
for route, expected in anchors.items():
    require(expected <= pages[resolve(route)].ids, f'Legacy anchors missing from {route}')

for route in ('/search', '/admin/', '/404'):
    require('noindex' in pages[resolve(route)].metadata.get('robots', ''), f'Missing noindex for {route}')
for name, root in (('rss', 'rss'), ('atom', '{http://www.w3.org/2005/Atom}feed')):
    feed = ElementTree.parse(resolve(f'/blog/{name}.xml')).getroot()
    require(feed.tag == root and any('first-alpha-release' in (node.text or '') for node in feed.iter()),
            f'Invalid {name} feed or missing historical post')

if errors:
    raise SystemExit('\n'.join(dict.fromkeys(errors)))
print(f'Checked {len(legacy)} legacy URLs, {len(sitemap)} indexable pages, links, anchors, and feeds.')
