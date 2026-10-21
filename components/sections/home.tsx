import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Counter, HeroParallax, PourCard } from "@/components/ledger-motion";
import { PieceFinder } from "@/components/piece-finder";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID } from "@/components/product-grid-skeleton";
import {
	firstStill,
	getBudgetBands,
	getCatalogProducts,
	getCategoryTiles,
	getClubTiers,
	getLedgerStats,
	getStoreBrand,
} from "@/lib/catalog";
import { numberWord, wordmarkLines } from "@/lib/ledger";
import { cn } from "@/lib/utils";

/** "Nº 01 — The pieces": DM Mono kicker, Cormorant heading with a gold italic phrase, a dim lede. */
export function SectionHead({
	kicker,
	title,
	lede,
	as: Heading = "h2",
	className,
	id,
}: {
	kicker: string;
	title: React.ReactNode;
	lede?: React.ReactNode;
	as?: "h1" | "h2";
	className?: string;
	id?: string;
}) {
	return (
		<div className={cn("mb-[3.4rem]", className)}>
			<p className="kicker reveal mb-[1.2rem]">{kicker}</p>
			<Heading
				id={id}
				className="display reveal wrap-break-word text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.04] text-cream"
			>
				{title}
			</Heading>
			{lede && <p className="reveal mt-[1.2rem] max-w-[58ch] text-[1.06rem] text-dim">{lede}</p>}
		</div>
	);
}

const HERO_IMAGES = {
	home: {
		src: "/images/pexels/hills-morning.jpg",
		alt: "Low sun over rolling vineyard hills, rows of vines running into a golden haze.",
	},
	about: {
		src: "/images/pexels/hills-haze.jpg",
		alt: "A vineyard slope and a stand of oaks lit from behind by a hazy golden sunrise, mist between the rows.",
	},
} as const;

export { HERO_IMAGES };

/** The landscape: photograph, gold light rays, scrim, far hills, near furrows and the wordmark. */
export async function LandscapeHero({
	title,
	eyebrow,
	sub,
	actions,
	meta,
	compact = false,
	image = HERO_IMAGES.home,
}: {
	image?: { src: string; alt: string };
	title: React.ReactNode;
	eyebrow: string;
	sub: string;
	actions?: React.ReactNode;
	meta?: [string, string];
	compact?: boolean;
}) {
	return (
		<section
			data-hero
			aria-label={eyebrow}
			className={cn(
				"relative grid place-items-center overflow-hidden",
				compact ? "h-[78svh] min-h-[520px]" : "h-svh min-h-[620px]",
			)}
		>
			<div
				data-depth="16"
				className="pointer-events-none absolute inset-x-0 -top-[14%] bottom-0 z-[1] will-change-transform"
			>
				<Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
			</div>
			<div
				data-depth="26"
				data-fade="true"
				aria-hidden="true"
				className="hero-rays pointer-events-none absolute inset-0 z-[2]"
			/>
			<div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0 z-[3]" />
			<svg
				data-depth="-7"
				className="pointer-events-none absolute inset-x-0 -bottom-[4%] z-[4] h-[38%] w-full will-change-transform"
				viewBox="0 0 1440 320"
				preserveAspectRatio="none"
				aria-hidden="true"
				focusable="false"
			>
				<path
					d="M0 216 C220 150 430 168 660 198 C900 230 1140 186 1440 226 L1440 320 L0 320 Z"
					fill="#1d0510"
				/>
				<g fill="none" stroke="rgba(243,233,221,.055)" strokeWidth="1.5">
					<path d="M0 244 C240 182 470 198 700 224 C940 252 1170 212 1440 250" />
					<path d="M0 268 C250 212 480 226 710 250 C950 274 1180 240 1440 274" />
					<path d="M0 292 C260 246 490 256 720 276 C960 296 1190 268 1440 298" />
				</g>
			</svg>
			<svg
				data-depth="-16"
				className="pointer-events-none absolute inset-x-0 -bottom-[6%] z-[5] h-[30%] w-full will-change-transform"
				viewBox="0 0 1440 240"
				preserveAspectRatio="none"
				aria-hidden="true"
				focusable="false"
			>
				<path
					d="M0 118 C300 58 560 86 830 116 C1080 144 1290 104 1440 126 L1440 240 L0 240 Z"
					fill="#10020a"
				/>
				<g fill="none" stroke="rgba(201,162,75,.12)" strokeWidth="1.5">
					<path d="M0 146 C310 88 570 112 840 140 C1090 166 1300 130 1440 150" />
					<path d="M0 176 C320 124 580 144 850 168 C1100 192 1310 162 1440 180" />
					<path d="M0 206 C330 162 590 178 860 198 C1110 216 1320 194 1440 210" />
				</g>
			</svg>

			<div
				data-depth="-30"
				data-fade="true"
				className="relative z-[6] -translate-y-[4vh] px-[18px] text-center"
			>
				<p className="kicker hero-fade mb-[1.6rem] text-gold-2 [text-shadow:0_1px_4px_rgba(20,3,10,.95),0_2px_22px_rgba(20,3,10,.8)]">
					{eyebrow}
				</p>
				{title}
				<p className="serif hero-fade mt-[1.2rem] text-[clamp(1.2rem,2.4vw,1.6rem)] text-dim italic [--d:.75s] [text-shadow:0_1px_12px_rgba(20,3,10,.6)]">
					{sub}
				</p>
				{actions && (
					<div className="hero-fade mt-[2.4rem] flex flex-wrap justify-center gap-3.5 [--d:.95s]">
						{actions}
					</div>
				)}
			</div>

			{meta && (
				<>
					<p
						data-depth="-14"
						data-axis="x"
						data-fade="true"
						aria-hidden="true"
						className="ledger absolute bottom-[26px] left-[clamp(18px,4vw,48px)] z-[6] hidden text-[0.64rem] tracking-[0.22em] text-dim md:block"
					>
						{meta[0]}
					</p>
					<p
						data-depth="14"
						data-axis="x"
						data-fade="true"
						aria-hidden="true"
						className="ledger absolute bottom-[26px] right-[clamp(18px,4vw,48px)] z-[6] hidden text-[0.64rem] tracking-[0.22em] text-dim md:block"
					>
						{meta[1]}
					</p>
				</>
			)}
			<div
				aria-hidden="true"
				className="scroll-cue absolute bottom-[18px] left-1/2 z-[6] h-[52px] w-px -translate-x-1/2 overflow-hidden"
			>
				<span />
			</div>
			<HeroParallax />
		</section>
	);
}

