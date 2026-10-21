import { cacheLife } from "next/cache";
import Link from "next/link";
import { Desk } from "@/components/desk";
import { Notebook } from "@/components/notebook";
import { ProductCard } from "@/components/product-card";
import { Till, type TillItem } from "@/components/till";
import {
	countWord,
	firstStill,
	getCatalogProducts,
	getCategoryTiles,
	getCollectionTiles,
	getStoreBrand,
	pieces,
} from "@/lib/catalog";
import { HERO_PHOTO } from "@/lib/editorial";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn } from "@/lib/utils";

/** "[ The desk ]" kicker, a serif heading whose italics get the highlighter swipe, and a dim lede. */
export function SectionHead({
	kicker,
	title,
	lede,
	as: Heading = "h2",
	id,
	className,
	reveal = true,
}: {
	reveal?: boolean;
	kicker: string;
	title: React.ReactNode;
	lede?: React.ReactNode;
	as?: "h1" | "h2";
	id?: string;
	className?: string;
}) {
	return (
		<div className={cn("relative max-w-[64ch]", className)}>
			<p className={cn("kicker mb-4", reveal && "reveal")}>[ {kicker} ]</p>
			<Heading
				id={id}
				className={cn(
					"wrap-break-word [&_em]:swipe",
					reveal && "reveal",
					Heading === "h1" ? "text-[clamp(2.5rem,6vw,4.4rem)]" : "text-section",
				)}
			>
				{title}
			</Heading>
			{lede && <p className={cn("lede mt-4", reveal && "reveal")}>{lede}</p>}
		</div>
	);
}

/** Big faint background word, drawn as SVG so it never reads as low-contrast text. */
export function Watermark({ text, className }: { text: string; className?: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 1000 260"
			className={cn("pointer-events-none absolute right-[-3%] top-[4%] z-0 w-[min(92vw,900px)]", className)}
		>
			<text
				x="1000"
				y="210"
				textAnchor="end"
				fill="var(--ink)"
				opacity=".045"
				fontSize="230"
				style={{ fontFamily: "var(--font-d)" }}
			>
				{text}
			</text>
		</svg>
	);
}

/** The open notebook hero: three rising lines, the store's lede, two buttons and live counts. */
export async function HomeHero() {
	"use cache";
	cacheLife("minutes");
	const [brand, { total }, categories, collections] = await Promise.all([
		getStoreBrand(),
		getCatalogProducts(),
		getCategoryTiles(),
		getCollectionTiles(),
	]);

	const facts = [
		{ label: "In the range", value: pieces(total) },
		{ label: "Categories", value: String(categories.length) },
		{ label: "Collections", value: String(collections.length) },
	].filter((fact) => fact.value !== "0");

	return (
		<section
			aria-labelledby="hero-title"
			className="wrap pb-[clamp(3rem,6vw,5rem)] pt-[clamp(3rem,7vw,6rem)]"
		>
			<div className="grid items-center gap-[clamp(1.6rem,4vw,3.6rem)] min-[920px]:grid-cols-[1.02fr_0.98fr]">
				<div className="min-w-0">
					<p className="label-mono mb-[1.4rem] text-[0.74rem] tracking-[0.2em]">
						[ Good things · chosen slowly ]
					</p>
					<h1 id="hero-title" className="text-[clamp(2.7rem,7.6vw,5.5rem)]">
						<span className="rise-line">
							<span>Every good</span>
						</span>
						<span className="rise-line">
							<span className="[--d:.12s]">thing starts on</span>
						</span>
						<span className="rise-line">
							<span className="[--d:.24s]">
								<em className="swipe">paper.</em>
							</span>
						</span>
					</h1>
					<p className="mt-6 max-w-[47ch] text-dim">
						{brand.description && brand.description.length > 40
							? brand.description
							: `${brand.name} gathers notebooks, paper, pens and ink — chosen slowly and described plainly. Write the list first; we’ll help you tick it off.`}
					</p>
					<div className="mt-7 flex flex-wrap gap-3">
						<Link href="/products" className="btn btn-primary">
							Feel the range
						</Link>
						<Link href="/#desk" className="btn btn-ghost">
							Try the paper <span aria-hidden="true">→</span>
						</Link>
					</div>
					{facts.length > 0 && (
						<dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
							{facts.map((fact) => (
								<div key={fact.label} className="flex flex-col gap-1">
									<dt className="label-mono text-[0.68rem] tracking-[0.16em]">{fact.label}</dt>
									<dd className="m-0 font-display text-[1.5rem] leading-tight">{fact.value}</dd>
								</div>
							))}
						</dl>
					)}
				</div>
				<Link
					href="/products"
					className="block transition-transform duration-500 ease-[var(--ease)] hover:-translate-y-1"
				>
					<Notebook
						priority
						image={HERO_PHOTO}
						note={
							<>
								pasted in —
								<br />a list worth keeping
							</>
						}
						captionStart={<>No. 01 — “{brand.name}”</>}
						captionEnd={pieces(total)}
					/>
				</Link>
			</div>
			<p
				aria-hidden="true"
				className="label-mono mt-[clamp(2rem,5vw,3.4rem)] text-[0.72rem] tracking-[0.18em]"
			>
				scroll — the desk is set
			</p>
		</section>
	);
}

