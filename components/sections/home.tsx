import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getNavData, getPieceCount, getShelf } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { YNSMedia } from "@/lib/yns-media";
import lookBaskets from "@/public/images/pexels/look-baskets.jpg";
import lookChairSeated from "@/public/images/pexels/look-chair-seated.jpg";
import lookChairStill from "@/public/images/pexels/look-chair-still.jpg";
import lookLinen from "@/public/images/pexels/look-linen.jpg";

const pieces = (count: number) => `${count} ${count === 1 ? "piece" : "pieces"}`;

/** The quiet hairline strip under the hero. */
export async function ThemeBar() {
	const count = await getPieceCount();
	return (
		<div className="border-b border-line">
			<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-5 py-3 text-small text-muted-foreground">
				<span>{pieces(count)} in the shop, each chosen to be kept.</span>
				<Link
					href="/products"
					className="font-semibold text-ink underline underline-offset-4 hover:text-brand-ink"
				>
					Shop all
				</Link>
				<Link
					href="/about"
					className="font-semibold text-ink underline underline-offset-4 hover:text-brand-ink"
				>
					Our story
				</Link>
			</div>
		</div>
	);
}

/** "The collections": four portrait tiles with a caption and a piece count. */
export async function CollectionsShelf() {
	const shelf = (await getShelf()).filter((tile) => tile.image).slice(0, 4);
	if (shelf.length === 0) return null;
	return (
		<section className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
			<h2 className="text-section font-medium tracking-tight">The collections</h2>
			<div className="mt-7 grid grid-cols-2 gap-5 lg:grid-cols-4">
				{shelf.map((tile) => (
					<Link key={tile.href} href={tile.href} className="group block min-w-0">
						<div className="relative aspect-[3/4] overflow-hidden bg-tile">
							{tile.image && (
								<YNSMedia
									src={tile.image}
									alt=""
									fill
									sizes="(max-width: 1024px) 50vw, 270px"
									className="object-cover transition duration-300 group-hover:scale-[1.02]"
								/>
							)}
						</div>
						<h3 className="mt-3 text-[18px] underline-offset-4 group-hover:underline">{tile.label}</h3>
						<p className="mt-1 text-[14px] text-muted-foreground">{pieces(tile.count)}</p>
					</Link>
				))}
			</div>
		</section>
	);
}

