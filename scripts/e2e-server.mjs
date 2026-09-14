import { spawn } from 'node:child_process';
const port = process.env.PORT || '3000';
const env = { ...process.env, VERCEL_ENV: 'production', NEXT_PUBLIC_ALLOW_INDEX: 'true', NEXT_PUBLIC_SITE_URL: `http://127.0.0.1:${port}`, NEXT_PUBLIC_ENABLE_CONSENT_BANNER: 'true' };
const cli = 'node_modules/next/dist/bin/next';
let child;
function run(args) {
  return new Promise((resolve, reject) => {
    child = spawn(process.execPath, [cli, ...args], { env, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Next exited with ${code}`)));
  });
}
for (const signal of ['SIGTERM','SIGINT']) process.on(signal, () => { child?.kill(signal); process.exit(); });
await run(['build']);
await run(['start', '-p', port]);