/** The store's name as the original's two-line wordmark, the second line in gold italic. */
export function HeroWordmark({ name, as: Heading = "h1" }: { name: string; as?: "h1" | "p" }) {
	const { first, second, ampersand } = wordmarkLines(name);
	const size = name.length > 22 ? "text-[clamp(2.8rem,9vw,6.4rem)]" : "text-[clamp(3.4rem,12vw,9rem)]";
	return (
		<Heading
			className={cn(
				"serif font-medium tracking-[0.01em] text-cream [text-shadow:0_2px_40px_rgba(20,3,10,.5)]",
				size,
				"leading-[0.94]",
			)}
		>
			<span className="hero-line">
				<span>{first}</span>
			</span>
			{second && (
				<span className="hero-line">
					<span>
						{ampersand ? (
							<>
								<em className="mr-[0.06em] font-normal text-gold-2 italic">&amp;</em>
								{second}
							</>
						) : (
							<em className="font-normal text-gold-2 italic">{second}</em>
						)}
					</span>
				</span>
			)}
		</Heading>
	);
}

export async function HomeHero() {
	"use cache";
	cacheLife("minutes");
	const [brand, stats] = await Promise.all([getStoreBrand(), getLedgerStats()]);
	return (
		<LandscapeHero
			eyebrow={`Cellar list · ${stats.pieces} entries`}
			title={<HeroWordmark name={brand.name} />}
			sub={brand.tagline}
			actions={
				<>
					<Link href="#pieces" className="btn btn-primary">
						See the cellar list
					</Link>
					<Link href="#shelves" className="btn">
						The shelves <span aria-hidden="true">→</span>
					</Link>
				</>
			}
			meta={[
				`${stats.shelves} ${stats.shelves === 1 ? "shelf" : "shelves"} · ${stats.collections} ${stats.collections === 1 ? "collection" : "collections"}`,
				`${stats.options} options · one ledger`,
			]}
		/>
	);
}

const LEAD = 4;