/** "Everything we cut": eight pieces with the store's total. */
export async function EverythingGrid() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.productBrowse({ active: true, limit: 24 }).catch(() => null);
	if (!result || result.data.length === 0) return null;
	// Photographed pieces lead, so the grid never opens on an empty tile.
	const pictured = (product: (typeof result.data)[number]) => product.images.length > 0;
	const shown = [
		...result.data.filter(pictured),
		...result.data.filter((product) => !pictured(product)),
	].slice(0, 8);
	return (
		<section className="mx-auto max-w-6xl px-5 py-4 sm:py-14">
			<div className="flex items-baseline justify-between gap-4">
				<h2 className="text-section font-bold tracking-tight">Everything in the shop</h2>
				<Link href="/products" className="shrink-0 text-[14px] text-muted-foreground hover:text-ink">
					{pieces(result.meta.count)}
				</Link>
			</div>
			<div className="mt-7 grid grid-cols-2 gap-5 md:grid-cols-4">
				{shown.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}

const values = [
	{
		title: "Natural fibres only",
		text: "Linen, wool and cotton, chosen for how they feel and wear, not how they photograph.",
	},
	{
		title: "A short, considered list",
		text: "Fewer pieces, each picked on purpose, so the whole shop can be browsed in one sitting.",
	},
	{
		title: "Kept, not replaced",
		text: "Clothes that soften with washing and are worn for years, not swapped out with the next trend.",
	},
];

/** Atelier principles: hairline columns, no cards or icons. */
export function Values() {
	return (
		<section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
			<div className="grid gap-8 border-t border-ink pt-8 sm:grid-cols-3 sm:gap-10">
				{values.map((value, index) => (
					<div key={value.title}>
						<p className="font-display text-body italic text-brand-ink">No. {index + 1}</p>
						<h3 className="mt-2 text-[20px]">{value.title}</h3>
						<p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-muted-foreground">
							{value.text}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}

const looks = [
	{ src: lookBaskets, alt: "Two woven baskets with dried flowers against a peach wall" },
	{ src: lookChairSeated, alt: "Someone in brown linen resting on a wooden chair in warm light" },
	{ src: lookChairStill, alt: "A cane chair holding a net bag of fruit beside a linen curtain" },
	{ src: lookLinen, alt: "Hands resting on a rust linen skirt and a white shirt" },
];

/** "Slow days": a full-bleed band of four quiet photographs. */
export function Lookbook() {
	return (
		<section className="py-4 sm:py-8">
			<div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 pb-6">
				<div>
					<h2 className="text-section font-medium tracking-tight">Slow days, well kept</h2>
					<p className="mt-2 text-body text-muted-foreground">Linen and wool for unhurried days.</p>
				</div>
				<Link href="/products" className="shrink-0 text-[14px] text-muted-foreground hover:text-ink">
					Shop all
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-1 md:grid-cols-4">
				{looks.map((look) => (
					<div key={look.src.src} className="relative aspect-[3/4] overflow-hidden bg-tile">
						<Image
							src={look.src}
							alt={look.alt}
							fill
							placeholder="blur"
							sizes="(max-width: 768px) 50vw, 25vw"
							className="object-cover"
						/>
					</div>
				))}
			</div>
		</section>
	);
}

export function Quote() {
	return (
		<section className="mx-auto max-w-3xl px-5 py-10 text-center sm:py-16">
			<blockquote className="font-display text-quote font-semibold">
				“Buy less, choose well, make it last.”
			</blockquote>
			<p className="mt-4 text-[14px] text-muted-foreground">Vivienne Westwood</p>
		</section>
	);
}

/** The oxblood colophon band: in the original it sells the theme, here it maps the shop. */
export async function Colophon() {
	const [{ storeName }, shelf] = await Promise.all([getNavData(), getShelf()]);
	return (
		<section className="mx-auto max-w-6xl px-5 pb-4 sm:pb-8">
			<div className="grid gap-5 border border-brand-deep bg-brand p-4 text-white sm:gap-10 sm:p-10 md:grid-cols-[1.2fr_1fr] md:items-center">
				<div>
					<p className="text-small font-medium text-white/80">{storeName} · the house</p>
					<h2 className="mt-3 text-[clamp(26px,3.5vw,38px)] font-bold leading-tight tracking-tight">
						Chosen slowly. Meant to be kept.
					</h2>
					<p className="mt-4 max-w-[52ch] text-body text-white/85">
						Every piece in the shop is here because it is worth keeping for years. Browse by category, read
						how we choose, and find answers to common questions.
					</p>
					<div className="mt-7 flex flex-wrap gap-3">
						<Link
							href="/products"
							className="bg-white px-6 py-3.5 text-body font-semibold text-[#6d1f2c] hover:bg-white/90"
						>
							Shop all pieces
						</Link>
						<Link
							href="/about"
							className="border border-white/40 px-6 py-3.5 text-body font-semibold text-white hover:bg-white/10"
						>
							Our story
						</Link>
						<Link
							href="/faq"
							className="px-2 py-3.5 text-body font-semibold text-white/85 underline decoration-white/40 underline-offset-4 hover:text-white"
						>
							Questions
						</Link>
					</div>
				</div>
				{shelf.length > 0 && (
					<ul className="grid min-w-0 gap-3 bg-brand-deep/60 p-4 text-[14px] leading-relaxed sm:p-7">
						{shelf.slice(0, 5).map((tile, index) => (
							<li key={tile.href}>
								<Link href={tile.href} className="flex gap-3 hover:underline">
									<span className="mt-0.5 text-white/70">{String(index + 1).padStart(2, "0")}</span>
									<span>
										<strong className="font-semibold">{tile.label}</strong> — {pieces(tile.count)}
									</span>
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
