import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { CollectionTabs, type TabItem } from "@/components/collection-tabs";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { getCatalogProducts, getCategoryTiles, getEditorialImages, getStoreBrand, pick } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Coral kicker, then a Playfair display heading whose italic words turn coral; copy to the right on desktop. */
export function SectionHeader({
	eyebrow,
	title,
	copy,
	as: Heading = "h2",
	className,
}: {
	eyebrow: string;
	title: React.ReactNode;
	copy?: React.ReactNode;
	as?: "h1" | "h2";
	className?: string;
}) {
	return (
		<div className={cn("gap-8 md:flex md:items-end md:justify-between", className)}>
			<div className="min-w-0">
				<p className="eyebrow mb-5">{eyebrow}</p>
				<Heading className="type-display wrap-break-word text-[clamp(2.7rem,5vw,4.2rem)]">{title}</Heading>
			</div>
			{copy && (
				<p className="mt-[18px] max-w-[320px] shrink-0 text-[0.82rem] leading-[1.8] text-muted-foreground md:mt-0">
					{copy}
				</p>
			)}
		</div>
	);
}

/** Sage-to-cream panel: copy, a rounded photograph with the rotated coral badge, and a narrow meta column. */
export async function HomeHero() {
	"use cache";
	cacheLife("minutes");
	const images = await getEditorialImages();
	const image = pick(images, 0);

	return (
		<section className="mx-auto grid min-h-[620px] max-w-[1280px] items-center gap-8 overflow-hidden bg-[linear-gradient(90deg,#edf2e7_0%,#f1eae3_100%)] px-[22px] pb-[34px] pt-10 lg:grid-cols-[1fr_1.1fr_80px] lg:px-12 lg:pb-[42px] lg:pt-[70px]">
			<div className="relative z-10 max-w-[520px] lg:pl-8">
				<p className="eyebrow mb-5">Fresh flowers, hand-tied</p>
				<h1 className="type-display text-[3.2rem] sm:text-[clamp(3.8rem,6vw,6.5rem)]">
					Make their day
					<br />
					<i>bloom.</i>
				</h1>
				<p className="mb-9 mt-[26px] max-w-[380px] text-[1.03rem] leading-[1.7] text-muted-foreground">
					Seasonal bouquets, dried flowers and easy houseplants, for a birthday, a thank-you or simply your
					own kitchen table.
				</p>
				<Link href="/products" className="btn-pill">
					Shop the collection <ArrowUpRight className="size-4" aria-hidden="true" />
				</Link>
			</div>
			<div className="relative h-[420px] lg:h-[500px]">
				<div className="relative h-full overflow-hidden rounded-tile bg-cream shadow-photo">
					{image && (
						<YNSMedia
							src={image}
							alt=""
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 600px"
							className="object-cover"
						/>
					)}
				</div>
				<div
					aria-hidden="true"
					className="serif absolute -right-2 top-[18px] flex size-[120px] rotate-[10deg] items-center justify-center rounded-full bg-coral-deep text-center text-[0.92rem] italic leading-[1.1] text-white lg:-right-[26px]"
				>
					new
					<br />
					this
					<br />
					season
				</div>
			</div>
			<p className="caps hidden self-end pb-[18px] text-center text-[0.64rem] leading-[2] tracking-[0.12em] text-muted-foreground lg:block">
				Tied
				<br />
				<span aria-hidden="true" className="text-[1.3rem] text-coral">
					✦
				</span>
				<br />
				with care
			</p>
		</section>
	);
}

const PROMISES = [
	{ title: "Seasonal stems", line: "Whatever is best this week" },
	{ title: "Hand-tied", line: "Wrapped in kraft paper" },
	{ title: "Secure checkout", line: "Delivery options at checkout" },
];

/** The numbered value strip under the hero. */
export function PromiseRow() {
	return (
		<ul className="mx-5 grid max-w-[1180px] border-y border-line py-5 sm:grid-cols-3 xl:mx-auto">
			{PROMISES.map((promise, index) => (
				<li
					key={promise.title}
					className="flex items-center gap-[18px] border-line py-3.5 not-last:border-b sm:justify-center sm:py-0 sm:not-last:border-b-0 sm:not-last:border-r"
				>
					<span aria-hidden="true" className="serif text-[1.7rem] font-semibold text-coral-text">
						{String(index + 1).padStart(2, "0")}
					</span>
					<p className="text-[0.7rem] leading-[1.7] text-muted-foreground">
						<b className="font-bold text-ink">{promise.title}</b>
						<br />
						{promise.line}
					</p>
				</li>
			))}
		</ul>
	);
}

