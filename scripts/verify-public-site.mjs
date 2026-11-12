import assert from "node:assert/strict";
import fs from "node:fs";
import { inspectBuiltHtml } from "./site-assets.mjs";

const origin = process.env.PAGES_URL ?? "https://andres-algarin.github.io/";
const readJson = (file) =>
  JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
const projects = readJson("src/data/additional-projects.json");
const images = [
  ...new Set([
    ...Object.values(readJson("src/data/project-images.json")).map(
      (image) => `projects/ferreinver/${image.file}`,
    ),
    ...projects
      .flatMap((project) => [project.cover, ...project.gallery])
      .flatMap((image) => [image.src, image.originalSrc])
      .filter(Boolean),
  ]),
];
const request = async (url) => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  assert.equal(response.status, 200, `HTTP ${response.status}: ${url}`);
  return response;
};
async function verify() {
  const page = new URL(origin);
  page.searchParams.set(
    "deployment",
    process.env.GITHUB_SHA ?? String(Date.now()),
  );
  const response = await request(page);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/);
  const assets = inspectBuiltHtml(await response.text());
  const mime = {
    javascript: /^(?:text|application)\/(?:javascript|ecmascript)\b/,
    css: /^text\/css\b/,
    svg: /^image\/svg\+xml\b/,
    image: /^image\//,
  };
  const pending = [
    ...assets,
    ...images.map((path) => ({ kind: "image", path })),
  ];
  let index = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (index < pending.length) {
        const asset = pending[index++];
        const url = new URL(asset.path, origin);
        assert.equal(
          url.origin,
          new URL(origin).origin,
          "Unexpected asset origin",
        );
        const result = await request(url);
        assert.match(
          result.headers.get("content-type") ?? "",
          mime[asset.kind],
          `Incorrect MIME: ${url.pathname}`,
        );
        await result.arrayBuffer();
      }
    }),
  );
  console.log(
    `Published site verified: compiled HTML, JavaScript/CSS/favicon MIME types and ${images.length} project images.`,
  );
}
for (let attempt = 1; attempt <= 5; attempt++) {
  try {
    await verify();
    break;
  } catch (error) {
    if (attempt === 5) throw error;
    console.log(
      `Published version not ready (attempt ${attempt}/5): ${error.message}`,
    );
    await new Promise((resolve) => setTimeout(resolve, 8000));
  }
}
