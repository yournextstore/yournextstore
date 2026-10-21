import { Gem, Gift, Layers, Package, Percent, Shapes, Sparkles, Tag } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";
import {
	ContentSection,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import {
	type CategorySummary,
	getCategorySummaries,
	getProductTotal,
	getStoreDescription,
	getStoreName,
	picturedFirst,
} from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { SECTION_GRID } from "@/lib/grid";

const fadeUp = (delay: number) => ({ animationDelay: `${delay}s` });

export async function HomeHero() {
	const [storeName, storeDescription, total] = await Promise.all([
		getStoreName(),
		getStoreDescription(),
		getProductTotal(),
	]);

	return (
		<PageHeader className="mx-auto items-center gap-2 text-center" withPadding>
			{total > 0 ? (
				<Link
					href="/products"
					className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
					style={fadeUp(0.1)}
				>
					<LogoMark className="size-3.5" />
					{total} {total === 1 ? "product" : "products"} in the shop
				</Link>
			) : null}
			<PageHeaderHeading size="lg" className="animate-fade-up text-balance" style={fadeUp(0.2)}>
				Everything from {storeName}, in one place
			</PageHeaderHeading>
			<PageHeaderDescription className="animate-fade-up" style={fadeUp(0.3)}>
				{storeDescription ??
					"Browse every deck, wheel and bolt by category, or start with the shop picks below."}
			</PageHeaderDescription>
			<div
				className="animate-fade-up flex w-full items-center justify-center gap-4 py-4 md:pb-10"
				style={fadeUp(0.4)}
			>
				<Link
					href="/products"
					className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
				>
					Buy now
				</Link>
				<Link
					href="#categories"
					className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					Browse categories
				</Link>
			</div>
		</PageHeader>
	);
}

function categoryIcon(category: CategorySummary, index: number) {
	const name = category.name.toLowerCase();
	if (/gift|voucher/.test(name)) return Gift;
	if (/outlet|sale|promo/.test(name)) return Percent;
	const cycle = [Shapes, Layers, Sparkles, Gem, Tag];
	return cycle[index % cycle.length] ?? Shapes;
}

const TILE_COLUMNS: Record<number, string> = {
	2: "xs:grid-cols-2",
	3: "xs:grid-cols-2 md:grid-cols-3",
};

/**
 * The original's four category tiles: an icon in a ring, the name and a product count. An
 * "All products" tile closes the row, so a store with three categories still fills four columns.
 */
export async function CategoryTiles() {
	const [categories, total] = await Promise.all([getCategorySummaries(), getProductTotal()]);
	if (categories.length === 0) {
		return null;
	}
	const tiles = [
		...categories.slice(0, 7).map((category, index) => ({
			key: category.id,
			href: `/category/${category.slug}`,
			name: category.name,
			count: category.productCount,
			Icon: categoryIcon(category, index),
		})),
		{ key: "all", href: "/products", name: "All products", count: total, Icon: Package },
	];

	return (
		<section
			id="categories"
			aria-label="Categories"
			className={`animate-fade-up grid scroll-mt-20 grid-cols-1 gap-4 ${TILE_COLUMNS[tiles.length] ?? "xs:grid-cols-2 md:grid-cols-4"}`}
			style={fadeUp(0.5)}
		>
			{tiles.map(({ key, href, name, count, Icon }) => (
				<Link
					key={key}
					href={href}
					className="flex h-full flex-col items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 text-center text-card-foreground transition-colors hover:bg-muted/25"
				>
					<span className="flex size-11 items-center justify-center rounded-full border">
						<Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
					</span>
					<span className="flex flex-col gap-1">
						<span className="font-semibold leading-tight tracking-tight">{name}</span>
						<span className="text-sm text-muted-foreground">
							{count} {count === 1 ? "product" : "products"}
						</span>
					</span>
				</Link>
			))}
		</section>
	);
}

async function getFeaturedProducts() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.productBrowse({ active: true, limit: 24 });
	return picturedFirst(result.data).slice(0, 8);
}

export async function FeaturedProducts() {
	const products = await getFeaturedProducts();
	if (products.length === 0) {
		return null;
	}

	return (
		<ContentSection
			title="Featured products"
			description="What the people behind the counter are riding right now"
			href="/products"
			linkText="View all products"
			className="pt-14 md:pt-20 lg:pt-24"
		>
			<div className={SECTION_GRID}>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</ContentSection>
	);
}

async function getNewArrivals() {
	"use cache";
	cacheLife("minutes");
	const [featured, latest] = await Promise.all([
		getFeaturedProducts(),
		commerce.productBrowse({ active: true, limit: 16, orderBy: "createdAt", orderDirection: "desc" }),
	]);
	const featuredIds = new Set(featured.map((product) => product.id));
	const fresh = picturedFirst(latest.data.filter((product) => !featuredIds.has(product.id)));
	// A full row of four or nothing: a lone card under the featured grid reads as a mistake.
	return fresh.length >= 4 ? fresh.slice(0, 4) : [];
}

/** Where the original listed "Featured stores": a single store has one, so this row shows what is new. */
export async function NewArrivals() {
	const products = await getNewArrivals();
	if (products.length === 0) {
		return null;
	}

	return (
		<ContentSection
			title="New arrivals"
			description="The latest additions to the catalogue"
			href="/products"
			linkText="View all products"
			className="py-14 md:py-20 lg:py-24"
		>
			<div className={SECTION_GRID}>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</ContentSection>
	);
}
