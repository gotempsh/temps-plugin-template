# Temps TypeScript plugin template

Use **Use this template**, not a fork, to start your own native Temps plugin.
No Rust is required. Bun compiles TypeScript for six Linux/macOS targets;
Temps servers download the native executable without installing Bun or npm.

## Develop

Install Bun 1.3.3, then run:

```sh
bun install --frozen-lockfile
bun test
bun run check
bun run build
```

Edit `src/index.ts` and customize `package.json`: npm scope/name, version,
author, repository URL, plugin identity, title, category and description.
The example implements the SDK protocol and returns JSON at its root route.
Test real behavior on each advertised platform; cross-compilation alone is
not proof of runtime compatibility.

## Tag-based publication (preview)

The workflow temporarily pins the publishing CLI source from Temps PR #978
to an immutable commit; it does not assume npm's current CLI has plugin commands.

1. Create a GitHub environment named `npm-publish`. Restrict who can push release
   tags and require an environment reviewer before granting it credentials.
2. Add `NPM_TOKEN`, a least-privilege npm automation credential authorized to
   publish your scoped packages, and `TEMPS_CLOUD_TOKEN`, a Temps account API
   credential for a verified-email publisher. Never use an instance API key or
   a registry signing key. Configure credentials in GitHub, not in files.
   Also add `RELEASE_STATE_KEY`: 32 random bytes encoded as 64 hexadecimal
   characters, generated locally with `openssl rand -hex 32`. Keep this key
   unchanged for retries. It encrypts recovery artifacts, not the catalogue.
3. Match the package version to your tag:

```sh
git tag v0.1.0
git push origin v0.1.0
```

Actions builds native packages, creates a draft, embeds its ownership challenges,
publishes public npm packages, verifies them, and submits to Temps. Approval and
protected signing/deployment are separate. Check https://temps.sh/dashboard/plugins
for **Published** before expecting a listing at https://registry.temps.sh.

Never publish this unchanged template: release validation deliberately rejects it.
Do not attach credentials to PR workflows. Plugin build code runs with the release
job's privileges; review changes before granting access to publishing secrets.

## Release limitations

Use GitHub's **Re-run jobs** on the same run after a partial failure. The workflow
restores its AES-GCM-encrypted recovery artifact and rebuilds missing binaries;
the CLI verifies existing npm packages instead of overwriting them. Artifacts
expire after seven days, and ownership challenges expire after 24 hours. If the
runner is forcibly terminated before saving its journal, or the artifact/key is
lost, use a new version. Do not delete/recreate tags to retry: that creates a new
run without its recovery artifact. Never upload the plaintext `.temps-plugin`
directory. A restored journal does not bypass the API's ownership checks.

The registry still requires its protected signing runner to process queued
submissions. This template neither contains nor provisions registry signing keys.

Full author guide: https://temps.sh/docs/plugins/publishing
