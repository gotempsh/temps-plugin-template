import pkg from "../package.json";
export function validateRelease(tag: string, repository: string) {
  if (tag !== `v${pkg.version}`) throw new Error("Tag must equal v followed by package.json version.");
  if (pkg.name.includes("your-scope") || pkg.author === "Your team" || pkg.temps.name === "my-plugin") throw new Error("Customize package name, author and plugin identity before releasing.");
  if (pkg.repository !== `https://github.com/${repository}`) throw new Error("package.json repository must match this GitHub repository.");
}
if (import.meta.main) validateRelease(process.env.GITHUB_REF_NAME ?? "", process.env.GITHUB_REPOSITORY ?? "");
