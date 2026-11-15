import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const root = resolve('dist');
const basePath = (process.env.GITHUB_PAGES_BASE_PATH ?? '/interstellar-fm').replace(/\/$/, '');
const contentTypes = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon',
  '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2',
};

// Emulate Pages' project subpath and extensionless HTML, without an SPA fallback.
createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (!pathname.startsWith(`${basePath}/`)) {
    response.writeHead(404).end();
    return;
  }
  const file = resolve(root, `.${pathname.slice(basePath.length)}`);
  if (file !== root && !file.startsWith(`${root}/`)) {
    response.writeHead(403).end();
    return;
  }
  for (const candidate of [file, `${file}.html`, resolve(file, 'index.html')]) {
    try {
      if (!(await stat(candidate)).isFile()) continue;
      response.writeHead(200, { 'Content-Type': contentTypes[extname(candidate)] ?? 'application/octet-stream' });
      response.end(await readFile(candidate));
      return;
    } catch {
      // Try the next static HTML candidate.
    }
  }
  response.writeHead(404).end();
}).listen(4173, '127.0.0.1');
