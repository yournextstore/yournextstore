import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
	EDITORIAL,
	firstStill,
	getCatalogProducts,
	getCategories,
	getCollections,
	pad2,
	productPriceLabel,
} from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export async function Hero() {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([getCategories(), getCatalogProducts()]);
	const image = EDITORIAL.hero;
	const groups = categories.filter((c) => c.count > 0).length;

	return (
		<section className="shell grid items-center gap-x-12 gap-y-10 pb-4 pt-8 md:grid-cols-12 md:pb-10 md:pt-12">
			<div className="hero-in md:col-span-5">
				<h1 className="type-hero">Solid wood furniture, made slowly by hand</h1>
				<p className="type-lead mt-7 max-w-[42ch]">
					A small catalogue of seating, tables and storage in solid oak, ash and walnut, cut, joined and
					finished by hand in our workshop.
				</p>
				<div className="mt-9 flex flex-wrap gap-3">
					<Link href="/products" className="btn btn-primary">
						Browse the catalogue
					</Link>
					<Link href="/about" className="btn btn-outline">
						The workshop
					</Link>
				</div>
			</div>

			{image && (
				<figure className="hero-in md:col-span-7" style={delay(120)}>
					<Link
						href="/products"
						className="relative block aspect-[4/3] overflow-hidden bg-surface md:aspect-[8/7]"
					>
						<YNSMedia
							src={image.src}
							alt=""
							fill
							priority
							sizes="(max-width: 768px) 100vw, 58vw"
							className="parallax object-cover"
						/>
					</Link>
					<figcaption className="mono mt-3 flex justify-between gap-4 text-[0.625rem] uppercase tracking-[0.05em] text-muted-foreground">
						<span className="min-w-0 truncate">No. 01 — {image.caption}</span>
						<span className="shrink-0">
							{groups > 0 ? `${pad2(groups)} categories · ` : ""}
							{pad2(products.length)} pieces
						</span>
					</figcaption>
				</figure>
			)}
		</section>
	);
}

export async function SpecBand({ className = "mt-14 md:mt-20" }: { className?: string }) {
	"use cache";
	cacheLife("minutes");
	const [products, categories, collections, config] = await Promise.all([
		getCatalogProducts(),
		getCategories(),
		getCollections(),
		getStoreConfig(),
	]);
	const lowest = products
		.filter((p) => p.variants?.length)
		.map((p) => priceRange(p.variants, config.taxBehavior).min)
		// Free variants (a 0 set price) would read "From $0".
		.filter((price) => price > 0n)
		.reduce<bigint | null>((min, price) => (min === null || price < min ? price : min), null);

	const facts = [
		{ label: "Pieces", value: pad2(products.length) },
		{ label: "Categories", value: pad2(categories.filter((c) => c.count > 0).length) },
		{ label: "Collections", value: pad2(collections.length) },
		{
			label: "From",
			value:
				lowest === null
					? "—"
					: formatMoney({ amount: lowest, currency: config.currency, locale: config.locale }),
		},
	];

	return (
		<div className={`border-y border-border ${className}`}>
			<dl className="shell grid grid-cols-2 md:grid-cols-4">
				{facts.map((fact, index) => (
					<div key={fact.label} className="fact" data-reveal style={delay(index * 70)}>
						<dt className="label">{fact.label}</dt>
						<dd className="mt-2.5 text-2xl font-medium tracking-[-0.03em] md:text-3xl">{fact.value}</dd>
					</div>
				))}
			</dl>
		</div>
	);
}

export async function FeaturedPieces() {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	// Single pieces read best in the three-up; bundles fill in only when there are too few.
	const featured = [
		...products.filter((p) => p.type !== "bundle"),
		...products.filter((p) => p.type === "bundle"),
	]
		.filter((p) => firstStill(p.images) && p.variants.some((v) => Number(v.price) > 0))
		.slice(0, 3);
	if (featured.length === 0) return null;

	return (
		<section className="shell mt-24 md:mt-36">
			<div className="rule" data-reveal="line" />
			<div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4" data-reveal>
				<h2 className="type-h2 max-w-[14ch]">A few pieces from the bench</h2>
				<Link href="/products" className="link link-mono pb-1.5 text-muted-foreground">
					All {pad2(products.length)} pieces
				</Link>
			</div>
			<div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-14 md:grid-cols-3">
				{featured.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						index={index}
						headingLevel="h3"
						revealDelay={index * 110}
					/>
				))}
			</div>
		</section>
	);
}