/** The desk: pick a ruling for the whole site, then try the nib on the scratch pad. */
export function DeskSection() {
	return (
		<section id="desk" className="scroll-mt-24 py-[clamp(4rem,9vw,7rem)]">
			<div className="wrap">
				<SectionHead
					kicker="The desk"
					className="mb-10"
					title={
						<>
							Pick a paper. <em>Make a mark.</em>
						</>
					}
					lede="Every ruling, live on this page — flip the sheet and the whole shop re-rules, product pages and all. Then try the nib: the pad below is real. Move slow and the line runs wet; move quick and it goes lean."
				/>
				<Desk />
			</div>
		</section>
	);
}

const RANGE_LIMIT = 6;

/** The range: six cards on the kraft band, a faint count in the background. */
export async function RangeSection() {
	"use cache";
	cacheLife("minutes");
	const [{ products, total }, collections] = await Promise.all([getCatalogProducts(), getCollectionTiles(8)]);
	// Photographed, priced pieces lead, so the band never opens on an empty frame or a $0 entry.
	const rank = (p: (typeof products)[number]) =>
		(firstStill(p.images) ? 0 : 2) + (p.variants.some((v) => Number(v.price) > 0) ? 0 : 1);
	const shown = [...products].sort((a, b) => rank(a) - rank(b)).slice(0, RANGE_LIMIT);
	if (shown.length === 0) return null;

	return (
		<section
			id="range"
			className="relative overflow-hidden border-y border-line bg-kraft-2 py-[clamp(4rem,9vw,7rem)]"
		>
			<Watermark text={pieces(total)} />
			<div className="wrap relative">
				<SectionHead
					kicker="The range"
					className="mb-10"
					title={`${countWord(shown.length)} things worth living with.`}
					lede="Every notebook, pen and pad is described plainly, with a page of its own: the paper, the size, the price and how many are left. Make a list, take your time."
				/>
				<div className="grid grid-cols-1 gap-[1.1rem] min-[580px]:grid-cols-2 min-[940px]:grid-cols-3">
					{shown.map((product, index) => (
						<div
							key={product.id}
							className="reveal"
							style={{ "--d": `${(index % 3) * 0.1}s` } as React.CSSProperties}
						>
							<ProductCard product={product} />
						</div>
					))}
				</div>
				<div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
					<Link href="/products" className="btn btn-ghost shrink-0 self-start whitespace-nowrap">
						See the whole range <span aria-hidden="true">→</span>
					</Link>
					{collections.length > 0 && (
						<nav aria-label="Collections" className="flex min-w-0 flex-wrap items-center gap-2">
							<span className="label-mono mr-1">On the shelves</span>
							{collections.map((collection) => (
								<Link key={collection.id} href={collection.href} className="chip">
									{collection.name}
								</Link>
							))}
						</nav>
					)}
				</div>
			</div>
		</section>
	);
}

/** Everyday things drawn flat — the shop's stand-in for the original's mould-and-deckle diagram. */
function RoomPlan() {
	return (
		<svg viewBox="0 0 640 300" role="img" aria-labelledby="room-t room-d" className="h-auto w-full text-ink">
			<title id="room-t">A sketched flat lay of everyday things</title>
			<desc id="room-d">
				A tote bag, a pair of sunglasses, a water bottle and a notebook drawn from above, with notes in the
				margin — the list you make before you buy anything.
			</desc>
			<g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
				<path d="M70 110 H210 L224 250 H56 Z" />
				<path d="M104 110 C104 60 176 60 176 110" />
				<path d="M116 110 C116 74 164 74 164 110" strokeWidth="1.1" opacity=".5" />
				<circle cx="276" cy="78" r="26" />
				<circle cx="350" cy="78" r="26" />
				<path d="M302 74 C310 66 318 66 324 74" />
				<path d="M250 72 L232 62 M376 72 L394 62" />
				<rect x="300" y="150" width="44" height="110" rx="14" />
				<rect x="310" y="136" width="24" height="16" rx="3" />
				<path d="M300 182 H344" strokeWidth="1.1" opacity=".5" />
				<rect x="380" y="150" width="70" height="98" rx="3" />
				<path d="M392 150 V248" strokeWidth="1.1" opacity=".6" />
			</g>
			<rect x="396" y="166" width="50" height="46" rx="3" fill="var(--hl)" opacity=".5" />
			<g stroke="var(--blue)" strokeWidth="1.2" opacity=".7">
				<path d="M402 174 H440 M402 190 H440 M402 206 H432" />
			</g>
			<g fontSize="11" fill="var(--dim)" letterSpacing="1" style={{ fontFamily: "var(--font-m)" }}>
				<text x="470" y="58">
					THE SHADES —
				</text>
				<text x="470" y="72">
					for the bright days
				</text>
				<text x="470" y="148">
					THE BOTTLE —
				</text>
				<text x="470" y="162">
					always within reach
				</text>
				<text x="470" y="226">
					THE LIST —
				</text>
				<text x="470" y="240">
					written before buying
				</text>
				<text x="24" y="284">
					WRITE IT DOWN, BUY IT ONCE — EVERY GOOD THING STARTS ON PAPER.
				</text>
			</g>
			<g fill="none" stroke="var(--dim)" strokeWidth="1" opacity=".7">
				<path d="M466 54 L402 64" />
				<path d="M466 150 L348 196" />
				<path d="M466 222 L452 214" />
			</g>
		</svg>
	);
}

