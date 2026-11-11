import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, cp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join, dirname, basename } from "node:path";
import { spawnSync } from "node:child_process";

test("a public build produces reciprocal language metadata, real contact data and only indexable sitemap URLs", async (t) => {
  const temporaryRoot = resolve(tmpdir());
  const project = await mkdtemp(join(temporaryRoot, "crg-seo-"));
  t.after(async () => {
    assert.equal(dirname(project), temporaryRoot);
    assert.ok(basename(project).startsWith("crg-seo-"));
    await rm(project, { recursive: true, force: true });
  });
  const source = new URL("../", import.meta.url);
  await cp(new URL("build.mjs", source), join(project, "build.mjs"));
  await cp(new URL("src", source), join(project, "src"), { recursive: true });
  await cp(new URL("dist/assets", source), join(project, "dist/assets"), {
    recursive: true,
  });
  const build = spawnSync(process.execPath, ["build.mjs"], {
    cwd: project,
    env: {
      ...process.env,
      SITE_URL: "https://example.test",
      SITE_INDEXABLE: "1",
    },
    encoding: "utf8",
  });
  assert.equal(build.status, 0, build.stderr);
  const pages = (await readdir(join(project, "dist"))).filter((file) =>
    file.endsWith(".html"),
  );
  assert.equal(pages.length, 15);
  for (const file of pages) {
    for (const locale of ["fr", "en"]) {
      const prefix = locale === "en" ? "en/" : "";
      const html = await readFile(join(project, "dist", prefix, file), "utf8");
      const slug = file === "index.html" ? "" : file;
      assert.ok(
        html.includes(
          `rel="canonical" href="https://example.test/${prefix}${slug}"`,
        ),
        file,
      );
      assert.ok(
        html.includes(`hreflang="fr" href="https://example.test/${slug}"`),
        file,
      );
      assert.ok(
        html.includes(`hreflang="en" href="https://example.test/en/${slug}"`),
        file,
      );
      assert.ok(html.includes('href="tel:+33611499153"'), file);
      assert.doesNotMatch(html, /33647742333|06 47 74 23 33/);
      const data = JSON.parse(
        html.match(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
        )[1],
      );
      const page = data["@graph"].find((item) => item["@type"] === "WebPage");
      assert.equal(page.inLanguage, locale);
      const title = html.match(/<title>([^<]+)<\/title>/)[1];
      assert.ok(title.length <= 65, `${file}: title length ${title.length}`);
    }
  }
  const sitemap = await readFile(join(project, "dist/sitemap.xml"), "utf8");
  assert.equal([...sitemap.matchAll(/<url>/g)].length, 24);
  assert.doesNotMatch(
    sitemap,
    /mentions-legales|confidentialite|photographies/,
  );
  assert.match(
    await readFile(join(project, "dist/robots.txt"), "utf8"),
    /Sitemap: https:\/\/example.test\/sitemap.xml/,
  );
});
