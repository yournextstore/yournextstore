import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Shelf } from "@/components/shelf";
import { getHomeData } from "@/lib/catalog";
import { BANNER_IMAGE, HERO_IMAGE } from "@/lib/editorial";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export const outlineCta =
	"inline-block border border-white px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#0a0a0a]";
export const textCta =
	"inline-block px-2 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/75 underline decoration-white/30 underline-offset-4 transition hover:text-white";

/** Moody full-bleed hero: dimmed photograph, centred uppercase heading; the tiles overlap its foot. */
export function Hero() {
	return (
		<section
			data-hero
			className="relative grid min-h-[80vh] place-items-center overflow-hidden bg-background px-5 pt-[160px] pb-[220px] text-center"
		>
			<YNSMedia src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
			<div
				aria-hidden
				className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-black/40"
			/>
			<div className="relative max-w-3xl text-white">
				<h1 className="font-display text-[clamp(30px,6vw,72px)] font-bold uppercase leading-[1.05] tracking-[0.04em]">
					Dark roast, quietly done.
				</h1>
				<p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-white/80">
					Small-batch coffee roasted dark, and the black brewing gear to make it well at home, from the first
					espresso to the last cup of the night.
				</p>
				<div className="mt-9 flex flex-wrap items-center justify-center gap-5">
					<Link href="/products" className={outlineCta}>
						Shop the coffee
					</Link>
					<Link href="/about" className={textCta}>
						Our story
					</Link>
				</div>
			</div>
		</section>
	);
}

/** Six tiles in three columns, the middle column dropped by a quarter (the style-book offset). */
export async function CategoryTiles() {
	const { tiles } = await getHomeData();

	return (
		<section aria-label="Shop by category" className="shell relative z-10 -mt-[190px]">
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
				{tiles.map((tile, i) => (
					<Link
						key={tile.href}
						href={tile.href}
						className={cn(
							"group relative block overflow-hidden border border-white/10 bg-card transition-colors duration-200 hover:border-white",
							i % 3 === 1 && "sm:translate-y-1/4",
						)}
					>
						<div className="relative aspect-4/3">
							{tile.image && (
								<YNSMedia
									src={tile.image}
									alt=""
									fill
									priority={i < 3}
									sizes="(max-width: 640px) 100vw, 360px"
									className="object-cover opacity-80 brightness-[.85] transition duration-500 group-hover:opacity-100 group-hover:brightness-100"
								/>
							)}
						</div>
						<div
							aria-hidden
							className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent"
						/>
						<div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 p-5 text-white">
							<h2 className="min-w-0 truncate text-[17px] font-semibold uppercase tracking-[0.14em]">
								{tile.title}
							</h2>
							<span className="shrink-0 text-[12px] tracking-[0.12em] text-white/80">
								{tile.count} {tile.count === 1 ? "item" : "items"}
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}

/** One slider per featured collection, with an outlined "all" button under it. */
export async function Shelves() {
	const { shelves } = await getHomeData();

	return shelves.map((shelf, i) => (
		<section key={shelf.href + shelf.title} className={cn("shell", i === 0 ? "pt-[120px]" : "pt-20")}>
			<Shelf eyebrow={shelf.eyebrow} title={shelf.title}>
				{shelf.products.map((product) => (
					<div
						key={product.id}
						className="w-[260px] shrink-0 snap-start sm:w-[calc((100%-40px)/3)] sm:min-w-[260px]"
					>
						<ProductCard product={product} sizes="(max-width: 640px) 260px, 360px" />
					</div>
				))}
			</Shelf>
			<div className="mt-7 text-center">
				<Link
					href={shelf.href}
					className="inline-block border border-white/30 px-8 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition hover:border-white"
				>
					{shelf.allLabel}
				</Link>
			</div>
		</section>
	));
}

/** Fixed white band: icon larger than the title, vertical separators on desktop. */
export async function Services() {
	const [{ freeShippingThreshold }, { currency, locale }] = await Promise.all([
		getHomeData(),
		getStoreConfig(),
	]);
	const services = [
		{
			title: freeShippingThreshold ? "Free delivery" : "Delivery",
			text: freeShippingThreshold
				? `Free on every order over ${formatMoney({ amount: BigInt(freeShippingThreshold), currency, locale })}.`
				: "Delivery options and costs are shown at checkout, before you pay.",
			paths: [
				"M1 5h14v12H1z",
				"M15 9h4l3 3v5h-7z",
				"M6 19a1.6 1.6 0 1 0 0-.01",
				"M18 19a1.6 1.6 0 1 0 0-.01",
			],
		},
		{
			title: "Order updates",
			text: "A confirmation by email as soon as your order is placed.",
			paths: ["M2 5h20v14H2z", "M2 6l10 7L22 6"],
		},
		{
			title: "Secure payment",
			text: "Card and wallet payments, encrypted end to end at checkout.",
			paths: ["M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"],
		},
		{
			title: "Clear details",
			text: "Straightforward descriptions and prices, so you know what you are getting.",
			paths: ["M21 12a8 8 0 0 1-8 8H4l1.5-3A8 8 0 1 1 21 12z"],
		},
	];

	return (
		<section aria-label="Why shop with us" className="mt-16 bg-white text-[#0a0a0a]">
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-y-8 px-5 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-4 lg:divide-x lg:divide-[#e5e5e5]">
				{services.map((service) => (
					<div key={service.title} className="lg:px-7 lg:first:pl-0 lg:last:pr-0">
						<div className="flex items-center gap-3">
							<svg
								aria-hidden
								width="38"
								height="38"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="shrink-0"
							>
								{service.paths.map((d) => (
									<path key={d} d={d} />
								))}
							</svg>
							<h2 className="text-[15px] font-extrabold uppercase tracking-wide">{service.title}</h2>
						</div>
						<p className="mt-3 text-[14px] leading-relaxed text-[#555]">{service.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}

/** Editorial banner: photograph on the right, white text on the left over a black fade. */
export async function Colophon() {
	const { storeName } = await getHomeData();

	return (
		<section className="relative overflow-hidden bg-background">
			<YNSMedia src={BANNER_IMAGE} alt="" fill sizes="100vw" className="object-cover object-right" />
			<div
				aria-hidden
				className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-black/30"
			/>
			<div className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
				<div className="max-w-xl text-white">
					<p className="text-[12px] uppercase tracking-[0.24em] text-white/70">{storeName} · the edit</p>
					<h2 className="mt-4 text-balance font-display text-[clamp(21px,3.5vw,40px)] font-semibold uppercase leading-tight tracking-[0.06em]">
						Roasted for the evening cup.
					</h2>
					<p className="mt-4 text-[15px] leading-relaxed text-white/80">
						Every coffee and every device in the shop is one we brew with ourselves: clear origins, honest
						roast levels and gear that does one job well.
					</p>
					<div className="mt-8 flex flex-wrap items-center gap-4">
						<Link href="/about" className={outlineCta}>
							Read our story
						</Link>
						<Link href="/products" className={textCta}>
							Shop all
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
