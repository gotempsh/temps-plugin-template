import { runPlugin, createManifest } from "@temps-sdk/plugin";
import pkg from "../package.json";
import { greeting } from "./greeting";

await runPlugin({
  manifest: () => createManifest(pkg.temps.name, pkg.version).displayName(pkg.temps.title).build(),
  handler: () => async (req, res) => {
    if (req.method !== "GET" || req.url !== "/") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(greeting(pkg.temps.title)));
  },
});
