// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

import { runPlugin, createManifest, createEmbeddedUiHandler } from "@temps-sdk/plugin";
import type { EmbeddedAssets, RequestHandler, TempsPlugin } from "@temps-sdk/plugin";
import pkg from "../package.json";
import { greeting } from "./greeting";
import { page } from "./page";

export function manifest() {
  return createManifest(pkg.temps.name, pkg.version)
    .displayName(pkg.temps.title)
    .description(pkg.description)
    .addNav(pkg.temps.title, "puzzle", "/ui/", { section: "platform", order: 50 })
    .ui({ entry_js: "/ui/app.js", css: [], routes: [{ path: "/ui/", title: pkg.temps.title }] })
    .build();
}

const assets: EmbeddedAssets = new Map([
  ["index.html", { content: Buffer.from(page(pkg.temps.title)), contentType: "text/html; charset=utf-8", immutable: false }],
  ["app.js", { content: Buffer.from("const apiPath = new URL('../', location.href).pathname.replace(/\\/$/, ''); fetch(apiPath).then(r => { if (!r.ok) throw new Error('Unavailable'); return r.json(); }).then(data => { document.querySelector('[data-message]').textContent = data.message; }).catch(() => { document.querySelector('[data-message]').textContent = 'The JSON endpoint is unavailable.'; });"), contentType: "application/javascript; charset=utf-8", immutable: false }],
]);

export function handler(): RequestHandler {
  const serveUi = createEmbeddedUiHandler(assets);
  return (req, res) => {
    if (req.method === "GET" && serveUi(req, res)) return;
    if (req.method === "GET" && (req.url === "/" || req.url?.startsWith("/?"))) {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(greeting(pkg.temps.title)));
      return;
    }
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Not found" }));
  };
}

export const plugin: TempsPlugin = { manifest, handler, embeddedUiAssets: () => assets };

if (import.meta.main) await runPlugin(plugin);
