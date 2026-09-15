// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0
import { expect, test } from "bun:test";
import pkg from "../package.json";

test("the published template credits its maintainer instead of placeholder metadata", () => {
  expect(pkg.author).toBe("David Viejo");
});

test("registry screenshots reference real PNG assets with accessible descriptions", async () => {
  expect(pkg.temps.screenshots).toHaveLength(2);
  for (const screenshot of pkg.temps.screenshots) {
    expect(screenshot.path).toMatch(/^assets\/[a-z-]+\.png$/);
    expect(screenshot.alt.length).toBeGreaterThan(20);
    const image = Bun.file(new URL(`../${screenshot.path}`, import.meta.url));
    expect(await image.exists()).toBe(true);
    const bytes = new Uint8Array(await image.arrayBuffer());
    expect(Array.from(bytes.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect(bytes.length).toBeLessThan(500_000);
  }
});
