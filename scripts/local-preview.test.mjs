import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = path.join(root, ".private/projects.json");
const hasPrivateData = existsSync(manifest);
const projects = hasPrivateData
  ? JSON.parse(readFileSync(manifest, "utf8").replace(/^\uFEFF/, ""))
  : [];
const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });

test(
  "Production output excludes private identities, routes and image bytes",
  { skip: !hasPrivateData },
  () => {
    const files = walk(path.join(root, "dist"));
    const output = files.map((file) => readFileSync(file));
    const texts = files
      .filter((file) => /\.(js|json|css|html|md|map|txt)$/.test(file))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    for (const project of projects) {
      for (const value of [
        project.title,
        project.id,
        project.description,
        project.overview,
      ]) {
        assert.ok(
          !texts.toLowerCase().includes(value.toLowerCase()),
          "Private text leaked into production",
        );
      }
    }
    assert.ok(!texts.includes("/__local-project-assets/"));
    for (const file of walk(path.join(root, ".private/assets"))) {
      const original = readFileSync(file);
      assert.ok(
        !output.some((content) => content.equals(original)),
        "Private image copied into production",
      );
    }
  },
);

test(
  "Local preview serves selected images and blocks raw/private/unselected files",
  { skip: !hasPrivateData },
  async () => {
    const server = await createServer({
      root,
      logLevel: "silent",
      server: { host: "127.0.0.1", port: 0, open: false },
    });
    await server.listen();
    try {
      const address = server.httpServer.address();
      assert.ok(address && typeof address !== "string");
      const origin = `http://127.0.0.1:${address.port}`;
      const module = await fetch(`${origin}/@id/__x00__virtual:local-projects`);
      assert.equal(module.status, 200);
      const source = await module.text();
      for (const project of projects) {
        assert.ok(source.includes(JSON.stringify(project.title)));
        for (const image of [project.cover, ...project.gallery]) {
          const response = await fetch(`${origin}${image.src}`);
          assert.equal(response.status, 200);
          assert.match(response.headers.get("content-type"), /^image\//);
          assert.equal(response.headers.get("cache-control"), "no-store");
        }
      }
      for (const url of [
        "/.private/projects.json",
        `/@fs/${manifest.replaceAll("\\", "/")}`,
        "/__local-project-assets/unknown/missing.jpeg",
      ]) {
        assert.equal((await fetch(`${origin}${url}`)).status, 404);
      }
      const approved = new Set(
        projects
          .flatMap((project) => [project.cover, ...project.gallery])
          .flatMap((image) => [image.src, image.originalSrc])
          .filter(Boolean),
      );
      for (const file of walk(path.join(root, ".private/assets"))) {
        const url =
          "/__local-project-assets/" +
          path
            .relative(path.join(root, ".private/assets"), file)
            .replaceAll("\\", "/");
        if (!approved.has(url))
          assert.equal((await fetch(`${origin}${url}`)).status, 404);
      }
    } finally {
      await server.close();
    }
  },
);
