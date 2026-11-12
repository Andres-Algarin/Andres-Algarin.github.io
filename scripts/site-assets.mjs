import assert from "node:assert/strict";

const attribute = (tag, name) =>
  tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1];

export function inspectBuiltHtml(html) {
  assert.ok(!html.includes("%BASE_URL%"), "Unprocessed Vite BASE_URL in HTML");
  assert.ok(
    !html.includes("/src/"),
    "Development source entry in published HTML",
  );
  const assets = [];
  for (const [tag] of html.matchAll(/<script\b[^>]*>/gi)) {
    const src = attribute(tag, "src");
    if (src) {
      assert.equal(attribute(tag, "type"), "module");
      assert.match(src, /^(?:\.\/|\/)?assets\/[^/?]+\.js$/);
      assets.push({ kind: "javascript", path: src });
    }
  }
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = attribute(tag, "rel");
    const href = attribute(tag, "href");
    if (rel === "stylesheet") {
      assert.match(href ?? "", /^(?:\.\/|\/)?assets\/[^/?]+\.css$/);
      assets.push({ kind: "css", path: href });
    } else if (rel?.split(/\s+/).includes("icon")) {
      assert.match(href ?? "", /^(?:\.\/|\/)?favicon\.svg$/);
      assets.push({ kind: "svg", path: href });
    }
  }
  for (const kind of ["javascript", "css", "svg"])
    assert.ok(
      assets.some((asset) => asset.kind === kind),
      `Missing ${kind} reference`,
    );
  return assets;
}
