// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function page(title: string): string {
  const safeTitle = escapeHtml(title);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} · Temps</title>
  <style>
    :root { color-scheme: light dark; --ink:#18181b; --muted:#71717a; --paper:#fafafa; --surface:#fff; --line:#e4e4e7; --accent:#e85d3f; --soft:#f4f4f5; }
    @media (prefers-color-scheme: dark) { :root { --ink:#f4f4f5; --muted:#a1a1aa; --paper:#09090b; --surface:#18181b; --line:#3f3f46; --accent:#ff8466; --soft:#27272a; } }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--paper); color:var(--ink); font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; font-size:14px; }
    main { max-width:1040px; margin:auto; padding:32px clamp(20px,4vw,48px); }
    .eyebrow { font-size:12px; font-weight:600; color:var(--muted); }
    h1 { margin:8px 0 6px; font-size:30px; line-height:1.2; font-weight:650; letter-spacing:-.035em; }
    .intro { margin:0; color:var(--muted); line-height:1.6; }
    .card { margin-top:28px; border:1px solid var(--line); border-radius:12px; background:var(--surface); overflow:hidden; }
    .card-head { display:flex; gap:10px; align-items:center; padding:16px 20px; border-bottom:1px solid var(--line); font-weight:600; }
    .dot { width:8px; height:8px; border-radius:50%; background:#22c55e; }
    .card-body { padding:20px; }
    h2 { margin:0 0 8px; font-size:16px; font-weight:600; }
    .card p { margin:0 0 16px; color:var(--muted); line-height:1.6; }
    code { padding:3px 6px; border-radius:4px; background:var(--soft); color:var(--ink); font-size:12px; }
    .api { border-top:1px solid var(--line); padding-top:16px; color:var(--muted); font-size:12px; }
    .api strong { display:block; margin-top:6px; color:var(--ink); font-weight:500; }
  </style>
</head>
<body>
  <main>
    <div class="eyebrow">Temps / Plugin workspace</div>
    <h1>${safeTitle}</h1>
    <p class="intro">Your plugin is installed and ready. This page is served by its native executable, directly inside Temps.</p>
    <section class="card" aria-label="Plugin status">
      <div class="card-head"><span class="dot" aria-hidden="true"></span> Plugin online</div>
      <div class="card-body"><h2>Make this space yours</h2><p>Edit <code>src/page.ts</code> to build your interface. The plugin root still returns JSON.</p><div class="api"><code>GET /</code><strong data-message>Checking API…</strong></div></div>
    </section>
  </main>
  <script src="./app.js" defer></script>
</body>
</html>`;
}
