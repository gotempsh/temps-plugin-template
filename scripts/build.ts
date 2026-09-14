import pkg from "../package.json";
export const targets = {
  "linux-amd64-gnu": "bun-linux-x64-baseline",
  "linux-arm64-gnu": "bun-linux-arm64",
  "linux-amd64-musl": "bun-linux-x64-musl-baseline",
  "linux-arm64-musl": "bun-linux-arm64-musl",
  "darwin-amd64": "bun-darwin-x64",
  "darwin-arm64": "bun-darwin-arm64",
} as const;
if (import.meta.main) {
  for (const platform of pkg.temps.platforms) {
    if (!Object.hasOwn(targets, platform)) throw new Error(`Unsupported platform: ${platform}`);
    const child = Bun.spawn(["bun", "build", pkg.temps.entrypoint, "--compile", `--target=${targets[platform as keyof typeof targets]}`, "--outfile", `dist/${platform}/plugin`], { stdout: "inherit", stderr: "inherit" });
    if (await child.exited !== 0) throw new Error(`Build failed: ${platform}`);
  }
}