/** Nº 01: the four newest pieces as ledger entries, then the way into the whole catalogue. */
export async function PiecesSection() {
	"use cache";
	cacheLife("minutes");
	const { products, total } = await getCatalogProducts();
	// Photographed, priced pieces lead, so the first row never opens on an empty frame or a $0 entry.
	const rank = (p: (typeof products)[number]) =>
		(firstStill(p.images) ? 0 : 2) + (p.variants?.some((v) => Number(v.price) > 0) ? 0 : 1);
	const lead = [...products].sort((a, b) => rank(a) - rank(b)).slice(0, LEAD);
	if (lead.length === 0) return null;
	return (
		<section id="pieces" className="ledger-rule section-y scroll-mt-[var(--header-h)]">
			<div className="container-x">
				<SectionHead
					kicker="Nº 01 — The cellar list"
					title={
						<>
							{numberWord(lead.length)} to begin. <em>No filler.</em>
						</>
					}
					lede="Every bottle has its own entry: grape, vintage, slope and lot, what it costs and whether any is left in the cellar. What you read below is the current account."
				/>
				<div className={LISTING_GRID}>
					{lead.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index < 2} className="reveal" />
					))}
				</div>
				{total > lead.length && (
					<div className="reveal mt-12 text-center">
						<Link href="/products" className="btn">
							Read the whole cellar list — {total} entries <span aria-hidden="true">→</span>
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}

function Vessel({ id }: { id: string }) {
	const bowl = "M34 76 H86 L81 168 C80.6 171 78.5 172 76 172 H44 C41.5 172 39.4 171 39 168 Z";
	return (
		<svg
			className="mb-[1.2rem] h-[164px] w-[104px] overflow-visible"
			viewBox="0 0 120 190"
			aria-hidden="true"
			focusable="false"
		>
			<defs>
				<clipPath id={id}>
					<path d={bowl} />
				</clipPath>
			</defs>
			<line className="pour-stream" x1="60" y1="16" x2="60" y2="168" />
			<g clipPath={`url(#${id})`}>
				<rect className="vessel-fill" x="32" y="76" width="56" height="96" />
				<ellipse className="vessel-surface" cx="60" cy="170" rx="26" ry="3.4" />
			</g>
			<path className="vessel-line" d={bowl} />
			<line className="vessel-line" x1="30" y1="182" x2="90" y2="182" />
			<line className="vessel-shine" x1="41" y1="86" x2="44" y2="134" />
		</svg>
	);
}

/**
 * Nº 02: the original's three club allocations as three price shelves of the catalogue. Each vessel
 * fills to its shelf's depth; the picks and the button link to real products.
 */
export async function ShelvesSection() {
	"use cache";
	cacheLife("minutes");
	const tiers = await getClubTiers();
	if (tiers.length === 0) return null;
	return (
		<section id="shelves" className="ledger-rule section-y scroll-mt-[var(--header-h)]">
			<div className="container-x">
				<SectionHead
					kicker="Nº 02 — The shelves"
					title={
						<>
							Three ways to <em>begin.</em>
						</>
					}
					lede="The whole catalogue, filled three ways — from bottles for an ordinary evening to the ones you lay down for years. Start where you like."
				/>
				<div className="grid items-stretch gap-5 pt-3 lg:grid-cols-3">
					{tiers.map((tier, index) => (
						<PourCard
							key={tier.name}
							fill={tier.fill}
							order={index}
							className={cn(
								"reveal relative flex flex-col items-center rounded-[4px] border px-[clamp(20px,2.6vw,30px)] pb-[clamp(24px,3vw,32px)] pt-[clamp(28px,3.4vw,40px)] text-center transition-[border-color,box-shadow] duration-600 ease-decant",
								tier.featured
									? "border-gold/55 bg-[linear-gradient(180deg,#421224,var(--panel))] shadow-[0_30px_70px_-40px_rgba(0,0,0,.8)] lg:-translate-y-3.5"
									: "border-line bg-panel hover:border-gold/40",
							)}
						>
							{tier.featured && (
								<p className="ledger absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-gold px-3.5 py-1.5 text-[0.62rem] tracking-[0.22em] text-on-gold">
									Most chosen
								</p>
							)}
							<Vessel id={`bowl-${index}`} />
							<h3 className="serif text-[1.9rem] font-medium leading-[1.1] text-gold-2">{tier.name}</h3>
							<p className="serif mb-[1.3rem] mt-[0.3rem] text-[1.12rem] text-dim italic">{tier.who}</p>
							<p className="mb-[1.4rem] flex flex-wrap items-baseline justify-center gap-2">
								<span className="serif text-[2.9rem] font-medium leading-none text-cream">{tier.from}</span>
								<span className="ledger text-[0.68rem] tracking-[0.14em] text-faint">
									{tier.to ? `to ${tier.to}` : "each"}
								</span>
							</p>
							<ul className="mb-[1.8rem] flex flex-col gap-[0.55rem] text-[0.92rem] text-dim">
								{tier.picks.map((pick) => (
									<li key={pick.href}>
										<span aria-hidden="true" className="mr-[0.55em] text-gold">
											—
										</span>
										<Link href={pick.href} className="transition-colors hover:text-gold-2">
											{pick.name}
										</Link>
									</li>
								))}
							</ul>
							<Link href={tier.href} className={cn("btn mt-auto w-full", tier.featured && "btn-primary")}>
								{tier.cta}
							</Link>
						</PourCard>
					))}
				</div>
				<p className="serif reveal mx-auto mt-[2.6rem] max-w-[1200px] text-center text-[1.1rem] text-faint italic">
					Prices are entered as they stand today. Delivery is settled at checkout.
				</p>
			</div>
		</section>
	);
}

/** Nº 03: the pull quote beside two paragraphs, then the catalogue in numbers. */
export async function EstateSection({ kicker = "Nº 03 — The house" }: { kicker?: string }) {
	"use cache";
	cacheLife("minutes");
	const [brand, stats] = await Promise.all([getStoreBrand(), getLedgerStats()]);
	const numbers = [
		{ value: stats.pieces, label: "entries in the ledger" },
		{ value: stats.shelves, label: "shelves" },
		{ value: stats.collections, label: stats.collections === 1 ? "collection" : "collections" },
		{ value: stats.options, label: "options to choose" },
	];
	return (
		<section id="estate" className="ledger-rule section-y">
			<div className="container-x">
				<SectionHead
					kicker={kicker}
					title={
						<>
							Every vintage, <em>one open ledger.</em>
						</>
					}
				/>
				<div className="grid gap-[clamp(28px,5vw,70px)] lg:grid-cols-[1fr_1.1fr]">
					<p className="serif reveal text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.2] text-gold-2 italic">
						“Every lot, every price,
						<br />
						on one open page.”
					</p>
					<div className="space-y-[1.2rem] text-[1.05rem] text-dim">
						<p className="reveal max-w-[58ch]">
							{brand.description ||
								`${brand.name} keeps its books the old way: what each wine is on the left page, what it costs on the right. The habit stuck.`}
						</p>
						<p className="reveal max-w-[58ch]">
							Every entry shows its price, its options and its stock as they stand today — which is why some
							entries are marked <em className="text-cream">few left</em> and some are marked{" "}
							<em className="text-cream">sold out</em>.
						</p>
					</div>
				</div>
				<ul
					aria-label="The catalogue in numbers"
					className="reveal mt-[clamp(48px,7vh,80px)] grid grid-cols-2 border-y border-line md:grid-cols-4"
				>
					{numbers.map((n, index) => (
						<li
							key={n.label}
							className={cn(
								"px-[18px] py-[clamp(22px,3vw,34px)]",
								index > 0 && "border-l border-line-2",
								index === 2 && "max-md:border-l-0",
								index >= 2 && "max-md:border-t max-md:border-line-2",
							)}
						>
							<span className="serif block text-[clamp(2.6rem,5vw,3.8rem)] font-medium leading-none text-cream">
								<Counter value={n.value} />
							</span>
							<span className="ledger mt-[0.7rem] block text-[0.62rem] tracking-[0.18em] text-faint">
								{n.label}
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** Nº 04: the booking card, retold as a shelf-and-budget finder over the real catalogue. */
export async function FinderSection() {
	"use cache";
	cacheLife("minutes");
	const [categories, bands] = await Promise.all([getCategoryTiles(5), getBudgetBands()]);
	return (
		<section id="find" className="ledger-rule section-y">
			<div className="container-x">
				<SectionHead
					kicker="Nº 04 — Find your bottle"
					title={
						<>
							The ledger keeps <em>short lists</em> on purpose.
						</>
					}
					lede="Pick a shelf and a budget; we will open the right page."
				/>
				<PieceFinder
					shelves={categories.map((c) => ({ id: c.slug, label: c.name }))}
					bands={bands.map(({ id, label, ...range }) => ({
						id,
						label,
						...("priceMin" in range ? { priceMin: range.priceMin } : {}),
						...("priceMax" in range ? { priceMax: range.priceMax } : {}),
					}))}
				/>
			</div>
		</section>
	);
}

/** The closing line and one gold button. */
export function Closer({
	line = (
		<>
			Good things keep their own <em>accounts.</em>
		</>
	),
	href = "/products",
	cta = "Open the ledger",
}: {
	line?: React.ReactNode;
	href?: string;
	cta?: string;
}) {
	return (
		<section className="px-[clamp(18px,4vw,48px)] py-[clamp(100px,18vh,200px)] text-center">
			<p className="display reveal mb-[2.2rem] text-[clamp(2.4rem,7vw,5.4rem)] leading-[1.08] text-cream">
				{line}
			</p>
			<Link href={href} className="btn btn-primary reveal">
				{cta}
			</Link>
		</section>
	);
}
