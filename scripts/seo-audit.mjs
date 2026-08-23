import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = new URL(process.env.SITE_URL || process.argv[2] || 'http://127.0.0.1:3000/');
const maxPages = Number(process.env.AUDIT_MAX_PAGES || 250);
const concurrency = Math.max(1, Number(process.env.AUDIT_CONCURRENCY || 4));
const userAgent = 'YardageLab-Internal-Audit/1.0 (+https://yardagelab.com/)';

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: baseUrl.href,
  pages: [],
  issues: [],
  summary: {},
};

function normalize(url) {
  const u = new URL(url, baseUrl);
  u.hash = '';
  if (u.origin !== baseUrl.origin) return null;
  if (!u.pathname.endsWith('/') && !u.pathname.includes('.')) u.pathname += '/';
  return u.href;
}

function textOf(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
}

function attr(html, tag, name) {
  const tags = html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) || [];
  for (const raw of tags) {
    const match = raw.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
    if (match) return match[1];
  }
  return '';
}

function linksFrom(html, pageUrl) {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi)) {
    try {
      const normalized = normalize(new URL(match[1], pageUrl));
      if (normalized) links.push(normalized);
    } catch {}
  }
  return [...new Set(links)];
}

function countMatches(html, regex) {
  return (html.match(regex) || []).length;
}

async function getRobots() {
  try {
    const res = await fetch(new URL('/robots.txt', baseUrl), { headers: { 'user-agent': userAgent } });
    return { status: res.status, body: res.ok ? await res.text() : '' };
  } catch (error) {
    report.issues.push({ severity: 'error', type: 'robots_unreachable', detail: String(error) });
    return { status: 0, body: '' };
  }
}

function isDisallowed(pathname, robots) {
  const groups = robots.split(/user-agent:/i).slice(1);
  for (const group of groups) {
    const lines = group.split(/\r?\n/).map((l) => l.trim());
    const agent = lines[0]?.toLowerCase() || '';
    if (!(agent === '*' || userAgent.toLowerCase().includes(agent))) continue;
    const rules = lines.filter((l) => /^disallow:/i.test(l)).map((l) => l.split(':').slice(1).join(':').trim());
    return rules.some((rule) => rule && pathname.startsWith(rule));
  }
  return false;
}

async function auditPage(url, robotsBody) {
  const started = Date.now();
  try {
    const parsed = new URL(url);
    if (isDisallowed(parsed.pathname, robotsBody)) {
      return { url, skipped: true, reason: 'robots.txt' };
    }
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': userAgent } });
    const contentType = res.headers.get('content-type') || '';
    const html = contentType.includes('text/html') ? await res.text() : '';
    const title = textOf(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)?.[1] || html.match(/<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i)?.[1] || '';
    const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1] || '';
    const robotsMeta = html.match(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1] || '';
    const h1Count = countMatches(html, /<h1\b/gi);
    const internalLinks = linksFrom(html, res.url);
    const record = { url, finalUrl: res.url, status: res.status, ms: Date.now() - started, title, description, canonical, robotsMeta, h1Count, internalLinks };

    const issue = (severity, type, detail = '') => report.issues.push({ severity, type, url, detail });
    if (!res.ok) issue('error', 'non_200', `HTTP ${res.status}`);
    if (res.ok && !title) issue('error', 'missing_title');
    if (res.ok && !description) issue('warning', 'missing_meta_description');
    if (res.ok && !canonical) issue('error', 'missing_canonical');
    if (res.ok && h1Count !== 1) issue('warning', 'h1_count', `Found ${h1Count}`);
    if (canonical) {
      try {
        const canonicalUrl = new URL(canonical, res.url);
        if (canonicalUrl.origin !== baseUrl.origin) issue('warning', 'external_canonical', canonicalUrl.href);
      } catch {
        issue('error', 'invalid_canonical', canonical);
      }
    }
    return record;
  } catch (error) {
    report.issues.push({ severity: 'error', type: 'fetch_failed', url, detail: String(error) });
    return { url, status: 0, error: String(error), internalLinks: [] };
  }
}

const robots = await getRobots();
if (robots.status !== 200) report.issues.push({ severity: 'warning', type: 'robots_status', detail: `HTTP ${robots.status}` });

const start = normalize(baseUrl);
const queued = start ? [start] : [];
const seen = new Set();
const incoming = new Map();

while (queued.length && seen.size < maxPages) {
  const batch = queued.splice(0, concurrency).filter((url) => !seen.has(url));
  const results = await Promise.all(batch.map((url) => auditPage(url, robots.body)));
  for (const page of results) {
    seen.add(page.url);
    report.pages.push(page);
    for (const link of page.internalLinks || []) {
      incoming.set(link, (incoming.get(link) || 0) + 1);
      if (!seen.has(link) && !queued.includes(link) && seen.size + queued.length < maxPages) queued.push(link);
    }
  }
}

for (const page of report.pages) {
  if (page.url !== start && page.status === 200 && !page.skipped && !incoming.get(page.url)) {
    report.issues.push({ severity: 'warning', type: 'orphan_page', url: page.url });
  }
}

const titleMap = new Map();
for (const page of report.pages) {
  if (!page.title) continue;
  titleMap.set(page.title, [...(titleMap.get(page.title) || []), page.url]);
}
for (const [title, urls] of titleMap) {
  if (urls.length > 1) report.issues.push({ severity: 'warning', type: 'duplicate_title', detail: title, urls });
}

report.summary = {
  crawled: report.pages.length,
  errors: report.issues.filter((i) => i.severity === 'error').length,
  warnings: report.issues.filter((i) => i.severity === 'warning').length,
  maxPages,
};

await mkdir('reports', { recursive: true });
await writeFile('reports/seo-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
if (report.summary.errors > 0) process.exitCode = 1;
