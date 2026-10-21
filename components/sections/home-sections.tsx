import type { APIProductsBrowseResult } from "commerce-kit";
import Link from "next/link";
import type { ReactNode } from "react";
import { overviewImage } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";

type Product = APIProductsBrowseResult["data"][number];
type Collection = { id: string; slug: string; name: string; image: string | null; description: string };

/** Section heading pair used throughout: spaced kicker over a light Cormorant line. */
export function SectionHeading({
	kicker,
	children,
	className = "",
}: {
	kicker: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={className}>
			<p className="kicker">{kicker}</p>
			<h2 className="mt-6 max-w-2xl font-display text-4xl font-light tracking-[-0.02em] text-ink md:text-5xl">
				{children}
			</h2>
		</div>
	);
}

/** The original's "Overview": copy at 40, the framed stage at 60. Here the collections, over an editorial photograph. */
export function Overview({ collections }: { collections: Collection[] }) {
	const lead = collections[0];
	return (
		<section id="overview" className="relative border-t border-hairline pb-24 pt-24 md:pb-36 md:pt-40">
			<div className="container-stage">
				<div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-x-10 xl:gap-x-12">
					<div className="reveal lg:max-w-xl">
						<p className="kicker">Collections</p>
						<h2 className="mt-5 font-display text-3xl font-light tracking-[-0.02em] text-ink md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
							Sound chosen for the hours you actually listen.
						</h2>
						<p className="mt-8 max-w-lg text-[15px] leading-[1.85] text-ink-soft md:text-lg md:leading-[1.75]">
							Every pair is tuned for long, close listening and built to be worn for hours, not only for the
							first track. A short range of headphones and the few things around them, made to last.
						</p>
						{collections.length > 0 && (
							<ul className="mt-10 space-y-4 border-l border-hairline-strong pl-6 text-sm">
								{collections.map((collection, index) => (
									<li key={collection.id}>
										<Link
											href={`/collection/${collection.slug}`}
											className={
												index === 0
													? "text-foreground transition-colors hover:text-warm"
													: "text-muted-foreground transition-colors hover:text-foreground"
											}
										>
											{collection.name}
											{collection.description && (
												<span className="text-muted-foreground"> — {collection.description}</span>
											)}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="relative min-w-0 lg:translate-x-8 xl:translate-x-12">
						<div
							aria-hidden="true"
							className="absolute -inset-4 rounded-sm border border-hairline bg-gradient-to-br from-[var(--panel-from)] to-transparent md:-inset-6"
						/>
						<Link
							href={lead ? `/collection/${lead.slug}` : "/products"}
							className="frame group relative block aspect-[3/2] overflow-hidden rounded-sm"
						>
							<YNSMedia
								src={overviewImage.src}
								alt={overviewImage.alt}
								fill
								sizes="(max-width: 1024px) 92vw, 56vw"
								className="object-cover transition-transform duration-1000 ease-[var(--ease-cinema)] [filter:var(--photo-filter)] group-hover:scale-[1.02]"
							/>
							<span className="absolute bottom-5 left-5 bg-[color-mix(in_srgb,var(--background)_78%,transparent)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink backdrop-blur-md">
								{lead?.name ?? "Shop all"}
							</span>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

// Module-level geometry so SSR and client match, as the original's waveform.
const BARS = Array.from({ length: 48 }, (_, i) => {
	const h = Math.max(2, 14 + Math.sin(i * 0.38) * 20 + (i % 5) * 3);
	return { x: ((i / 48) * 472 + 4).toFixed(2), y: (60 - h / 2).toFixed(2), h: h.toFixed(2), i };
});

/** "Hear the room inside the sound", turned to light: the waveform reads as a spectrum. */
export function DetailStory() {
	const notes = [
		{
			title: "Tuned for detail",
			copy: "Drivers chosen for a clear, even sound, so quiet passages stay as present as loud ones.",
		},
		{
			title: "Edited, not endless",
			copy: "A short range, each pair there for a reason, so choosing takes minutes rather than evenings.",
		},
		{
			title: "Made to be worn",
			copy: "Soft cushions, light frames and replaceable parts, so a good pair stays comfortable for years.",
		},
	];
	return (
		<section id="detail" className="relative overflow-hidden border-t border-hairline py-28 md:py-40">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--hairline-strong)] to-transparent"
			/>
			<div className="container-wide relative">
				<p className="kicker">Detail</p>
				<h2 className="reveal mt-8 max-w-4xl font-display text-statement font-light tracking-[-0.03em] text-ink">
					See the detail
					<span className="block text-muted-foreground">in every pair.</span>
				</h2>
				<div className="mt-14 flex justify-center md:mt-20 md:justify-start">
					<svg
						viewBox="0 0 480 120"
						className="h-24 w-full max-w-2xl text-muted-foreground md:h-32"
						aria-hidden="true"
					>
						<defs>
							<linearGradient id="spectrum" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
								<stop offset="50%" stopColor="var(--gold)" stopOpacity="0.55" />
								<stop offset="100%" stopColor="currentColor" stopOpacity="0.12" />
							</linearGradient>
						</defs>
						{BARS.map((bar) => (
							<rect
								key={bar.i}
								x={bar.x}
								y={bar.y}
								width={3}
								height={bar.h}
								rx={1}
								fill="url(#spectrum)"
								style={{
									animation: `bar-pulse ${(4.2 + (bar.i % 9) * 0.12).toFixed(2)}s ease-in-out ${(bar.i * 0.035).toFixed(3)}s infinite`,
								}}
							/>
						))}
					</svg>
				</div>
				<div className="mt-20 grid gap-12 border-t border-hairline pt-16 md:grid-cols-3 md:gap-10">
					{notes.map((note) => (
						<div key={note.title} className="reveal">
							<h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">{note.title}</h3>
							<p className="mt-4 text-sm leading-[1.8] text-muted-foreground md:text-[15px]">{note.copy}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

/** The original's "Design & materials" bento (7/5 · 5/7), each panel now a product. */
export async function ProductPanels({ products }: { products: Product[] }) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	if (products.length === 0) return null;

	return (
		<section id="collection" className="border-t border-hairline bg-band py-28 md:py-40">
			<div className="container-wide">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<SectionHeading kicker="The collection">Quiet sound, warmly lit.</SectionHeading>
					<Link href="/products" className="btn-ghost-line btn-sm">
						View all
					</Link>
				</div>
				<div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
					{products.map((product, index) => {
						const range = product.variants.length > 0 ? priceRange(product.variants, taxBehavior) : null;
						const image = product.images[0];
						return (
							<Link
								key={product.id}
								href={`/product/${product.slug}`}
								className={`panel group relative flex min-h-[220px] items-stretch justify-between gap-4 overflow-hidden rounded-sm p-7 transition-[border-color] duration-500 hover:border-[var(--ghost-hover-border)] md:min-h-[260px] md:p-10 ${SPANS[index % 4]}`}
							>
								<div
									aria-hidden="true"
									className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[var(--panel-glow)] blur-2xl transition-opacity duration-700 group-hover:opacity-80"
								/>
								<div className="relative flex min-w-0 flex-col justify-between">
									<div>
										<h3 className="text-lg font-medium tracking-wide text-foreground md:text-xl">
											{product.name}
										</h3>
										{product.summary && (
											<p className="mt-4 line-clamp-3 max-w-xs text-sm leading-[1.85] text-muted-foreground md:text-[15px]">
												{product.summary}
											</p>
										)}
									</div>
									<div className="mt-8">
										{range && (
											<p className="font-display text-2xl font-light text-ink">
												{formatMoney({ amount: range.min, currency, locale })}
											</p>
										)}
										<div className="mt-4 h-px w-full max-w-[120px] bg-gradient-to-r from-[var(--warm)] to-transparent opacity-60" />
									</div>
								</div>
								{image && (
									<div className="relative aspect-square w-[42%] max-w-56 shrink-0 self-center">
										<div
											aria-hidden="true"
											className="absolute inset-[10%] rounded-full blur-2xl [background:var(--key-light)]"
										/>
										<YNSMedia
											src={image}
											alt=""
											fill
											sizes="(max-width: 768px) 40vw, 20vw"
											className="spotlight object-cover transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-[1.04]"
										/>
									</div>
								)}
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}

const icons = {
	shipping: (
		<svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
			<path d="M5 11h14v11H5z" stroke="currentColor" strokeWidth="1" />
			<path d="M19 15h5l3 4v3h-8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
			<circle cx="10" cy="23" r="2" stroke="currentColor" strokeWidth="1" />
			<circle cx="23" cy="23" r="2" stroke="currentColor" strokeWidth="1" opacity="0.6" />
		</svg>
	),
	secure: (
		<svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
			<rect x="9" y="14" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1" />
			<path d="M12 14v-3a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
		</svg>
	),
	returns: (
		<svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
			<path d="M9 13h12a5 5 0 0 1 0 10h-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
			<path d="M13 9l-4 4 4 4" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
		</svg>
	),
	help: (
		<svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
			<circle cx="16" cy="13" r="6" stroke="currentColor" strokeWidth="1" />
			<path d="M13 22h6M14 25h4" stroke="currentColor" strokeWidth="1" opacity="0.5" />
			<path d="M16 3v2M6 13H4M28 13h-2" stroke="currentColor" strokeWidth="1" opacity="0.35" />
		</svg>
	),
};

/** The original's 2 × 2 "Engineered for immersion" cards, now the shop's promises. */
export function Promises({ shipping }: { shipping: string | null }) {
	const items = [
		{
			title: shipping ?? "Delivery at checkout",
			copy: "Delivery options and their costs for your address are shown at checkout, before you pay.",
			icon: icons.shipping,
		},
		{
			title: "Secure checkout",
			copy: "Cards and wallets on a hosted checkout. Your payment details never touch this page.",
			icon: icons.secure,
		},
		{
			title: "Clear policies",
			copy: "Delivery, returns and privacy terms are set out in the policies linked at the foot of every page.",
			icon: icons.returns,
		},
		{
			title: "Questions welcome",
			copy: "Not sure which pair suits how you listen? Ask before you order and we will help you choose.",
			icon: icons.help,
		},
	];
	return (
		<section id="promises" className="border-t border-hairline py-28 md:py-36">
			<div className="container-wide">
				<SectionHeading kicker="Service">Considered from cart to doorstep.</SectionHeading>
				<div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
					{items.map((item) => (
						<article
							key={item.title}
							className="reveal group relative overflow-hidden rounded-sm border border-hairline-strong bg-panel p-9 shadow-[inset_0_1px_0_var(--frame-inset)] transition-transform duration-500 ease-[var(--ease-cinema)] hover:-translate-y-[3px] md:p-10"
						>
							<div className="flex items-start gap-8">
								<div className="text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
									{item.icon}
								</div>
								<div>
									<h3 className="text-lg font-medium tracking-wide text-foreground">{item.title}</h3>
									<p className="mt-3 max-w-sm text-sm leading-[1.8] text-muted-foreground">{item.copy}</p>
								</div>
							</div>
							<div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[var(--warm)] to-transparent transition-all duration-700 group-hover:w-full" />
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

/** The original's "Technical sheet, distilled": a hairline grid of label/value cells, from the catalog. */
export function ShopSheet({ cells }: { cells: { label: string; value: string }[] }) {
	return (
		<section id="specs" className="border-t border-hairline bg-band-deep py-28 md:py-36">
			<div className="container-wide">
				<div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
					<div className="lg:col-span-4">
						<p className="kicker">At a glance</p>
						<h2 className="mt-6 font-display text-4xl font-light tracking-[-0.02em] text-ink md:text-[2.75rem] md:leading-[1.1]">
							The shop, distilled.
						</h2>
						<p className="mt-6 text-sm leading-[1.85] text-muted-foreground">
							Numbers matter when they help you choose. Here is everything the shop holds, in one sheet.
						</p>
					</div>
					<dl className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-hairline-strong bg-hairline-strong sm:grid-cols-2 lg:col-span-8">
						{cells.map((cell) => (
							<div
								key={cell.label}
								className="flex flex-col justify-center bg-panel px-8 py-7 md:px-10 md:py-8"
							>
								<dt className="text-micro font-medium uppercase tracking-[0.28em] text-muted-foreground">
									{cell.label}
								</dt>
								<dd className="mt-3 font-display text-xl font-light text-ink md:text-2xl">{cell.value}</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}

/** The closing brand statement, centred over a soft floor glow. */
export function Statement({ storeName }: { storeName: string }) {
	return (
		<section className="relative overflow-hidden border-t border-hairline py-32 md:py-44">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background:var(--brand-radial)]"
			/>
			<div className="relative mx-auto max-w-[900px] px-6 text-center md:px-12">
				<p className="text-kicker font-medium uppercase tracking-[0.45em] text-muted-foreground">
					{storeName}
				</p>
				<h2 className="reveal mt-10 font-display text-manifesto font-light tracking-[-0.02em] text-ink">
					The best sound is not louder — it is calmer, clearer, and closer to you.
				</h2>
				<p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
					{storeName} is our statement on restraint: fewer products, each one worth keeping.
				</p>
				<div className="mt-12 flex justify-center">
					<Link href="/products" className="btn-premium">
						Shop the collection
					</Link>
				</div>
			</div>
		</section>
	);
}
