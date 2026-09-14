# Temps TypeScript plugin template

Use **Use this template** on GitHub to create your own native Temps plugin. No
Rust or npm publication is required. Temps builds the plugin from your GitHub
source and embeds its UI in the native executable. Installation does not require
restarting Temps.

## Customize and push

Install [Bun](https://bun.sh/) 1.4.2, then edit `package.json` (plugin name,
version, title, author, repository, description and supported platforms),
`src/index.ts` (manifest, navigation and routes), and `src/page.ts` (sidebar UI).
The example serves its page at `/ui/` and preserves JSON at `/`.

```sh
bun install --frozen-lockfile
bun test
bun run check
bun run build
git add package.json bun.lock src README.md
git commit -m "feat: customize plugin"
git push origin main
```

Commit `bun.lock` with the source; Temps uses the lockfile for a reproducible
build. Test real behavior on each advertised platform; cross-compilation alone
does not prove runtime compatibility. Review dependencies and build scripts
before installing any plugin: building source executes code from that repository.

## Install in Temps

In the Temps Plugins page, choose **Install from GitHub**, paste your repository
URL, review the source/trust warning, and confirm installation. The installed
plugin should appear in the platform sidebar; open it to see the embedded page.
The Temps host needs Git and a working Docker daemon to build the executable.
For a public repository, the URL is enough. Private repositories require GitHub
credentials configured on the Temps host or in its Docker container; your local
workstation's GitHub login is not automatically available to the server. Do not
put credentials in the URL or commit them to this repository.

Where supported by your configured Temps CLI, you can also use:

```sh
bunx --bun @temps-sdk/cli plugin install https://github.com/owner/repo
bunx --bun @temps-sdk/cli plugin update my-plugin
```

The CLI commands are currently available in the Temps plugin-source preview
and may not be in the npm-published CLI yet; use the Plugins page if unavailable.
The interactive install asks you to review and trust the source. `--yes` skips
that prompt only when you have already reviewed it. Installing a new source
revision is an explicit update, not an automatic effect of pushing to GitHub;
use the plugin's update action in Temps after pushing changes. UI installation
refreshes navigation automatically. After a CLI installation, return to the
console tab to refresh its plugin list; no Temps restart is needed.

The template's GitHub Actions workflow only tests commits and pull requests.
It does not publish to npm or require `NPM_TOKEN` or a Temps cloud token.
