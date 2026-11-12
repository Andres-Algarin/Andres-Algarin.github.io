import react from "@vitejs/plugin-react";
import { readFileSync, existsSync, realpathSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

// Local content is supplied by the dev server, never imported into source/builds.
function localProjects(enabled: boolean): Plugin {
  const moduleId = "virtual:local-projects";
  const resolvedId = `\0${moduleId}`;
  const privateRoot = path.resolve(".private");
  const manifest = path.join(privateRoot, "projects.json");
  type Image = { src: string; originalSrc?: string };
  type LocalProject = { cover: Image; gallery: Image[] };
  const readProjects = (): LocalProject[] => {
    if (!enabled || !existsSync(manifest)) return [];
    return JSON.parse(readFileSync(manifest, "utf8").replace(/^\uFEFF/, ""));
  };
  return {
    name: "local-project-previews",
    resolveId(id) {
      if (id === moduleId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId)
        return `export default ${JSON.stringify(readProjects())};`;
    },
    configureServer(server) {
      const assets = new Map<string, string>();
      for (const project of readProjects()) {
        for (const image of [project.cover, ...project.gallery]) {
          for (const url of [image.src, image.originalSrc]) {
            if (
              !url ||
              !/^\/__local-project-assets\/[a-z0-9-]+\/[a-z0-9.-]+\.(jpeg|png|webp)$/.test(
                url,
              )
            )
              continue;
            const file = path.resolve(
              privateRoot,
              "assets",
              url.slice("/__local-project-assets/".length),
            );
            if (!existsSync(file))
              throw new Error("Missing local preview image");
            const resolved = realpathSync(file);
            if (!resolved.startsWith(realpathSync(privateRoot) + path.sep))
              throw new Error("Invalid local asset path");
            assets.set(url, resolved);
          }
        }
      }
      server.middlewares.use((request, response, next) => {
        // This server contains unapproved previews: do not serve them over LAN.
        if (
          !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
            request.socket.remoteAddress ?? "",
          )
        ) {
          response.statusCode = 403;
          response.end();
          return;
        }
        let pathname: string;
        try {
          pathname = decodeURIComponent((request.url ?? "").split("?")[0]!);
        } catch {
          response.statusCode = 400;
          response.end();
          return;
        }
        if (pathname.toLowerCase().includes(".private")) {
          response.statusCode = 404;
          response.end();
          return;
        }
        if (!pathname.startsWith("/__local-project-assets/")) {
          next();
          return;
        }
        const file = assets.get(pathname);
        if (!file || !["GET", "HEAD"].includes(request.method ?? "")) {
          response.statusCode = 404;
          response.end();
          return;
        }
        response.setHeader(
          "Content-Type",
          file.endsWith(".webp")
            ? "image/webp"
            : file.endsWith(".png")
              ? "image/png"
              : "image/jpeg",
        );
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("X-Content-Type-Options", "nosniff");
        if (request.method === "HEAD") {
          response.end();
          return;
        }
        response.end(readFileSync(file));
      });
    },
  };
}

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), localProjects(command === "serve" && !isPreview)],
  base: "./",
  server: {
    host: "127.0.0.1",
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/.private/**"],
    },
  },
}));
