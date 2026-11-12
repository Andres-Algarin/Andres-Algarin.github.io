import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { preview } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const readJson = (file) =>
  JSON.parse(
    readFileSync(path.join(root, file), "utf8").replace(/^\uFEFF/, ""),
  );
const additional = readJson("src/data/additional-projects.json");
const frontendImages = Object.values(
  readJson("src/data/project-images.json"),
).map((image) => `projects/ferreinver/${image.file}`);
const assets = [
  ...new Set([
    ...frontendImages,
    ...additional
      .flatMap((project) => [project.cover, ...project.gallery])
      .flatMap((image) => [image.src, image.originalSrc])
      .filter(Boolean),
  ]),
];

test("Approved projects have complete galleries and no private preview or code links", () => {
  assert.deepEqual(
    additional.map((project) => project.id),
    ["austral", "contrasena"],
  );
  assert.deepEqual(
    additional.map((project) => 1 + project.gallery.length),
    [23, 10],
  );
  assert.equal(frontendImages.length, 9);
  for (const project of additional) {
    assert.equal(project.previewOnly, undefined);
    assert.equal(project.repositoryUrl, undefined);
    assert.equal(project.demoUrl, undefined);
    for (const image of [project.cover, ...project.gallery]) {
      assert.ok(image.width > 0 && image.height > 0 && image.alt.length > 0);
      assert.ok(image.src.startsWith(`projects/${project.id}/`));
    }
  }
  const bundles = readdirSync(path.join(root, "dist/assets"))
    .filter((file) => file.endsWith(".js"))
    .map((file) => readFileSync(path.join(root, "dist/assets", file), "utf8"))
    .join("\n");
  for (const name of ["FERREINVER", "Austral", "ContraSENA"])
    assert.ok(bundles.includes(name));
  for (const marker of [
    "/__local-project-assets/",
    "virtual:local-projects",
    ".private/",
    "pendiente de autorización pública",
  ])
    assert.ok(!bundles.includes(marker));
  for (const asset of assets)
    assert.deepEqual(
      readFileSync(path.join(root, "dist", asset)),
      readFileSync(path.join(root, "public", asset)),
    );
});

test("Production preview serves every approved image without private data", async () => {
  const server = await preview({
    root,
    logLevel: "silent",
    preview: { host: "127.0.0.1", port: 0, open: false },
  });
  try {
    const address = server.httpServer.address();
    assert.ok(address && typeof address !== "string");
    const origin = `http://127.0.0.1:${address.port}`;
    for (const asset of assets) {
      const response = await fetch(`${origin}/${asset}`);
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /^image\//);
      assert.deepEqual(
        Buffer.from(await response.arrayBuffer()),
        readFileSync(path.join(root, "public", asset)),
      );
    }
    for (const url of [
      "/.private/projects.json",
      "/__local-project-assets/austral/captura-17.jpeg",
    ]) {
      const response = await fetch(`${origin}${url}`);
      // SPA fallback may return index.html; it must never return private content.
      assert.ok(!response.headers.get("content-type")?.startsWith("image/"));
      assert.ok(!(await response.text()).includes('"previewOnly"'));
    }
  } finally {
    await server.close();
  }
});
