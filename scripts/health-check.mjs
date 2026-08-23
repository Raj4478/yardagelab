const baseUrl = new URL(process.env.SITE_URL || process.argv[2] || 'http://127.0.0.1:3000/');
const paths = ['/', '/robots.txt', '/sitemap.xml', '/quilting/backing-calculator/', '/sewing/fabric-yardage-calculator/'];
let failed = false;

for (const path of paths) {
  const url = new URL(path, baseUrl);
  const started = Date.now();
  try {
    const response = await fetch(url, { redirect: 'follow' });
    const ms = Date.now() - started;
    console.log(`${response.ok ? 'OK' : 'FAIL'} ${response.status} ${ms}ms ${url}`);
    if (!response.ok) failed = true;
  } catch (error) {
    failed = true;
    console.error(`FAIL 0 ${url} ${String(error)}`);
  }
}

if (failed) process.exit(1);
