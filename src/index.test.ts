// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

import { expect, test } from "bun:test";
import type { IncomingMessage, ServerResponse } from "node:http";
import { handler, manifest } from "./index";
import { page } from "./page";

function request(path: string, method = "GET") {
  let status = 0;
  let headers: Record<string, string> = {};
  let body = "";
  const response = {
    writeHead(code: number, values: Record<string, string>) { status = code; headers = values; return this; },
    end(value?: string | Buffer) { body = value?.toString() ?? ""; return this; },
  } as unknown as ServerResponse;
  handler()({ url: path, method } as IncomingMessage, response);
  return { status, headers, body };
}

test("manifest exposes a platform sidebar entry and embedded UI route", () => {
  const result = manifest();
  expect(result.nav).toEqual([{ label: "My plugin", icon: "puzzle", path: "/ui/", section: "platform", order: 50 }]);
  expect(result.ui).toEqual({ entry_js: "/ui/app.js", css: [], routes: [{ path: "/ui/", title: "My plugin" }] });
});

test("UI routes serve embedded HTML and JavaScript", () => {
  const redirect = request("/ui");
  expect(redirect.status).toBe(302);
  expect(redirect.headers.Location).toBe("/ui/");
  const htmlResponse = request("/ui/");
  const html = htmlResponse.body;
  expect(htmlResponse.headers["Content-Type"]).toContain("text/html");
  expect(html).toContain("<h1>My plugin</h1>");
  expect(html).toContain("Plugin online");
  const script = request("/ui/app.js");
  expect(script.status).toBe(200);
  expect(script.headers["Content-Type"]).toContain("javascript");
  expect(script.body).toContain("data-message");
  expect(script.body).toContain("new URL('../', location.href).pathname.replace(/\\/$/, '')");
});

test("root JSON API remains available", () => {
  const response = request("/");
  expect(response.status).toBe(200);
  expect(response.headers["Content-Type"]).toContain("application/json");
  expect(JSON.parse(response.body)).toEqual({ message: "Hello from My plugin" });
});

test("unknown and non-GET routes are not found", () => {
  for (const [path, method] of [["/missing", "GET"], ["/", "POST"]]) {
    const response = request(path!, method!);
    expect(response.status).toBe(404);
    expect(JSON.parse(response.body)).toEqual({ error: "Not found" });
  }
});

test("custom title is HTML-escaped in document text", () => {
  const html = page('<script>alert("x")</script> &');
  expect(html).toContain("&lt;script&gt;");
  expect(html).toContain("&amp;");
  expect(html).not.toContain('<script>alert("x")</script>');
});
