import { ArrowRight, Check } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import {
	ButtonLink,
	Chip,
	SectionHead,
	ShowcaseTile,
	Stage,
	TextLink,
	tileGridClass,
} from "@/components/deckle";
import { ProductCard } from "@/components/product-card";
import {
	firstStill,
	getCatalogProducts,
	getCategoryTiles,
	getCollectionTiles,
	getFeaturedCollection,
	getStoreBrand,
	pieces,
} from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { picturedFirst } from "@/lib/pictured";
import { type PricedVariant, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";

type Variants = readonly PricedVariant[];

async function lowestPrice(variantSets: Variants[]) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const lows = variantSets.filter((v) => v.length > 0).map((v) => priceRange(v, taxBehavior).min);
	if (lows.length === 0) return null;
	// Money is bigint: compare with `<`, never Math.min.
	const min = lows.reduce((lowest, price) => {
		if (price < lowest) return price;
		return lowest;
	});
	return formatMoney({ amount: min, currency, locale });
}

/** What the shop is, beside its newest piece on the stage. */
export async function HomeHero() {
	"use cache";
	cacheLife("minutes");
	const [{ products, total }, categories, brand] = await Promise.all([
		getCatalogProducts(),
		getCategoryTiles(),
		getStoreBrand(),
	]);
	const { taxBehavior } = await getStoreConfig();
	// The newest pictured piece with a price: a free or unpriced item would print "$0.00" on the stage.
	const lead =
		products.find(
			(p) => firstStill(p.images) && p.variants.length > 0 && priceRange(p.variants, taxBehavior).min > 0,
		) ?? products.find((p) => firstStill(p.images));
	const leadImage = firstStill(lead?.images);
	const leadPrice = lead ? await lowestPrice([lead.variants]) : null;
	const first = categories[0]?.name;
	const last = categories.at(-1)?.name;
	const range =
		first && last && first !== last ? `, from ${first.toLowerCase()} to ${last.toLowerCase()}` : "";

	return (
		<section aria-labelledby="home-title" className="band">
			<div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
				<div className="grid justify-items-start gap-6">
					<h1 id="home-title" className="text-title-1 text-balance lg:text-title-display">
						Things worth keeping, shown the way they are made
					</h1>
					<p className="max-w-[46ch] text-lg text-muted-foreground">
						{brand.description ||
							`${pieces(total)} in the ${brand.name} shop${range}. Each one photographed as it is and priced plainly, so what arrives is what you saw.`}
					</p>
					<div className="flex flex-wrap items-center gap-6">
						<ButtonLink href="/products" icon={<ArrowRight aria-hidden="true" className="size-4" />}>
							Browse the shop
						</ButtonLink>
						<TextLink href="/collections">See the collections</TextLink>
					</div>
				</div>
				{lead && leadImage && (
					<Stage
						src={leadImage}
						alt={lead.name}
						caption={leadPrice ? `${lead.name} · ${leadPrice}` : lead.name}
						priority
					/>
				)}
			</div>
		</section>
	);
}

/** The featured collection in the copper dark, counted out like a numbered edition. */
export async function FeaturedCollectionBand() {
	"use cache";
	cacheLife("minutes");
	const [featured, { products }, categories] = await Promise.all([
		getFeaturedCollection(),
		getCatalogProducts(),
		getCategoryTiles(),
	]);
	if (!featured) return null;

	const collection = await commerce.collectionGet({ idOrSlug: featured.slug }).catch(() => null);
	const memberIds = new Set(collection?.productCollections.map((pc) => pc.productId) ?? []);
	const members = products.filter((p) => memberIds.has(p.id));
	const from = await lowestPrice(members.map((p) => p.variants));
	const categoryCount = categories.filter((c) => members.some((p) => p.category?.id === c.id)).length;
	const counters = [
		{ value: String(featured.count), unit: featured.count === 1 ? "piece" : "pieces" },
		...(categoryCount > 0
			? [{ value: String(categoryCount), unit: categoryCount === 1 ? "category" : "categories" }]
			: []),
		...(from ? [{ value: from, unit: "from" }] : []),
	];

	return (
		<section aria-labelledby="featured-title" className="band bg-feature text-on-feature">
			<div className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
				<div className="grid justify-items-start gap-6">
					<Chip tone="accent">Featured collection</Chip>
					<h2 id="featured-title" className="text-title-2 text-balance lg:text-title-1">
						{featured.count > 1 ? `${featured.name}, in ${featured.count} pieces` : featured.name}
					</h2>
					<p className="max-w-[52ch]">
						{featured.description &&
						featured.description.toLowerCase() !== `${featured.name} collection`.toLowerCase()
							? featured.description
							: `A collection put together to sit side by side. Take one piece home, or the whole set, while it is in the shop.`}
					</p>
					<ul aria-label="The collection in numbers" className="flex flex-wrap gap-3">
						{counters.map((counter) => (
							<li
								key={counter.unit}
								className="grid min-w-[5.5rem] justify-items-center gap-2 rounded-control border border-white/20 px-4 py-4"
							>
								<span className="text-[2.5rem] font-semibold leading-none tracking-[-0.03em] lg:text-numeral">
									{counter.value}
								</span>
								<span className="text-sm">{counter.unit}</span>
							</li>
						))}
					</ul>
					<div className="flex flex-wrap items-center gap-6">
						<ButtonLink href={featured.href} variant="accent">
							See the collection
						</ButtonLink>
						<TextLink href="/collections" tone="onFeature" arrow>
							Every collection
						</TextLink>
					</div>
				</div>
				<Stage
					src="/images/pexels/featured-press.jpg"
					alt=""
					caption={featured.name}
					tone="feature"
					className="lg:aspect-[5/6]"
				/>
			</div>
		</section>
	);
}

