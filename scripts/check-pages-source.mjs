import assert from "node:assert/strict";
const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
assert.ok(repository && token, "Repository and workflow token are required");
const response = await fetch(
  `https://api.github.com/repos/${repository}/pages`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    signal: AbortSignal.timeout(15000),
  },
);
assert.equal(
  response.status,
  200,
  `Cannot read Pages configuration: HTTP ${response.status}`,
);
const pages = await response.json();
assert.equal(
  pages.build_type,
  "workflow",
  "Set Settings > Pages > Source to GitHub Actions. Branch publishing overwrites dist with development HTML.",
);
console.log("GitHub Pages source verified: GitHub Actions.");
