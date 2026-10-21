import { ArrowRight, Bell, Gift, Sparkles } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { SectionHeader, ViewAllLink } from "@/components/section-header";
import { commerce } from "@/lib/commerce";
import { editorial } from "@/lib/editorial";
import {
	getFeaturedCategories,
	getFeaturedGroups,
	getInstagramUrl,
	getProductShots,
	getStoreIdentity,
} from "@/lib/theme";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce
		.productBrowse({ active: true, limit: 16, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	// Editorial rows skip products without a photo (they still list on /products).
	const pictured = result.data.filter(
		(p) => p.images.length > 0 || p.variants.some((v) => (v.images ?? []).length > 0),
	);
	const arrivals = pictured.slice(0, 8);
	const rest = pictured.slice(8);
	// Whole rows of four only, so the grid never ends on a lone card.
	const recommended = rest.length >= 4 ? rest.slice(0, rest.length >= 8 ? 8 : 4) : arrivals.slice(0, 4);
	return { arrivals, recommended };
}

const buttonBase =
	"inline-flex h-14 w-full items-center justify-center gap-2 rounded-md px-8 text-lg font-medium transition-colors md:w-auto";

/** Full-bleed photograph, darkened top and bottom, centred serif headline and two buttons. */
async function Hero() {
	const [groups, identity] = await Promise.all([getFeaturedGroups(), getStoreIdentity()]);
	const shot = editorial.hero;
	const [first, second] = groups;

	return (
		<section className="relative flex h-[82svh] max-h-[880px] min-h-[540px] flex-col justify-center overflow-hidden bg-ink">
			<YNSMedia
				src={shot.src}
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover"
				style={{ objectPosition: shot.position }}
			/>
			<div className="overlay-hero absolute inset-0" />
			<div className="shell relative z-10 flex flex-col items-center text-center text-on-ink">
				<h1 className="max-w-4xl text-5xl leading-[1.05] md:text-6xl lg:text-7xl">New Season Collection</h1>
				<p className="mt-4 max-w-2xl text-lg text-on-ink/90 md:mt-6 md:text-xl">
					{identity.description ??
						"Discover timeless elegance in our latest arrivals. Curated pieces designed for the modern wardrobe."}
				</p>
				<div className="mt-8 flex w-full flex-col gap-4 md:mt-10 md:w-auto md:flex-row">
					<Link
						href={first ? first.href : "/products"}
						className={cn(buttonBase, "bg-white text-foreground hover:bg-white/90")}
					>
						{first ? `Shop ${first.title}` : "Shop New In"}
					</Link>
					<Link
						href={second ? second.href : "/about"}
						className={cn(buttonBase, "border border-white text-white hover:bg-white hover:text-foreground")}
					>
						{second ? `Shop ${second.title}` : "Our Story"}
					</Link>
				</div>
			</div>
		</section>
	);
}

async function NewArrivals() {
	const { arrivals } = await getHomeProducts();
	if (arrivals.length === 0) return null;
	return (
		<section className="py-16 md:py-24">
			<div className="shell">
				<Carousel
					title="New Arrivals"
					subtitle="The latest additions to our collection"
					action={<ViewAllLink href="/products" />}
					label="new arrivals"
				>
					{arrivals.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index < 2} />
					))}
				</Carousel>
			</div>
		</section>
	);
}

