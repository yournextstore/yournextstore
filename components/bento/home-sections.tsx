import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/bento/newsletter-form";
import { Reveal } from "@/components/bento/reveal";
import { amberPill, ghostPill, shell } from "@/components/bento/styles";
import { ProductCard } from "@/components/product-card";
import {
	type CategoryTile,
	type getCatalogProducts,
	getStoreBasics,
	HERO_PHOTO,
	inSentence,
} from "@/lib/aqua";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>["products"][number];

function listNames(names: string[]) {
	if (names.length <= 1) return names.join("");
	return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/** Full-bleed hero: a lamp-lit photograph on the right, copy on a left-to-right deep-water fade. */
export function Hero({ categories, total }: { categories: CategoryTile[]; total: number }) {
	const lead = categories[0];
	const named = categories.slice(0, 3).map((category) => inSentence(category.name));
	const intro = named.length
		? `${listNames(named).replace(/^./, (c) => c.toUpperCase())} for planted tanks, chosen on specs instead of marketing.`
		: "Plants, light and stone for planted tanks, chosen on specs instead of marketing.";

	return (
		<section className="relative flex min-h-[92dvh] items-center overflow-hidden">
			<Image
				src={HERO_PHOTO}
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover object-[62%_50%] opacity-70 md:object-[70%_50%] md:opacity-100"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(100deg,#060d0e 0%,rgba(6,13,14,.94) 32%,rgba(6,13,14,.55) 58%,rgba(6,13,14,.12) 100%)",
				}}
			/>
			<div
				aria-hidden="true"
				className="aq-caustic pointer-events-none absolute top-0 -left-1/4 h-full w-3/4"
				style={{ background: "radial-gradient(60% 50% at 50% 30%, rgba(242,169,59,.16), transparent 70%)" }}
			/>

			<div className={cn(shell, "relative pt-24 pb-16")}>
				<div className="max-w-2xl">
					<span className="inline-flex items-center rounded-full border border-amber/30 bg-amber/[0.07] px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-amber uppercase">
						Planted tank supply
					</span>
					<h1 className="mt-7 text-4xl leading-[1.04] font-normal md:text-6xl lg:text-[4.1rem]">
						Grow the tank
						<br />
						you keep <em className="text-amber not-italic">coming back to</em>
						<span className="text-amber">.</span>
					</h1>
					<p className="mt-6 max-w-md text-base leading-relaxed text-[#8a9a9c] md:text-lg">{intro}</p>
					<div className="mt-9 flex flex-wrap items-center gap-3">
						<Link href={lead ? lead.href : "/products"} className={amberPill}>
							Shop {lead ? inSentence(lead.name) : "the catalog"}
							<span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:scale-105">
								<ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
							</span>
						</Link>
						<Link href="/products" className={ghostPill}>
							All {total} products
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

/** Utility strip directly under the hero. */
export async function TrustStrip() {
	const { freeShipping } = await getStoreBasics();
	const items: [string, string][] = [
		freeShipping
			? ["Free shipping", `on orders over ${freeShipping}`]
			: ["Secure checkout", "encrypted, cards & wallets"],
		["Shipping at checkout", "costs shown before you pay"],
		["Real specs", "light, sizes, dimensions"],
		["Questions?", "answers in the FAQ"],
	];
	return (
		<div className="border-y border-line bg-panel">
			<ul className={cn(shell, "grid grid-cols-2 gap-x-6 md:grid-cols-4")}>
				{items.map(([title, detail]) => (
					<li key={title} className="py-6 md:py-7">
						<p className="text-sm font-medium text-bone">{title}</p>
						<p className="mt-1 text-[13px] text-[#8a9a9c]">{detail}</p>
					</li>
				))}
			</ul>
		</div>
	);
}

/**
 * Category bento on a six-column grid: a wide lead tile, then rows of three; a short last row
 * stretches its tiles to close the row instead of leaving a hole.
 */
export function CategoryBento({ tiles }: { tiles: CategoryTile[] }) {
	if (tiles.length === 0) return null;
	const rest = tiles.length - 2;
	const lastRow = rest > 0 ? rest % 3 : 0;
	const spanFor = (index: number) => {
		if (index === 0) return tiles.length === 1 ? "md:col-span-6" : "md:col-span-4";
		if (index === 1) return "md:col-span-2";
		const fromEnd = tiles.length - index;
		if (lastRow === 1 && fromEnd === 1) return "md:col-span-6";
		if (lastRow === 2 && fromEnd <= 2) return "md:col-span-3";
		return "md:col-span-2";
	};

	return (
		<section className={cn(shell, "py-24 md:py-32")}>
			<Reveal>
				<h2 className="max-w-lg text-3xl leading-tight font-normal md:text-5xl">
					Everything a planted tank needs.
				</h2>
			</Reveal>
			<ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
				{tiles.map((tile, index) => (
					<li key={tile.slug} className={spanFor(index)}>
						<Reveal delay={index * 70} className="h-full">
							<Link
								href={tile.href}
								className={cn(
									"group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-line p-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-amber/35",
									index === 0 && "min-h-[320px]",
								)}
							>
								<div className="absolute inset-1.5 overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-panel-2">
									{tile.image ? (
										<YNSMedia
											src={tile.image}
											alt=""
											fill
											sizes={
												index === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 30vw, 100vw"
											}
											className="object-cover brightness-[0.62] saturate-[0.8] transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
										/>
									) : null}
									<div className="absolute inset-0 bg-[#0a2a2c]/35 mix-blend-multiply" />
									<div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/45 to-transparent" />
								</div>
								<div className="relative p-6">
									<h3 className="text-xl font-medium md:text-2xl">{tile.name}</h3>
									<p className="aq-spec mt-1 text-[13px] text-amber">
										{tile.count} {tile.count === 1 ? "product" : "products"}
									</p>
								</div>
							</Link>
						</Reveal>
					</li>
				))}
			</ul>
		</section>
	);
}

/** Editorial split on the raised panel: the pitch on the left, two featured cards on the right. */
export function FeaturedSplit({ products }: { products: CatalogProduct[] }) {
	if (products.length === 0) return null;
	return (
		<section className="border-y border-line bg-panel">
			<div className={cn(shell, "grid items-center gap-12 py-24 md:grid-cols-[0.85fr_1.15fr] md:py-32")}>
				<Reveal>
					<h2 className="text-3xl leading-tight font-normal md:text-5xl">
						Start with the standouts,
						<br />
						not a shopping list.
					</h2>
					<p className="mt-5 max-w-sm text-[#8a9a9c]">
						A couple of products worth a closer look, picked from the whole range. Everything else is one
						click away.
					</p>
					<Link
						href="/products"
						className="mt-8 inline-block text-sm font-medium text-amber underline-offset-4 hover:underline"
					>
						Browse everything
					</Link>
				</Reveal>
				<ul className="grid gap-4 sm:grid-cols-2">
					{products.map((product, index) => (
						<li key={product.id}>
							<Reveal delay={index * 90} className="h-full">
								<ProductCard
									product={product}
									badge={product.type === "bundle" ? "Bundle" : "Featured"}
									heading="h3"
									sizes="(min-width: 768px) 32vw, 90vw"
								/>
							</Reveal>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** Horizontal snap rail of the newest products. */
export function ProductRail({ products }: { products: CatalogProduct[] }) {
	if (products.length === 0) return null;
	return (
		<section className={cn(shell, "py-24 md:py-32")}>
			<div className="mb-12 flex flex-wrap items-end justify-between gap-6">
				<Reveal>
					<h2 className="max-w-md text-3xl leading-tight font-normal md:text-5xl">
						The details that decide everything.
					</h2>
				</Reveal>
				<Link
					href="/products"
					className="text-sm font-medium text-[#a3a3a3] transition-colors hover:text-amber"
				>
					All products
				</Link>
			</div>
			<ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:-mx-12 md:scroll-px-12 md:px-12">
				{products.map((product, index) => (
					<li key={product.id} className="relative w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[27%]">
						<ProductCard
							product={product}
							badge={index === 0 ? "New" : undefined}
							heading="h3"
							sizes="(min-width: 1024px) 27vw, 80vw"
						/>
					</li>
				))}
			</ul>
		</section>
	);
}

/** Centred double-bezel band with the newsletter sign-up. */
export function OfferBand() {
	return (
		<section className={cn(shell, "pb-24 md:pb-32")}>
			<Reveal>
				<div className="rounded-[2rem] border border-line bg-white/[0.02] p-1.5">
					<div className="flex flex-col items-center gap-8 rounded-[calc(2rem-0.375rem)] bg-panel-2 px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:px-16">
						<h2 className="max-w-lg text-3xl leading-tight font-normal md:text-4xl">
							Be first to new arrivals.
						</h2>
						<p className="max-w-md text-[#8a9a9c]">
							New plants, restocks and notes from the shop. No spam, unsubscribe anytime.
						</p>
						<NewsletterForm centered />
					</div>
				</div>
			</Reveal>
		</section>
	);
}
