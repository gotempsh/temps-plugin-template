import { expect, test } from "bun:test";
import { greeting } from "./greeting";
test("returns a JSON-safe greeting", () => {
  expect(greeting("My plugin")).toEqual({ message: "Hello from My plugin" });
});