/** The original's mill story, retold as the shop's: copy and a plan on the left, an index card of categories. */
export async function StorySection({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
	"use cache";
	cacheLife("hours");
	const [brand, categories] = await Promise.all([getStoreBrand(), getCategoryTiles()]);

	return (
		<section id="story" className="scroll-mt-24 py-[clamp(4rem,9vw,7rem)]">
			<div className="wrap grid items-start gap-[clamp(1.6rem,4vw,3.4rem)] min-[880px]:grid-cols-[1.5fr_0.9fr]">
				<div className="min-w-0">
					<SectionHead
						kicker="The shop"
						as={headingAs}
						title={
							<>
								One list. <em>Many years.</em>
							</>
						}
					/>
					<div className="max-w-[60ch] space-y-4 pt-1 text-dim [&_strong]:text-ink">
						<p className="reveal mt-4">
							{brand.name} started with a list written on the back of an envelope — a notebook that lies flat,
							a paper that takes ink, a pen worth keeping. Everything we stock still has to pass that test:{" "}
							<strong>would it earn its place on the desk, for years, not a season?</strong>
						</p>
						<p className="reveal">
							So we keep the range small and the descriptions plain. Every notebook, pen and sheet gets a page
							of its own with what it is, what it costs and how many we have, and nothing on it shouts.{" "}
							<strong>Good things don’t need a countdown clock.</strong>
						</p>
						<p className="reveal">Take your time. Write the list, flip the paper, come back tomorrow.</p>
						<p className="reveal mt-6 font-display text-ink italic">— the {brand.name} team</p>
					</div>
					<figure className="reveal mt-9 max-w-[560px]">
						<RoomPlan />
						<figcaption className="mono mt-2.5 text-[0.68rem] tracking-[0.06em] text-faint">
							fig. 1 — a day's things, sketched before they are packed
						</figcaption>
					</figure>
				</div>
				{categories.length > 0 && (
					<aside aria-label="Categories" className="index-card reveal min-[880px]:sticky min-[880px]:top-24">
						{categories.map((category) => (
							<Link key={category.id} href={category.href} className="index-row group">
								<span className="label-mono transition-colors group-hover:text-ink">{category.name}</span>
								<span className="font-display text-[1.02rem] text-ink">{pieces(category.count)}</span>
							</Link>
						))}
						<Link href="/products" className="index-row group">
							<span className="label-mono transition-colors group-hover:text-ink">Everything</span>
							<span className="font-display text-[1.02rem] text-ochre">
								the range <span aria-hidden="true">→</span>
							</span>
						</Link>
					</aside>
				)}
			</div>
		</section>
	);
}

const TILL_LIMIT = 12;

/** The counter: a till receipt that rings real pieces into the basket. */
export async function CounterSection() {
	"use cache";
	cacheLife("minutes");
	const [brand, { products }, { taxBehavior }] = await Promise.all([
		getStoreBrand(),
		getCatalogProducts(),
		getStoreConfig(),
	]);
	const items: TillItem[] = products
		.flatMap((product) => {
			const variant = product.variants.length === 1 ? product.variants[0] : null;
			// Sold-out and unpriced ($0) pieces would ring up an empty or zero receipt.
			if (!variant || variant.stock === 0 || !(Number(variant.price) > 0)) return [];
			return [
				{
					variantId: variant.id,
					sku: variant.sku,
					price: variant.price,
					priceGross: variant.priceGross ?? null,
					unit: displayPrice(variant, taxBehavior),
					images: variant.images,
					product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
				},
			];
		})
		.slice(0, TILL_LIMIT);
	if (items.length === 0) return null;

	return (
		<section id="counter" className="scroll-mt-24 border-y border-line bg-kraft-2 py-[clamp(4rem,9vw,7rem)]">
			<div className="wrap grid items-center gap-[clamp(1.6rem,4vw,3.4rem)] min-[880px]:grid-cols-2">
				<div>
					<SectionHead kicker="The counter" title="Paid for, plainly." />
					<p className="reveal mb-6 mt-4 max-w-[48ch] text-dim">
						No urgency banners, no countdown clocks. Tell the till what you want and how many; it prints an
						honest total and sets it in your basket. Checkout is one secure page, whenever you’re ready.
					</p>
					<ul className="arrow-list reveal grid gap-2">
						<li>one basket · one honest total</li>
						<li>every piece has a page — read before you buy</li>
						<li>secure checkout when you’re ready</li>
					</ul>
				</div>
				<div className="reveal">
					<Till storeName={brand.name} items={items} />
				</div>
			</div>
		</section>
	);
}
