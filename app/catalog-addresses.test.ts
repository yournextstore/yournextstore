import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

// Products live at /product/<slug> and categories at /category/<slug>, nowhere else. A dynamic segment at
// the root (app/[slug]) turns every address into a guess between a product, a category and a page: each
// view pays for the lookup, the default category view cannot prerender, and links, sitemap and canonicals
// drift apart. Such a route may only redirect old addresses. [locale] is a language prefix, not a slug.
const CATALOGUE_READ =
	/\b(productGet|productBrowse|categoryGet|categoriesBrowse|productPageBody|categoryPageBody)\b|@\/app\/(product|category)\//;
const RENDERS = /<\/|\/>/;

const isDynamic = (name: string) => name.startsWith("[") && name !== "[locale]";
const isGroup = (name: string) => name.startsWith("(") && name.endsWith(")");

const routeFiles = (dir: string): string[] =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory()
			? routeFiles(join(dir, entry.name))
			: /^(page|route)\.tsx?$/.test(entry.name)
				? [join(dir, entry.name)]
				: [],
	);

const rootDynamicRoutes = (dir: string): string[] =>
	readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.flatMap((entry) =>
			isDynamic(entry.name)
				? routeFiles(join(dir, entry.name))
				: isGroup(entry.name)
					? rootDynamicRoutes(join(dir, entry.name))
					: [],
		);

const servesCatalogue = (source: string) => CATALOGUE_READ.test(source) && RENDERS.test(source);

describe("catalogue addresses", () => {
	test("no root route renders a product or a category", () => {
		const offenders = rootDynamicRoutes(import.meta.dir)
			.filter((file) => servesCatalogue(readFileSync(file, "utf8")))
			.map((file) => relative(import.meta.dir, file));
		expect(offenders).toEqual([]);
	});

	test("a root page that renders a catalogue body is caught, one that only redirects is not", () => {
		expect(
			servesCatalogue("const p = await commerce.productGet({ idOrSlug });\nreturn <ProductView p={p} />;"),
		).toBe(true);
		expect(
			servesCatalogue('import { productPageBody } from "@/app/product/[slug]/page";\nreturn <></>;'),
		).toBe(true);
		expect(
			servesCatalogue(
				"const p = await commerce.productGet({ idOrSlug });\nif (p) permanentRedirect(productPath(slug));",
			),
		).toBe(false);
		expect(servesCatalogue("const page = await getLegalPage(slug);\nreturn <LegalPage page={page} />;")).toBe(
			false,
		);
	});
});