/** The newest pieces, four across. */
export async function NewPieces() {
	"use cache";
	cacheLife("minutes");
	const { products: all, total } = await getCatalogProducts();
	// Pictured pieces first, and an even count so the four-up grid never ends on a lone card.
	const picked = picturedFirst(all).slice(0, 8);
	const products = picked.length > 1 && picked.length % 2 ? picked.slice(0, -1) : picked;
	if (products.length === 0) return null;

	return (
		<section aria-labelledby="new-title" className="band">
			<SectionHead
				id="new-title"
				title="New in the shop"
				action={
					<TextLink href="/products" arrow>
						See all {total} products
					</TextLink>
				}
			/>
			<ul className={tileGridClass}>
				{products.map((product) => (
					<li key={product.id}>
						<ProductCard product={product} />
					</li>
				))}
			</ul>
		</section>
	);
}

/** The categories as the original sets its size table: a tick, a name, how many, where to go. */
export async function CategoryBand() {
	"use cache";
	cacheLife("minutes");
	const categories = await getCategoryTiles(8);
	const pictured = categories.find((c) => c.image);
	if (categories.length === 0) return null;

	return (
		<section aria-labelledby="categories-title" className="band bg-band">
			<div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
				<div className="grid justify-items-start gap-6">
					<h2 id="categories-title" className="text-title-2 text-balance">
						Where to start
					</h2>
					<p className="max-w-[52ch] text-muted-foreground">
						The shop sorted the way you would look for it, with how many pieces each category holds.
					</p>
					<ul className="grid w-full max-w-[26rem] gap-2">
						{categories.map((category) => (
							<li key={category.id}>
								<Link
									href={category.href}
									className="group grid grid-cols-[1.25rem_minmax(0,1fr)_auto_1rem] items-center gap-3 border-b border-border py-2"
								>
									<Check aria-hidden="true" className="size-4 text-copper" />
									<strong className="truncate font-semibold group-hover:underline group-hover:underline-offset-4">
										{category.name}
									</strong>
									<span className="text-muted-foreground">{pieces(category.count)}</span>
									<ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
								</Link>
							</li>
						))}
					</ul>
					<TextLink href="/products" arrow>
						Browse everything
					</TextLink>
				</div>
				{pictured?.image && <CategoryWall tiles={categories.filter((c) => c.image).slice(0, 3)} />}
			</div>
		</section>
	);
}

/** Three category pictures hung on the wall at stepped sizes, as the original hangs a print at each paper size. */
function CategoryWall({ tiles }: { tiles: Awaited<ReturnType<typeof getCategoryTiles>> }) {
	const grow = ["flex-[2]", "flex-[3]", "flex-[4]"];
	return (
		<div aria-hidden="true" className="flex items-end gap-3 sm:gap-5">
			{tiles.map((tile, index) => (
				<div key={tile.id} className={`grid min-w-0 gap-2 ${grow[index + (3 - tiles.length)] ?? "flex-1"}`}>
					<div className="relative aspect-[4/5] w-full border border-copper bg-background p-[8%]">
						<div className="relative size-full">
							{tile.image && (
								<YNSMedia
									src={tile.image}
									alt=""
									fill
									sizes="(max-width: 1024px) 33vw, 20vw"
									className="object-cover"
								/>
							)}
						</div>
					</div>
					<span className="truncate text-xs font-semibold text-copper-ink sm:text-sm">{tile.name}</span>
				</div>
			))}
		</div>
	);
}

/** Collections, three across. */
export async function CollectionsBand() {
	"use cache";
	cacheLife("minutes");
	const tiles = await getCollectionTiles(3);
	// One collection is already the featured band above; a lone tile here would only repeat it.
	if (tiles.length < 2) return null;

	return (
		<section aria-labelledby="collections-title" className="band">
			<SectionHead
				id="collections-title"
				title="Collections"
				action={
					<TextLink href="/collections" arrow>
						Every collection
					</TextLink>
				}
			/>
			<ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-6">
				{tiles.map((tile) => (
					<li key={tile.id}>
						<ShowcaseTile
							href={tile.href}
							image={tile.image}
							title={tile.name}
							meta={pieces(tile.count)}
							sizes="(max-width: 1024px) 50vw, 33vw"
						/>
					</li>
				))}
			</ul>
		</section>
	);
}

/** The latest stories, when the store keeps a blog. */
export async function JournalBand() {
	"use cache";
	cacheLife("minutes");
	const brand = await getStoreBrand();
	if (!brand.blog) return null;
	const { data: posts } = await commerce.postBrowse({ active: true, limit: 3 }).catch(() => ({ data: [] }));
	if (posts.length === 0) return null;

	return (
		<section aria-labelledby="journal-title" className="band bg-band">
			<SectionHead
				id="journal-title"
				title="From the journal"
				action={
					<TextLink href="/blog" arrow>
						Every story
					</TextLink>
				}
			/>
			<ul className="grid gap-12 lg:grid-cols-3 lg:gap-8">
				{posts.map((post) => (
					<li key={post.id}>
						<Link href={`/blog/${post.slug}`} className="group grid content-start gap-2">
							<span className="relative mb-3 block aspect-[4/3] overflow-hidden rounded-frame bg-stage">
								{post.image && (
									<YNSMedia
										src={post.image}
										alt=""
										fill
										sizes="(max-width: 1024px) 100vw, 33vw"
										className="object-cover"
									/>
								)}
							</span>
							{post.tag && <span className="text-[0.8125rem] font-semibold text-copper-ink">{post.tag}</span>}
							<h3 className="text-title-3 group-hover:underline group-hover:underline-offset-4">
								{post.title}
							</h3>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
