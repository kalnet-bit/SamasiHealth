// @ts-check
import { watch } from 'node:fs';
import { runBuild } from './build.js';
import { createDevServer } from './serve.js';

/**
 * Local development server: builds once, then rebuilds on src/ changes.
 * Serve via http://127.0.0.1:8080
 */
async function main() {
  const port = Number(process.env.PORT ?? process.argv[2] ?? 8080);
  await runBuild();

  const server = createDevServer();
  server.listen(port, '127.0.0.1', () => {
    console.log(`dev: http://127.0.0.1:${port}`);
    console.log('dev: watching src/ for changes...');
  });

  /** @type {Record<string, ReturnType<typeof setTimeout>>} */
  const debounce = {};
  watch(new URL('../src', import.meta.url), { recursive: true }, (event, filename) => {
    if (!filename) return;
    const key = String(filename);
    if (debounce[key]) clearTimeout(debounce[key]);
    debounce[key] = setTimeout(async () => {
      console.log(`dev: change detected in ${key} — rebuilding`);
      try {
        await runBuild();
        console.log('dev: rebuild complete');
      } catch (err) {
        console.error('dev: build failed');
        console.error(err instanceof Error ? err.message : err);
      }
    }, 250);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});