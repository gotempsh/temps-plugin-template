import { expect, test } from "bun:test";
import { validateRelease } from "./release-check";
import { targets } from "./build";
import pkg from "../package.json";
test("refuses accidental publication of unchanged template", () => {
  expect(() => validateRelease(`v${pkg.version}`, "gotempsh/temps-plugin-template")).toThrow("Customize");
});
test("rejects mismatched tags", () => {
  expect(() => validateRelease("v2.0.0", "example/plugin")).toThrow("Tag must equal");
});
test("offers six native targets", () => expect(Object.keys(targets)).toHaveLength(6));
