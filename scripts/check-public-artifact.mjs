import { inspectBuiltHtml } from "./site-assets.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), "Symlink in public artifact");
    assert.ok(
      !/^(\.env(?:\..*)?|\.private|\.git|node_modules)$/i.test(entry.name),
      "Private path in public artifact",
    );
    assert.ok(
      !/\.(pem|key|pfx|sql|sqlite|db)$/i.test(entry.name),
      "Private file in public artifact",
    );
    return entry.isDirectory() ? walk(file) : [file];
  });
const files = walk("dist");
const html = fs.readFileSync("dist/index.html", "utf8");
for (const asset of inspectBuiltHtml(html)) {
  const local = path.join("dist", asset.path.replace(/^(?:\.\/|\/)/, ""));
  assert.ok(fs.existsSync(local), `Missing compiled asset: ${asset.path}`);
}
for (const file of files.filter((file) =>
  /\.(js|html|css|json|txt|md)$/i.test(file),
)) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /gh[pousr]_[A-Za-z0-9]{36,}/,
    /AKIA[0-9A-Z]{16}/,
    /(?:DB_PASSWORD|SMTP_PASS|JWT_SECRET)\s*[=:]\s*["'][^"']+["']/,
  ])
    assert.ok(!pattern.test(text), `Possible credential in ${file}`);
  assert.ok(
    !text.includes("/__local-project-assets/"),
    "Local preview route leaked",
  );
}
console.log(
  `Public artifact checked: ${files.length} files; no private paths or known credential patterns.`,
);
