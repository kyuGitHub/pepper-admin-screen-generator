import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage } from 'node:http';

/** Dev-only: serves api/*.ts through the same Web-standard handlers Vercel runs, so `npm run dev` has /api/generate. */
function vercelApi(): Plugin {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/api/')) return next();
        const name = url
          .slice(5)
          .split('?')[0]
          .replace(/[^a-zA-Z0-9_-]/g, '');
        try {
          const mod = (await server.ssrLoadModule(`/api/${name}.ts`)) as Record<string, (r: Request) => Promise<Response>>;
          const handler = mod[req.method ?? 'GET'] ?? mod.default;
          if (!handler) {
            res.statusCode = 405;
            return res.end();
          }
          const request = new Request(`http://localhost${url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req),
          });
          const response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          if (!response.body) return res.end();
          const reader = response.body.getReader();
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ message: (e as Error).message }));
        }
      });
    },
  };
}

const readBody = (req: IncomingMessage) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

export default defineConfig(({ mode }) => {
  // The API handler reads process.env (as on Vercel); expose the .env values to it in dev.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return { plugins: [react(), vercelApi()], base: '/' };
});
