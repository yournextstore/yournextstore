import { ArrowDownRight, ArrowUpRight, LockKeyhole, MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getFeaturedGroup, getSaleOrNewest, getShopCategories, getStoreName } from "@/lib/catalog";
import { editorial } from "@/lib/editorial";
import { YNSMedia } from "@/lib/yns-media";

/** Split hero: serif headline on ivory, an editorial photograph on the right. */
export async function HeroBanner() {
	const [group, categories, storeName] = await Promise.all([
		getFeaturedGroup(),
		getShopCategories(),
		getStoreName(),
	]);
	const chips = categories.slice(0, 4);
	const hero = editorial.hero;

	return (
		<section className="border-b" aria-labelledby="hero-heading">
			<div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.95fr_1.05fr]">
				<div className="flex flex-col justify-between px-6 pt-12 pb-10 sm:px-10 sm:pt-16 lg:px-14 lg:py-16 xl:px-20">
					<div>
						<p className="eyebrow flex items-center gap-3 text-muted-foreground">
							<span className="h-px w-7 bg-current" aria-hidden="true" />A slower kind of everyday
						</p>
						<h1
							id="hero-heading"
							className="mt-7 font-display text-[clamp(3.75rem,6.6vw,6.5rem)] leading-[0.98] tracking-[-0.055em]"
						>
							Less noise.
							<br />
							<span className="italic">More you.</span>
						</h1>
						<p className="mt-7 max-w-sm text-sm leading-7 text-muted-foreground sm:text-base">
							Easy layers. Thoughtful details. Discover everyday pieces that make getting dressed feel a
							little more like you.
						</p>
						<Link
							href="/products"
							className="mt-8 inline-flex min-h-12 items-center justify-between gap-10 bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Explore the collection
							<ArrowUpRight size={17} aria-hidden="true" />
						</Link>
					</div>
					<div className="mt-12 flex items-end justify-between border-t pt-5 lg:mt-14">
						<div>
							<p className="eyebrow text-muted-foreground">The everyday edit</p>
							<p className="mt-2 text-xs">
								{chips.length > 1
									? `${chips
											.slice(0, 3)
											.map((c) => c.name)
											.join(", ")} in natural materials.`
									: "Linen, wool & cotton, cut simply."}
							</p>
						</div>
						<ArrowDownRight size={24} strokeWidth={1} aria-hidden="true" className="shrink-0" />
					</div>
				</div>
				<div className="relative min-h-[380px] overflow-hidden bg-[#dedbd2] sm:min-h-[480px] lg:min-h-[650px]">
					<YNSMedia
						src={hero.src}
						alt={hero.alt}
						fill
						priority
						sizes="(max-width: 1023px) 100vw, 55vw"
						className="object-cover object-[center_40%]"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />
					<span className="eyebrow absolute top-6 right-6 max-w-[calc(100%-3rem)] truncate border border-white/60 px-3 py-2 text-white sm:top-8 sm:right-10">
						{storeName} / The edit
					</span>
					<div className="absolute right-6 bottom-7 left-6 flex items-end justify-between gap-6 text-white sm:right-10 sm:bottom-10 sm:left-10">
						<p className="max-w-[260px] font-display text-3xl leading-tight sm:text-4xl">
							Room for the
							<br />
							things you love.
						</p>
						{group && (
							<Link
								href={group.href}
								className="hidden pb-1 text-right text-xs tracking-[0.15em] uppercase hover:underline sm:block"
							>
								01 — {group.title}
							</Link>
						)}
					</div>
				</div>
			</div>
			{chips.length > 0 && (
				<nav
					aria-label="Shop by category"
					className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-[11px] tracking-[0.13em] uppercase sm:gap-x-14"
				>
					{chips.map((category) => (
						<Link key={category.slug} href={`/category/${category.slug}`} className="collection-link">
							{category.name} <ArrowUpRight size={13} aria-hidden="true" />
						</Link>
					))}
				</nav>
			)}
		</section>
	);
}

