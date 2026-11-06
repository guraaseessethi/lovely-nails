// Tiny standalone HTML responses for the one-time Instagram connect tool.

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function page(title: string, body: string, status = 200, headers: Record<string, string> = {}) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title>
<style>body{margin:0;font:16px/1.6 system-ui,sans-serif;background:#F3ECE5;color:#111111;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box}main{max-width:480px;background:#fff;border-radius:28px;padding:40px}h1{font-weight:400;margin:0 0 12px}a.btn{display:inline-flex;align-items:center;min-height:52px;padding:0 28px;border-radius:999px;background:#00AEEB;color:#111111;text-decoration:none;font-weight:500;margin-top:12px}p{color:#3B2A22}</style></head>
<body><main><h1>${esc(title)}</h1>${body}</main></body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", ...headers },
  });
}

export { esc };
