import Image from "next/image";
import Link from "next/link";
import { ShelfCard } from "@/components/shelf-card";
import {
	getCategoryTiles,
	getPriceShelves,
	getShelfStats,
	getSocialLinks,
	getStoreBrand,
	pieces,
	ROOM_PHOTOS,
	SHELF_PHOTO,
} from "@/lib/catalog";
import { getStoreConfig } from "@/lib/store-config";
import { cn } from "@/lib/utils";

/** The original's ornament: two fading brass hairlines around a small glyph (◇, ✦ or ◆). */
export function Divider({
	glyph = "◇",
	width = "w-[50px] sm:w-20",
	className,
}: {
	glyph?: string;
	width?: string;
	className?: string;
}) {
	return (
		<div aria-hidden="true" className={cn("flex items-center justify-center gap-4 text-gold", className)}>
			<span className={cn("h-px bg-[linear-gradient(90deg,transparent,var(--gold),transparent)]", width)} />
			<span className="text-[1.125rem] leading-none opacity-80">{glyph}</span>
			<span className={cn("h-px bg-[linear-gradient(90deg,transparent,var(--gold),transparent)]", width)} />
		</div>
	);
}

/**
 * `.section__title` as a page or section head: brass Playfair caps with the 60px bar, an optional
 * caps kicker above and a muted lede below. Centred like the original; `align="start"` for listings.
 */
export function SectionHead({
	id,
	as: Heading = "h2",
	kicker,
	title,
	lede,
	align = "center",
	className,
}: {
	id?: string;
	as?: "h1" | "h2";
	kicker?: string;
	title: React.ReactNode;
	lede?: React.ReactNode;
	align?: "center" | "start";
	className?: string;
}) {
	const start = align === "start";
	return (
		<div className={cn("mb-10", start ? "text-left" : "text-center", className)}>
			{kicker && <p className="caps mb-3 text-[0.75rem] tracking-[0.15em] text-dim">{kicker}</p>}
			<Heading
				id={id}
				className={cn(
					"section-title mb-0 wrap-break-word",
					start && "text-left after:ml-0",
					Heading === "h1" && "text-[1.75rem] sm:text-[2rem]",
				)}
			>
				{title}
			</Heading>
			{lede && <p className={cn("mt-5 max-w-[60ch] text-dim", start ? "" : "mx-auto")}>{lede}</p>}
		</div>
	);
}

/**
 * The original's masthead: brass glow and plus-sign tile over the deep charcoal, a brass wordmark
 * with its underline, the store name in tracked-out Playfair caps, the italic brass line and the
 * ◇ ornament. A shop needs a way in, so a brass outline button closes it.
 */
export async function Masthead() {
	const brand = await getStoreBrand();
	return (
		<section className="bar-masthead relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:min-h-[70vh] sm:py-20">
			<Image src="/images/hero-bar.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,18,15,0.55),rgba(20,18,15,0.88))]"
			/>
			<div className="relative z-[1] max-w-full">
				<h1 className="serif mb-4 wrap-break-word text-[2rem] font-bold uppercase tracking-[0.15em] text-cream [text-shadow:0_2px_20px_rgba(0,0,0,0.6)] sm:text-[3.5rem] sm:tracking-[0.15em]">
					{brand.name}
				</h1>
				<p className="serif text-[1rem] tracking-[0.1em] text-gold italic sm:text-[1.25rem]">
					{brand.tagline}
				</p>
			</div>
			<Divider className="relative z-[1] mt-10" />
			<Link href="/products" className="btn relative z-[1] mt-10 bg-page/60 backdrop-blur-sm">
				Browse the shelf <span aria-hidden="true">→</span>
			</Link>
		</section>
	);
}

/**
 * The original's info bar (Est. | phone | address) as the shop's three quick facts: how many pieces,
 * the price span and a way to the full listing. Muted caps label, semibold value, grey pipes.
 */
