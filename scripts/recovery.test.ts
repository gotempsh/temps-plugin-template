import { expect, test } from "bun:test";
import { seal, unseal } from "./recovery";
test("recovery journal round trips without plaintext disclosure", async () => {
  const secret = "ab".repeat(32);
  const encrypted = await seal("private recovery code", secret);
  expect(new TextDecoder().decode(encrypted)).not.toContain("private recovery code");
  expect(await unseal(encrypted, secret)).toBe("private recovery code");
  await expect(unseal(encrypted, "cd".repeat(32))).rejects.toThrow();
  encrypted[15] ^= 1;
  await expect(unseal(encrypted, secret)).rejects.toThrow();
});
