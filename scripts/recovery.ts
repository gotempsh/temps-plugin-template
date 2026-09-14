import pkg from "../package.json";

export async function seal(value: string, secret: string): Promise<Uint8Array> {
  const key = await keyFrom(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const bytes = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(value));
  return new Uint8Array([...iv, ...new Uint8Array(bytes)]);
}
export async function unseal(bytes: Uint8Array, secret: string): Promise<string> {
  const value = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, await keyFrom(secret), bytes.slice(12));
  return new TextDecoder().decode(value);
}
async function keyFrom(secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(secret)) throw new Error("Set RELEASE_STATE_KEY to 32 random bytes encoded as hex.");
  const raw = Uint8Array.from(secret.match(/../g)!, pair => parseInt(pair, 16));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}
if (import.meta.main) {
  const secret = process.env.RELEASE_STATE_KEY ?? "";
  const path = `.temps-plugin/${pkg.version}`;
  if (Bun.argv[2] === "save") {
    const state: Record<string, unknown> = {};
    for (const name of ["request.json", "release.json"]) {
      const file = Bun.file(`${path}/${name}`);
      if (await file.exists()) state[name] = await file.json();
    }
    if (Object.keys(state).length) await Bun.write("release-state.enc", await seal(JSON.stringify({ version: pkg.version, state }), secret));
  } else if (Bun.argv[2] === "restore") {
    const data = JSON.parse(await unseal(new Uint8Array(await Bun.file("release-state.enc").arrayBuffer()), secret));
    if (data.version !== pkg.version || !data.state || typeof data.state !== "object") throw new Error("Recovery version mismatch.");
    for (const name of ["request.json", "release.json"]) {
      if (data.state[name]) await Bun.write(`${path}/${name}`, JSON.stringify(data.state[name]), { mode: 0o600 });
    }
  } else throw new Error("Use save or restore.");
}