/** Half photograph, half olive-tinted panel: one collection (or category) "in focus". */
export async function CollectionStory() {
	const group = (await getFeaturedGroup()) ?? { href: "/products", title: "The edit" };
	const image = editorial.story;

	return (
		<section className="mx-auto grid max-w-[1440px] md:grid-cols-2" aria-labelledby="story-heading">
			<div className="relative min-h-[420px] overflow-hidden bg-muted md:min-h-[600px]">
				<YNSMedia
					src={image.src}
					alt={image.alt}
					fill
					sizes="(max-width: 767px) 100vw, 50vw"
					className="object-cover object-[center_35%]"
				/>
				<span className="eyebrow absolute bottom-6 left-6 max-w-[calc(100%-3rem)] bg-background/95 px-4 py-3 sm:bottom-9 sm:left-10">
					In focus / {group.title}
				</span>
			</div>
			<div className="flex flex-col justify-center bg-story px-6 py-12 sm:px-10 lg:px-20 lg:py-20">
				<p className="eyebrow text-muted-foreground">Wear it your way</p>
				<h2
					id="story-heading"
					className="mt-5 max-w-sm font-display text-5xl leading-[1.06] tracking-[-0.04em] lg:text-6xl"
				>
					A little less.
					<br />
					<span className="italic">A little better.</span>
				</h2>
				<p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
					A favourite piece. The one you reach for every day. Small details that bring a look together. Start
					with what feels like you, and go from there.
				</p>
				<Link
					href={group.href}
					className="collection-link mt-8 w-fit max-w-full border-b border-foreground/40 pb-2 text-sm"
				>
					<span className="min-w-0">Discover {group.title}</span>
					<ArrowUpRight size={16} aria-hidden="true" className="shrink-0" />
				</Link>
			</div>
		</section>
	);
}

/** "The sale edit." — or, with nothing discounted, the two newest arrivals. */
export async function SaleEdit() {
	const { kind, products } = await getSaleOrNewest();
	if (products.length === 0) {
		return null;
	}
	const copy =
		kind === "sale"
			? {
					eyebrow: "Another good find",
					title: "The sale edit.",
					body: "A few familiar favourites, at a little less. Find a finishing touch for your everyday collection.",
					href: "/products?sort=price-asc",
					link: "Explore the edit",
				}
			: {
					eyebrow: "Another good find",
					title: "Just in.",
					body: "The newest pieces in the collection. Find a finishing touch for your everyday wardrobe.",
					href: "/products",
					link: "Explore what’s new",
				};

	return (
		<section className="frame grid gap-9 py-16 md:grid-cols-[0.8fr_1.2fr] md:gap-12 lg:py-24">
			<div className="flex flex-col justify-center">
				<p className="eyebrow text-muted-foreground">{copy.eyebrow}</p>
				<h2 className="mt-4 font-display text-5xl leading-[1.06] tracking-[-0.04em] lg:text-6xl">
					{copy.title}
				</h2>
				<p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">{copy.body}</p>
				<Link
					href={copy.href}
					className="collection-link mt-7 w-fit border-b border-foreground/40 pb-2 text-sm"
				>
					{copy.link} <ArrowUpRight size={16} aria-hidden="true" />
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} sizes="(max-width: 767px) 50vw, 30vw" />
				))}
			</div>
		</section>
	);
}

const signals = [
	{
		icon: ShoppingBag,
		title: "Make yourself at home",
		detail: "Browse the whole collection at your own pace. No account needed.",
	},
	{
		icon: LockKeyhole,
		title: "A secure, simple checkout",
		detail: "Pay with the methods you already use. Totals update as you go.",
	},
	{
		icon: MessageCircle,
		title: "Here when you need us",
		detail: "A question about a piece or an order? We are happy to help.",
	},
];

export function TrustSignals() {
	return (
		<section className="border-t bg-muted/40" aria-label="Shopping with us">
			<div className="frame grid gap-8 py-10 md:grid-cols-3 md:gap-10">
				{signals.map(({ icon: Icon, title, detail }) => (
					<div key={title} className="flex items-start gap-4">
						<Icon className="mt-0.5 shrink-0 text-primary" size={23} strokeWidth={1.25} aria-hidden="true" />
						<div>
							<h2 className="text-xs leading-5 font-medium">{title}</h2>
							<p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