/** Four rounded 3:4 tiles on the sand band: the top categories plus "All Products". */
async function ShopByCategory() {
	const categories = await getFeaturedCategories();
	if (categories.length === 0) return null;
	// Up to three categories plus "All Products": 2, 3 or 4 tiles, never a lone one in a row.
	const shown = categories.length === 2 ? categories.slice(0, 1) : categories.slice(0, 3);
	const tiles = [
		...shown.map((c) => ({ href: `/category/${c.slug}`, title: c.name, image: c.image })),
		{ href: "/products", title: "All Products", image: editorial.allProductsTile.src },
	];

	return (
		<section className="bg-sand py-16 md:py-24">
			<div className="shell">
				<SectionHeader
					title="Shop by Category"
					subtitle="Find your perfect piece"
					centered
					className="mb-8 md:mb-12"
				/>
				<ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
					{tiles.map((tile) => (
						<li key={tile.title}>
							<Link
								href={tile.href}
								className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-secondary shadow-card"
							>
								{tile.image && (
									<YNSMedia
										src={tile.image}
										alt=""
										fill
										sizes="(min-width: 1024px) 25vw, 50vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								)}
								<div className="overlay-card absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
								<div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
									<h3 className="font-serif text-xl text-on-ink md:text-2xl">{tile.title}</h3>
									<span className="mt-2 hidden items-center gap-2 text-xs font-medium tracking-wider text-on-ink uppercase opacity-0 transition-all duration-300 group-hover:opacity-100 md:inline-flex">
										Shop now <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** Feature strip: a darkened full-width photograph with a short brand statement and a small light button. */
async function FeatureBand() {
	const shot = editorial.feature;
	return (
		<section className="relative flex min-h-[420px] items-center overflow-hidden bg-ink md:min-h-[480px]">
			<YNSMedia src={shot.src} alt="" fill sizes="100vw" className="object-cover" />
			<div className="absolute inset-0 bg-black/50" />
			<div className="shell relative z-10 flex flex-col items-center py-16 text-center text-on-ink">
				<h2 className="text-4xl leading-tight md:text-5xl">Crafted with Care, Designed to Last</h2>
				<p className="mt-4 max-w-2xl text-base text-on-ink/90 md:text-lg">
					We believe in slow fashion. Every piece is made with premium materials and timeless design.
				</p>
				<Link
					href="/about"
					className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-foreground transition-colors hover:bg-white/90"
				>
					Our Story <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
				</Link>
			</div>
		</section>
	);
}

/**
 * The original's "As featured in" press row, set the same way (pale, widely tracked serif
 * caps, an overline above) but naming the store's own categories instead of invented press.
 */
async function CategoryWordmarks() {
	const [categories, identity] = await Promise.all([getFeaturedCategories(), getStoreIdentity()]);
	if (categories.length < 2) return null;
	return (
		<section className="border-y border-border bg-card py-16 md:py-20">
			<div className="shell">
				<p className="text-center">
					<span className="overline text-muted-foreground">In the collection</span>
				</p>
				<ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:mt-12 md:gap-x-16">
					{categories.slice(0, 6).map((c) => (
						<li key={c.slug}>
							<Link
								href={`/category/${c.slug}`}
								className="font-serif text-2xl tracking-[0.16em] text-[#8f8984] uppercase transition-colors hover:text-foreground md:text-3xl"
							>
								{c.name}
							</Link>
						</li>
					))}
				</ul>
				{identity.description && (
					<blockquote className="mx-auto mt-14 max-w-2xl text-center font-serif text-xl text-[#44403c] italic md:text-2xl">
						&ldquo;{identity.description}&rdquo;
						<cite className="mt-4 block font-sans text-sm text-muted-foreground not-italic">
							— {identity.name}
						</cite>
					</blockquote>
				)}
			</div>
		</section>
	);
}

async function Recommended() {
	const { recommended } = await getHomeProducts();
	if (recommended.length === 0) return null;
	return (
		<section className="py-16 md:py-20">
			<div className="shell">
				<SectionHeader
					title="Recommended For You"
					subtitle="Pieces we think you'll love"
					action={<ViewAllLink href="/products" />}
					className="mb-8 md:mb-12"
				/>
				<ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
					{recommended.map((product) => (
						<li key={product.id}>
							<ProductCard product={product} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** Three tall editorial photographs, each opening one of the store's collections or categories. */
async function Lookbook() {
	const groups = await getFeaturedGroups();
	const tiles = editorial.lookbook.map((photo, i) => ({
		photo,
		href: groups[i]?.href ?? "/products",
		label: groups[i] ? `Shop ${groups[i].title}` : "Shop all",
	}));
	return (
		<section className="pt-4 pb-16 md:pb-24">
			<div className="shell">
				<SectionHeader
					title="The Lookbook"
					subtitle="Get inspired by our latest editorial"
					centered
					className="mb-8 md:mb-12"
				/>
				<ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
					{tiles.map(({ photo, href, label }, i) => (
						<li key={photo.src} className={cn(i > 0 && "max-sm:hidden")}>
							<Link
								href={href}
								className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-secondary"
							>
								<YNSMedia
									src={photo.src}
									alt={photo.alt}
									fill
									sizes="(min-width: 640px) 33vw, 100vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-5 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
									<span className="line-clamp-1">{label}</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** Dark photographic band with the signup form; only when the store runs a newsletter. */
async function NewsletterBand() {
	const identity = await getStoreIdentity();
	if (!identity.newsletterEnabled) return null;
	const shot = editorial.newsletter;
	const perks = [
		{ icon: Gift, label: "Members-only offers" },
		{ icon: Sparkles, label: "Early access" },
		{ icon: Bell, label: "New arrivals first" },
	];
	return (
		<section className="relative overflow-hidden bg-ink py-16 text-on-ink md:py-20">
			<YNSMedia src={shot.src} alt="" fill sizes="100vw" className="object-cover opacity-35" />
			<div className="absolute inset-0 bg-ink/50" />
			<div className="shell relative z-10 text-center">
				<p className="text-xs tracking-[0.12em] text-on-ink/80 uppercase">Stay updated</p>
				<h2 className="mt-3 text-4xl md:text-5xl">Join Our Community</h2>
				<p className="mx-auto mt-4 max-w-2xl text-on-ink/85">
					Get exclusive access to new arrivals, special offers, and style inspiration delivered to your inbox.
				</p>
				<NewsletterForm />
				<ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-on-ink/85">
					{perks.map(({ icon: Icon, label }) => (
						<li key={label} className="flex items-center gap-2">
							<Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
							{label}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** Two full-bleed halves, title and "SHOP NOW" bottom-left: the original's Women / Men split. */
async function SplitPanels() {
	const groups = await getFeaturedGroups();
	const panels = groups.slice(0, 2).map((g, i) => ({ ...g, photo: editorial.panels[i] }));
	if (panels.length < 2) return null;
	return (
		<section className="grid md:grid-cols-2">
			{panels.map((panel) => (
				<Link
					key={panel.href}
					href={panel.href}
					className="group relative flex min-h-[440px] items-end overflow-hidden bg-ink p-8 md:min-h-[640px] md:p-12"
				>
					{panel.photo && (
						<YNSMedia
							src={panel.photo.src}
							alt=""
							fill
							sizes="(min-width: 768px) 50vw, 100vw"
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							style={{ objectPosition: panel.photo.position }}
						/>
					)}
					<div className="overlay-card absolute inset-0" />
					<div className="relative z-10 text-on-ink">
						<h2 className="text-3xl md:text-4xl">{panel.title}</h2>
						<span className="mt-3 inline-flex items-center gap-2 text-sm font-medium tracking-wider uppercase group-hover:underline">
							Shop now <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
						</span>
					</div>
				</Link>
			))}
		</section>
	);
}

/** The original's Instagram row: six rounded squares; here the catalogue's own product photos. */
async function PhotoStrip() {
	const [productShots, instagram] = await Promise.all([getProductShots(), getInstagramUrl()]);
	// Three per row on mobile, six on desktop: show six, or three when the catalogue is small.
	const shots = productShots.slice(0, productShots.length >= 6 ? 6 : 3);
	if (shots.length < 3) return null;
	const handle = instagram ? `@${instagram.replace(/\/+$/, "").split("/").at(-1)}` : null;

	return (
		<section className="bg-card py-16 md:py-24">
			<div className="shell">
				<SectionHeader
					overline={handle ?? "The edit"}
					title={handle ? "Follow Our Journey" : "From the Collection"}
					subtitle={
						handle
							? "Join our community and share your style moments with us"
							: "A closer look at what's new in store"
					}
					centered
					className="mb-8 md:mb-12"
				/>
				<ul
					className={cn(
						"mx-auto grid grid-cols-3 gap-3 md:gap-4",
						shots.length === 6 ? "max-w-6xl md:grid-cols-6" : "max-w-3xl",
					)}
				>
					{shots.map((shot, i) => (
						<li key={`${shot.src}-${i}`}>
							<Link
								href={`/product/${shot.slug}`}
								className="group relative block aspect-square overflow-hidden rounded-lg bg-secondary"
							>
								<YNSMedia
									src={shot.src}
									alt={shot.name}
									fill
									sizes="(min-width: 768px) 16vw, 33vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</Link>
						</li>
					))}
				</ul>
				{instagram && handle && (
					<div className="mt-10 text-center">
						<a
							href={instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex h-10 items-center rounded-md border border-foreground px-5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
						>
							Follow {handle}
						</a>
					</div>
				)}
			</div>
		</section>
	);
}

export async function HomeSections() {
	return (
		<>
			<Hero />
			<NewArrivals />
			<ShopByCategory />
			<FeatureBand />
			<CategoryWordmarks />
			<Recommended />
			<Lookbook />
			<NewsletterBand />
			<SplitPanels />
			<PhotoStrip />
		</>
	);
}