export async function InfoBar() {
	const stats = await getShelfStats();
	const items = [
		{ icon: null, label: "Shelf", value: pieces(stats.pieces), href: null },
		...(stats.from
			? [{ icon: "◆", label: null, value: stats.to ? `${stats.from} – ${stats.to}` : stats.from, href: null }]
			: []),
		{ icon: "⚐", label: null, value: "Browse everything", href: "/products" },
	];
	return (
		<nav
			aria-label="Quick shop facts"
			className="border-y border-line bg-panel shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
		>
			<ul className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-3">
				{items.map((item, index) => {
					const body = (
						<>
							{item.icon && (
								<span aria-hidden="true" className="text-gold">
									{item.icon}
								</span>
							)}
							{item.label && <span className="caps text-[0.75rem] font-normal text-dim">{item.label}</span>}
							<span className="font-semibold">{item.value}</span>
						</>
					);
					return (
						<li
							key={item.value}
							className={cn(
								"flex items-center gap-6 text-[0.875rem] text-ink",
								index === 0 && "max-sm:hidden",
							)}
						>
							{index > 0 && (
								<span aria-hidden="true" className="font-light text-raise max-sm:hidden">
									|
								</span>
							)}
							{item.href ? (
								<Link href={item.href} className="flex items-center gap-2 transition-colors hover:text-gold">
									{body}
								</Link>
							) : (
								<span className="flex items-center gap-2">{body}</span>
							)}
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

/** The tagline band: one italic Playfair line between brass quotes, then the ✦ ornament. */
export async function Tagline({ line }: { line?: string }) {
	const brand = await getStoreBrand();
	const text =
		line ??
		(brand.description && brand.description.length <= 90
			? brand.description
			: "A short shelf of good bottles, and the tools to pour them well.");
	return (
		<section aria-label="Tagline" className="bar-band py-8 text-center sm:py-12">
			<div className="container-narrow">
				<blockquote>
					<p className="serif text-[1.125rem] leading-[1.75] text-cream italic sm:text-[1.5rem]">
						<span
							aria-hidden="true"
							className="mr-[0.1em] align-[-0.15em] text-[1.5em] leading-none text-gold"
						>
							"
						</span>
						{text}
						<span
							aria-hidden="true"
							className="ml-[0.1em] align-[-0.15em] text-[1.5em] leading-none text-gold"
						>
							"
						</span>
					</p>
				</blockquote>
				<Divider glyph="✦" width="w-10 sm:w-[60px]" className="mt-8" />
			</div>
		</section>
	);
}

/** "Hours" as "At a Glance": two centred blocks (muted caps label, Playfair value) split by a ◆. */
export async function AtAGlance() {
	const stats = await getShelfStats();
	const blocks = [
		{
			label: "On the shelf",
			value: `${pieces(stats.pieces)} · ${stats.shelves} ${stats.shelves === 1 ? "shelf" : "shelves"}`,
		},
		...(stats.from
			? [{ label: "Prices", value: stats.to ? `${stats.from} – ${stats.to}` : stats.from }]
			: []),
	];
	return (
		<section aria-labelledby="glance-title" id="glance" className="section-y text-center">
			<div className="container-narrow">
				<h2 id="glance-title" className="section-title">
					At a Glance
				</h2>
				<div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:flex-wrap sm:gap-8">
					{blocks.map((block, index) => (
						<div key={block.label} className="contents">
							{index > 0 && (
								<span aria-hidden="true" className="text-[0.875rem] text-gold opacity-60 max-sm:rotate-90">
									◆
								</span>
							)}
							<div className="w-full min-w-[200px] sm:max-w-[300px] sm:flex-1">
								<h3 className="caps mb-2 text-[0.875rem] tracking-[0.15em] text-dim">{block.label}</h3>
								<p className="serif text-[1.125rem] text-cream sm:text-[1.25rem]">{block.value}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/** The original's menu cards, here three price shelves of real pieces, each an accordion. */
export async function ShelfMenu() {
	const shelves = await getPriceShelves();
	if (shelves.length === 0) return null;
	return (
		<section aria-labelledby="shelf-title" id="shelf" className="section-y scroll-mt-[80px] bg-panel">
			<div className="container-x">
				<h2 id="shelf-title" className="section-title">
					On the Shelf
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
					{shelves.map((shelf, index) => (
						<ShelfCard key={shelf.name} shelf={shelf} index={index} />
					))}
				</div>
				<div className="mt-10 text-center">
					<Link href="/products" className="btn">
						The full shelf <span aria-hidden="true">→</span>
					</Link>
				</div>
			</div>
		</section>
	);
}

/**
 * "The Space": the original's six-up gallery of aged photographs with a zoom veil, here a mood board
 * of a warm, low-lit bar (bundled store photos), every frame opening the full shelf.
 */
export function RoomGallery() {
	return (
		<section aria-labelledby="space-title" id="space" className="section-y">
			<div className="container-x">
				<h2 id="space-title" className="section-title">
					The Room
				</h2>
				<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{ROOM_PHOTOS.map((photo) => (
						<li key={photo.src}>
							<Link
								href="/products"
								className="group relative block aspect-[4/3] overflow-hidden rounded-[4px] bg-panel"
							>
								<Image
									src={photo.src}
									alt={photo.alt}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
									className="aged object-cover group-hover:scale-105"
								/>
								<span
									aria-hidden="true"
									className="absolute inset-0 flex items-center justify-center bg-page/60 text-[1.5rem] text-gold opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
								>
									⊕
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/**
 * "Find Us": the address column and the transit list become "Browse by shelf" (brass line badges
 * carrying each category's count), and the map frame holds a bundled photograph.
 */
export async function FindYourWay() {
	const [categories, stats] = await Promise.all([getCategoryTiles(6), getShelfStats()]);
	return (
		<section aria-labelledby="find-title" id="find" className="section-y bg-panel">
			<div className="container-x">
				<h2 id="find-title" className="section-title">
					Find Your Way
				</h2>
				<div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
					<div className="space-y-8">
						<div>
							<h3 className="kicker mb-3">The shelf</h3>
							<p className="text-[1.125rem] text-cream">
								{pieces(stats.pieces)} across {stats.shelves} {stats.shelves === 1 ? "shelf" : "shelves"}
								<br />
								<span className="text-[0.875rem] text-dim italic">
									(new bottles are added as they arrive)
								</span>
							</p>
							<Link href="/products" className="btn mt-5">
								Browse everything <span aria-hidden="true">→</span>
							</Link>
						</div>
						{categories.length > 0 && (
							<div>
								<h3 className="kicker mb-3">By shelf</h3>
								<ul className="space-y-3">
									{categories.map((category) => (
										<li key={category.id}>
											<Link href={category.href} className="group flex items-center gap-3 text-[0.875rem]">
												<span className="badge badge-gold min-w-12 justify-center tabular-nums">
													{category.count}
												</span>
												<span className="text-ink transition-colors group-hover:text-gold">
													{category.name}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
					<Link
						href="/products"
						className="group relative block aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-page lg:aspect-auto lg:h-full lg:min-h-[400px]"
					>
						<Image
							src={SHELF_PHOTO}
							alt=""
							fill
							sizes="(max-width: 1024px) 100vw, 600px"
							className="aged object-cover opacity-80"
						/>
						<span
							aria-hidden="true"
							className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(26,26,24,0.9))]"
						/>
						<span className="absolute inset-x-0 bottom-4 text-center text-[0.875rem] text-dim transition-colors group-hover:text-gold">
							View the whole shelf
						</span>
					</Link>
				</div>
			</div>
		</section>
	);
}

const NOTES = [
	"Tasted before it reaches the shelf — if we would not pour it ourselves, it does not go up.",
	"Fewer bottles, better chosen, and a warm light to pour them by.",
	"The kind of bar where a first drink turns into a habit.",
] as const;

/** "What They Say", without borrowed press: three house notes in italic Playfair on brass-edged cards. */
export function HouseNotes() {
	return (
		<section aria-labelledby="notes-title" id="notes" className="section-y">
			<div className="container-narrow">
				<h2 id="notes-title" className="section-title">
					House Notes
				</h2>
				<div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-6">
					{NOTES.map((note) => (
						<figure
							key={note}
							className="quote-mark relative flex flex-col rounded-r-[4px] border-l-[3px] border-gold bg-panel p-4 sm:p-6"
						>
							<blockquote className="relative z-[1] flex-1">
								<p className="serif text-[1rem] leading-[1.75] text-cream italic sm:text-[1.125rem]">
									{note}
								</p>
							</blockquote>
							<figcaption className="caps relative z-[1] mt-4 text-right text-[0.875rem] text-dim">
								— The house
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * "Get In Touch": three centred cards (account, search, socials or questions) and the terracotta
 * "Please note" box, whose notices come from the store's own settings.
 */
export async function BeforeYouGo() {
	const [socials, config] = await Promise.all([getSocialLinks(), getStoreConfig()]);
	const social = socials[0];
	const cards = [
		{ icon: "◉", label: "Account", value: "Sign in", href: "/account", plain: true },
		{ icon: "⌕", label: "Search", value: "Find a bottle", href: "/search", plain: false },
		social
			? { icon: "✉", label: social.label, value: "Follow along", href: social.href, plain: true }
			: { icon: "✉", label: "Questions", value: "Read the answers", href: "/faq", plain: false },
	];
	const notices = [
		`Prices in ${config.currency}`,
		config.taxBehavior === "inclusive" ? "Taxes included" : "Taxes added at checkout",
		"Delivery set at checkout",
	];
	return (
		<section aria-labelledby="touch-title" id="contact" className="section-y">
			<div className="container-narrow">
				<h2 id="touch-title" className="section-title">
					Before You Go
				</h2>
				<div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
					{cards.map((card) => {
						const body = (
							<>
								<span aria-hidden="true" className="text-[1.25rem] text-gold sm:mb-3 sm:text-[1.5rem]">
									{card.icon}
								</span>
								<span className="flex flex-col sm:items-center">
									<span className="caps mb-1 text-[0.75rem] tracking-[0.15em] text-dim">{card.label}</span>
									<span className="font-semibold text-cream">{card.value}</span>
								</span>
							</>
						);
						const className =
							"flex flex-row items-center gap-4 rounded-[4px] border border-gold/15 bg-panel p-4 text-left transition-[background-color,border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-gold hover:bg-raise sm:flex-col sm:gap-0 sm:p-6 sm:text-center";
						return card.plain ? (
							<a
								key={card.label}
								href={card.href}
								className={className}
								{...(card.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
							>
								{body}
							</a>
						) : (
							<Link key={card.label} href={card.href} className={className}>
								{body}
							</Link>
						);
					})}
				</div>
				<aside
					aria-labelledby="notices-title"
					className="rounded-[4px] border-2 border-rust bg-[linear-gradient(135deg,rgba(168,90,50,0.1)_0%,rgba(201,162,39,0.05)_100%)] p-6 text-center"
				>
					<h3 id="notices-title" className="caps mb-4 text-[0.875rem] tracking-[0.15em] text-[#d27a4e]">
						Please Note
					</h3>
					<ul className="flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
						{notices.map((notice, index) => (
							<li
								key={notice}
								className="caps flex items-center justify-center gap-6 text-[0.875rem] font-bold text-cream"
							>
								{index > 0 && (
									<span aria-hidden="true" className="text-rust max-sm:hidden">
										•
									</span>
								)}
								{notice}
							</li>
						))}
					</ul>
				</aside>
			</div>
		</section>
	);
}

/**
 * The masthead as the original's inner pages print it, shorter: a caps kicker, the page name in
 * tracked-out Playfair caps, an italic brass line and the ◇ ornament over the glow and plus tile.
 */
export function PageMasthead({
	kicker,
	title,
	line,
	backdrop,
	children,
}: {
	kicker?: React.ReactNode;
	title: React.ReactNode;
	line?: React.ReactNode;
	/** A photograph laid faintly under the type (collection pages). */
	backdrop?: React.ReactNode;
	children?: React.ReactNode;
}) {
	return (
		<section className="bar-masthead relative overflow-hidden px-4 py-12 text-center sm:py-16">
			{backdrop}
			<div className="relative z-[1] mx-auto max-w-[900px]">
				{kicker && <div className="caps mb-4 text-[0.75rem] tracking-[0.15em] text-dim">{kicker}</div>}
				<h1 className="serif wrap-break-word text-[1.5rem] font-bold uppercase tracking-[0.15em] text-cream [text-shadow:0_2px_20px_rgba(0,0,0,0.5)] sm:text-[2.5rem] sm:tracking-[0.2em]">
					{title}
				</h1>
				{line && (
					<p className="serif mx-auto mt-4 max-w-[60ch] text-[1rem] tracking-[0.05em] text-gold italic sm:text-[1.125rem]">
						{line}
					</p>
				)}
				<Divider className="mt-8" />
				{children}
			</div>
		</section>
	);
}