const GRID_LIMIT = 6;

/** "Shop the collection": header, category tabs and the grid, as the original's single-page shop. */
export async function ShopCollection() {
	"use cache";
	cacheLife("minutes");
	const [{ products }, categories] = await Promise.all([getCatalogProducts(), getCategoryTiles(4)]);
	const tabs = [{ id: "all", label: "Everything" }, ...categories.map((c) => ({ id: c.id, label: c.name }))];
	const shown = products.filter((product, index) => {
		if (index < GRID_LIMIT) return true;
		const id = product.category?.id;
		if (!id || !categories.some((c) => c.id === id)) return false;
		return products.slice(0, index).filter((p) => p.category?.id === id).length < GRID_LIMIT;
	});
	const lead = new Set(products.slice(0, GRID_LIMIT).map((p) => p.id));
	const items: TabItem[] = shown.map((product) => ({
		key: product.id,
		tabs: [...(lead.has(product.id) ? ["all"] : []), ...(product.category ? [product.category.id] : [])],
		node: <ProductCard product={product} />,
	}));

	return (
		<section id="shop" className="container-x scroll-mt-6 py-[100px]">
			<SectionHeader
				eyebrow="Find the right flowers"
				title={
					<>
						Shop the <i>collection</i>
					</>
				}
				copy="Choose something for the moment, from a small posy to a generous seasonal bunch."
			/>
			<CollectionTabs tabs={tabs} items={items} limit={GRID_LIMIT} />
			<div className="mt-12 text-center">
				<Link href="/products" className="link-underline">
					See everything <span aria-hidden="true">→</span>
				</Link>
			</div>
		</section>
	);
}

/** Cream band: a photograph beside "like a memory." copy and a coral underlined link. */
export async function StoryBand({ cta = true }: { cta?: boolean }) {
	"use cache";
	cacheLife("minutes");
	const images = await getEditorialImages();
	const image = pick(images, 1);

	return (
		<section
			id="story"
			className="items-center gap-[60px] bg-cream px-5 py-20 md:grid md:grid-cols-2 md:px-[clamp(20px,5vw,80px)] md:py-[90px]"
		>
			<div className="relative mb-[30px] h-[360px] overflow-hidden bg-paper md:mb-0 md:h-[500px]">
				{image && (
					<YNSMedia src={image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
				)}
			</div>
			<div className="max-w-[470px]">
				<p className="eyebrow mb-5">From our workbench</p>
				<h2 className="type-display mb-[18px] text-[clamp(2.5rem,5vw,4.2rem)]">
					Flowers should
					<br />
					<i>feel picked for you.</i>
				</h2>
				<p className="mb-[30px] text-[0.98rem] leading-[1.9] text-muted-foreground">
					Every bouquet starts with what is in season, then gets tied by hand with the colours and greenery
					that suit the moment.
				</p>
				{cta && (
					<Link href="/about" className="link-underline">
						Get to know us <span aria-hidden="true">→</span>
					</Link>
				)}
			</div>
		</section>
	);
}

/** Coral band: "Good things are growing." over the sign-up form. */
export async function NewsletterBand() {
	"use cache";
	cacheLife("hours");
	const brand = await getStoreBrand();

	return (
		<section className="bg-coral-deep px-5 pb-[90px] pt-[82px] text-center text-[#fffaf8]">
			<p className="eyebrow mb-5 text-white">A note from the studio</p>
			<h2 className="type-display text-[clamp(2.7rem,5vw,4.6rem)] [&_i]:text-[#ffe3d8]">
				Good things are <i>coming.</i>
			</h2>
			<p className="mx-auto mb-[30px] mt-[18px] max-w-[430px] text-[0.9rem] text-white">
				Join the {brand.name} list for seasonal flowers, care tips and first looks at what is new.
			</p>
			<NewsletterForm />
		</section>
	);
}