export async function SoloPiece() {
	"use cache";
	cacheLife("minutes");
	const [products, config] = await Promise.all([getCatalogProducts(), getStoreConfig()]);
	// The most considered single piece in the catalogue gets the page to itself.
	const solo = products
		.filter((p) => p.type !== "bundle" && p.variants?.length && firstStill(p.images))
		.map((p) => ({ product: p, price: priceRange(p.variants, config.taxBehavior).max }))
		.sort((a, b) => (b.price > a.price ? 1 : b.price < a.price ? -1 : 0))[0]?.product;
	if (!solo) return null;
	const image = firstStill(solo.images);
	if (!image) return null;

	const colours = [
		...new Set(
			solo.variants.flatMap((v) =>
				"combinations" in v ? v.combinations.map((c) => c.variantValue.value) : [],
			),
		),
	];
	const inStock = solo.variants.some((v) => v.stock === null || v.stock > 0);
	const specs = [
		["Category", solo.category?.name ?? "—"],
		["Options", colours.length > 0 ? colours.join(" / ") : "One finish"],
		["Availability", inStock ? "In stock" : "Sold out"],
		["From", (await productPriceLabel(solo))?.replace(/^From /, "") ?? "—"],
	];

	return (
		<section className="mt-24 md:mt-36">
			<div className="shell grid items-center gap-10 md:grid-cols-12 md:gap-12">
				<div className="md:col-span-7 lg:col-span-8">
					<Link
						href={`/product/${solo.slug}`}
						className="group block overflow-hidden bg-surface"
						data-reveal="mask"
						aria-label={solo.name}
					>
						<div className="relative aspect-[5/4] md:aspect-[16/11]">
							<YNSMedia
								src={image}
								alt=""
								fill
								sizes="(max-width: 768px) 100vw, 66vw"
								className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
							/>
						</div>
					</Link>
				</div>

				<div className="md:col-span-5 lg:col-span-4" data-reveal style={delay(140)}>
					<h2 className="type-h2">{solo.name}</h2>
					<p className="type-body mt-6 max-w-[44ch]">
						{solo.summary ||
							"Built around a single idea and nothing extra: solid timber, honest joints and a hand-rubbed finish."}
					</p>
					<dl className="mono mt-9 border-t border-border text-[0.8125rem]">
						{specs.map(([term, value]) => (
							<div key={term} className="flex justify-between gap-6 border-b border-border py-3">
								<dt className="text-muted-foreground">{term}</dt>
								<dd className="text-right">{value}</dd>
							</div>
						))}
					</dl>
					<Link href={`/product/${solo.slug}`} className="btn btn-primary mt-9">
						See the piece
					</Link>
				</div>
			</div>
		</section>
	);
}

export async function Rooms() {
	"use cache";
	cacheLife("minutes");
	const categories = (await getCategories()).filter((c) => c.count > 0).slice(0, 4);
	if (categories.length === 0) return null;

	return (
		<section className="shell mt-24 md:mt-36">
			<div className="rule" data-reveal="line" />
			<h2 className="type-h2 mt-8 max-w-[18ch]" data-reveal>
				We make a few kinds of furniture, and know them well
			</h2>
			<div
				className={`mt-12 grid gap-x-8 gap-y-12 ${categories.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}
			>
				{categories.map((category, index) => (
					<Link
						key={category.id}
						href={`/category/${category.slug}`}
						className="group block border-t border-border pt-6 transition-colors hover:border-walnut"
						data-reveal
						style={delay(index * 110)}
					>
						<h3 className="type-h3 transition-colors group-hover:text-walnut">{category.name}</h3>
						<p className="label mt-3">
							{pad2(category.count)} {category.count === 1 ? "piece" : "pieces"}
						</p>
						<p className="type-body mt-4 text-[0.9375rem]">
							{category.description || `Every piece in ${category.name.toLowerCase()}, in one place.`}
						</p>
					</Link>
				))}
			</div>
		</section>
	);
}
