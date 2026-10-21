import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { CountUp, WaveMeter } from "@/components/report-motion";
import { Shelf } from "@/components/shelf";
import { getCatalogProducts, getShopReport, getStoreBrand } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import poster from "@/public/images/poster.jpg";

/** The faint outlined word behind a section. */
export function Watermark({ children, className }: { children: string; className?: string }) {
	return (
		<span aria-hidden="true" className={cn("watermark", className)}>
			{children}
		</span>
	);
}

/** "[ The goods ]" kicker, then a Bebas heading; optional lede underneath. */
export function SectionHead({
	kicker,
	title,
	lede,
	as: Heading = "h2",
	className,
}: {
	kicker: string;
	title: React.ReactNode;
	lede?: React.ReactNode;
	as?: "h1" | "h2";
	className?: string;
}) {
	return (
		<div className={className}>
			<p className="kicker mb-4">[ {kicker} ]</p>
			<Heading className="display wrap-break-word text-[clamp(2.6rem,6vw,4.6rem)]">{title}</Heading>
			{lede && <p className="mt-4 max-w-[54ch] text-[1.06rem] text-dim">{lede}</p>}
		</div>
	);
}

/** Up to three letters for the stamp's centre: the store's initials. */
function monogram(name: string) {
	const words = name.split(/\s+/).filter((word) => /\p{L}/u.test(word));
	const letters = words.length > 1 ? words.map((word) => word[0]) : [name.slice(0, 2)];
	return letters.join("").slice(0, 3).toUpperCase();
}

/** The rubber stamp: the store's name running round a slowly turning ring, two swells in the middle. */
export function StampBadge({ name, className }: { name: string; className?: string }) {
	const ring = `${name} · small runs · no hype ·`.toUpperCase();
	return (
		<svg
			viewBox="0 0 200 200"
			role="img"
			aria-label={`${name} stamp: small runs, no hype`}
			className={cn("pointer-events-none h-auto drop-shadow-[0_10px_24px_rgb(38_50_58/0.28)]", className)}
		>
			<defs>
				<path id="badge-arc" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
			</defs>
			<circle cx="100" cy="100" r="97" fill="var(--foam)" stroke="var(--ink)" strokeWidth="2.5" />
			<circle
				cx="100"
				cy="100"
				r="88"
				fill="none"
				stroke="var(--ink)"
				strokeWidth="1"
				strokeDasharray="1 5"
				opacity=".7"
			/>
			<g className="badge-ring">
				<text
					fill="var(--ink)"
					fontSize="19.5"
					letterSpacing="2.6"
					style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', Impact, sans-serif" }}
				>
					<textPath href="#badge-arc" startOffset="0" textLength="446" lengthAdjust="spacing">
						{ring}
					</textPath>
				</text>
			</g>
			<g>
				<path
					d="M58 106 Q70 84 82 96 T106 96 T130 92 T146 88"
					fill="none"
					stroke="var(--denim)"
					strokeWidth="4"
					strokeLinecap="round"
				/>
				<path
					d="M62 122 Q74 106 86 114 T110 112 T134 106"
					fill="none"
					stroke="var(--coral)"
					strokeWidth="3"
					strokeLinecap="round"
					opacity=".9"
				/>
				<text
					x="100"
					y="75"
					textAnchor="middle"
					fill="var(--ink)"
					fontSize="30"
					style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', Impact, sans-serif" }}
				>
					{monogram(name)}
				</text>
			</g>
		</svg>
	);
}

/** A photograph pinned like a faded poster: foam border, a degree off true, mono caption underneath. */
export function Poster({
	children,
	caption,
	className,
	tilt = "-rotate-[1.1deg]",
}: {
	children: React.ReactNode;
	caption?: [string, string];
	className?: string;
	tilt?: string;
}) {
	return (
		<figure className={cn("relative", className)}>
			<div
				className={cn(
					"relative rounded-md border border-line bg-foam p-[clamp(10px,1.6vw,16px)] shadow-poster",
					tilt,
				)}
			>
				{children}
			</div>
			{caption && (
				<figcaption className="label-mono mt-3.5 flex flex-wrap justify-between gap-3 px-1.5 text-faint">
					<span>{caption[0]}</span>
					<span>{caption[1]}</span>
				</figcaption>
			)}
		</figure>
	);
}

/** The poster hero: mono notes in the corners, the two-line Bebas headline, two pills, the tilted print. */
export async function HomeHero() {
	"use cache";
	cacheLife("minutes");
	const [brand, report] = await Promise.all([getStoreBrand(), getShopReport()]);

	return (
		<section className="relative mx-auto max-w-[1240px] overflow-x-clip px-[clamp(18px,4vw,44px)] pb-[clamp(40px,6vh,72px)] pt-6 text-center md:pt-[clamp(40px,8vh,90px)]">
			<div className="label-mono flex flex-wrap justify-center gap-x-5 gap-y-2.5 text-[0.66rem] leading-[1.8] text-faint md:justify-between md:text-left">
				<p>
					{brand.name}
					<br />
					small runs · honest pieces
				</p>
				<p className="md:text-right">
					{report.total} pieces · {report.sections} sections
					<br />
					{report.minPrice ? `from ${report.minPrice}` : "new arrivals weekly"}
				</p>
			</div>

			<h1 className="display relative z-[3] mt-5 md:whitespace-nowrap text-[clamp(4.2rem,13.5vw,11.5rem)] leading-[0.88] tracking-[0.005em] md:mt-[clamp(1rem,3vh,2rem)]">
				<span className="block">Made for the</span>
				<span className="block">
					<em>next</em> wave.
				</span>
			</h1>
			<p className="relative z-[3] mx-auto mb-7 mt-6 max-w-[56ch] text-[clamp(1rem,1.3vw,1.14rem)] text-dim">
				And the quiet days before it. Small runs of well-made pieces, photographed as they are and priced
				plainly — for people who would rather wear things than chase them.
			</p>
			<div className="relative z-[3] flex flex-wrap justify-center gap-3.5">
				<Link href="#goods" className="btn">
					See the goods
				</Link>
				<Link href="#report" className="btn btn-ghost">
					Check the shop report <span aria-hidden="true">→</span>
				</Link>
			</div>

			<Poster
				className="relative z-[2] mx-auto mt-8 max-w-[1060px] md:-mt-[clamp(0.6rem,1.2vw,1.6rem)]"
				caption={["Fig. 01 — high noon, low expectations", "overexposed on purpose"]}
			>
				<Image
					src={poster}
					alt="A surfer carries a pale longboard along wet sand at noon, whitewater breaking behind them under a sun-bleached sky."
					priority
					sizes="(max-width: 1100px) 92vw, 1030px"
					className="faded h-auto w-full rounded-[2px]"
				/>
				<StampBadge
					name={brand.name}
					className="absolute -right-0.5 -top-[30px] w-[100px] rotate-6 md:-right-[30px] md:-top-[52px] md:w-[clamp(120px,15vw,184px)]"
				/>
			</Poster>
		</section>
	);
}

function ReportTile({
	label,
	value,
	note,
	className,
}: {
	label: string;
	value: React.ReactNode;
	note: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex min-h-[150px] flex-col gap-2 bg-foam p-[clamp(18px,2.4vw,28px)]", className)}>
			<span className="label-mono text-[0.66rem] tracking-[0.2em] text-denim-deep">{label}</span>
			<span className="mono text-[clamp(1.7rem,2.6vw,2.3rem)] font-bold leading-none tabular-nums">
				{value}
			</span>
			<span className="mt-auto text-[0.86rem] text-faint">{note}</span>
		</div>
	);
}

/** The surf report, now a shop report: six tiles of real catalogue numbers in a hairline grid. */
export async function ShopReport() {
	"use cache";
	cacheLife("minutes");
	const report = await getShopReport();

	return (
		<section
			id="report"
			className="relative overflow-hidden border-y border-line bg-foam py-[clamp(72px,11vh,130px)]"
		>
			<Watermark className="-left-[2vw] top-1.5">Report</Watermark>
			<div className="shell relative z-[1]">
				<div className="mb-8 flex flex-wrap items-baseline justify-between gap-3.5">
					<h2 className="kicker">[ The shop today ]</h2>
					<p className="label-mono text-[0.7rem] tracking-[0.12em] text-faint">
						report filed — from the stockroom
					</p>
				</div>
				<div className="grid grid-cols-1 gap-px overflow-hidden rounded-tile border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
					<ReportTile
						label="On the shelf"
						value={
							<>
								<CountUp value={report.total} /> <span className="text-[0.6em]">pcs</span>
							</>
						}
						note="if you count every colour twice"
					/>
					<ReportTile
						label="Prices"
						value={<span className="text-[0.8em]">{report.minPrice ?? "—"}</span>}
						note={report.maxPrice ? `and up to ${report.maxPrice}. no surprises` : "no surprises"}
					/>
					<ReportTile
						label="Sections"
						value={<CountUp value={report.sections} />}
						note={report.biggest ? `most of it in ${report.biggest.name.toLowerCase()}` : "start anywhere"}
					/>
					<ReportTile
						label="In stock"
						value={
							<>
								<CountUp value={report.inStock} />
								<span className="text-[0.55em] text-faint"> / {report.total}</span>
							</>
						}
						note="the rest come back when they come back"
					/>
					<div className="flex min-h-[150px] flex-col gap-2 bg-foam p-[clamp(18px,2.4vw,28px)] sm:col-span-2">
						<span className="label-mono text-[0.66rem] tracking-[0.2em] text-denim-deep">
							Latest arrival — {report.variants} options in all
						</span>
						<WaveMeter />
						<span className="mt-auto text-[0.86rem] text-faint">
							{report.newest ? (
								<Link href={report.newest.href} className="underline underline-offset-3 hover:text-ink">
									{report.newest.name}
								</Link>
							) : (
								"long, lazy lines. our favourite kind of queue"
							)}
						</span>
					</div>
					<div className="flex min-h-[150px] flex-col gap-2 bg-sand p-[clamp(18px,2.4vw,28px)] sm:col-span-2">
						<span className="label-mono text-[0.66rem] tracking-[0.2em] text-denim-deep">Verdict</span>
						<span className="display text-[clamp(2rem,3.4vw,2.9rem)] leading-[0.95]">
							Good day to browse. <span className="text-coral-deep">Obviously.</span>
						</span>
						<span className="mt-auto text-[0.86rem] text-faint">
							small runs. when it&rsquo;s gone, it&rsquo;s gone
						</span>
					</div>
				</div>
				<p className="label-mono mt-5 tracking-[0.1em] text-faint">
					Trust this report until it changes, which is soon. Stock moves faster than the tide.
				</p>
			</div>
		</section>
	);
}

const SHELF_SIZE = 8;

/** "Six things. Zero hype.": the sideways shelf of priced cards. */
export async function GoodsShelf() {
	"use cache";
	cacheLife("minutes");
	const { products, total } = await getCatalogProducts();
	const pictured = products.filter((p) => p.images.length > 0);
	const available = pictured.filter((p) => p.variants.some((v) => v.stock !== 0));
	// One per section first, so the shelf shows the range of the shop, then the newest of the rest;
	// sold-out pieces only top up a shelf that would otherwise look bare.
	const firsts = available.filter(
		(p, index) => available.findIndex((other) => other.category?.id === p.category?.id) === index,
	);
	const inStock = [...firsts, ...available.filter((p) => !firsts.includes(p))];
	const topUp = inStock.length >= 6 ? [] : pictured.filter((p) => !inStock.includes(p));
	const shelf = [...inStock, ...topUp].slice(0, SHELF_SIZE);
	const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

	return (
		<section
			id="goods"
			className="relative overflow-x-clip pb-[clamp(48px,7vh,80px)] pt-[clamp(72px,11vh,130px)]"
		>
			<Watermark className="-left-[2vw] -top-3.5">The goods</Watermark>
			<div className="shell relative z-[1] mb-6">
				<SectionHead
					kicker="The goods"
					title={<>{words[shelf.length] ?? shelf.length} things. Zero&nbsp;hype.</>}
					lede="Small runs, honest materials, colours that hold. Everything here is photographed as it is and priced plainly."
				/>
				<p aria-hidden="true" className="label-mono mt-5 tracking-[0.18em] text-faint">
					drag the shelf · or scroll it sideways
				</p>
			</div>
			<Shelf>
				{shelf.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						priority={index < 2}
						sizes="344px"
						className="tilt-card w-[clamp(272px,26vw,344px)] flex-none snap-center"
					/>
				))}
			</Shelf>
			<div className="shell mt-8">
				<Link href="/products" className="btn btn-ghost">
					See all {total} pieces <span aria-hidden="true">→</span>
				</Link>
			</div>
		</section>
	);
}

/** "Not a postcard. A coastline.": a big denim number beside three paragraphs. */
export async function StoryBand({ cta = true }: { cta?: boolean }) {
	"use cache";
	cacheLife("minutes");
	const [brand, report] = await Promise.all([getStoreBrand(), getShopReport()]);

	return (
		<section id="story" className="relative overflow-hidden bg-sand py-[clamp(72px,11vh,130px)]">
			<Watermark className="-bottom-6 -right-[3vw]">The story</Watermark>
			<div className="shell relative z-[1] grid items-start gap-[clamp(30px,5vw,70px)] min-[900px]:grid-cols-[0.8fr_1.2fr]">
				<div className="border-t-2 border-ink pt-5">
					<span className="display block text-[clamp(6rem,12vw,10.5rem)] leading-[0.9] text-denim">
						<CountUp value={report.total} />
					</span>
					<span className="label-mono mt-3 block text-[0.72rem] leading-[2] text-faint">
						pieces in the shop right now.
						<br />
						none of them in a hurry.
					</span>
				</div>
				<div>
					<SectionHead kicker="The story" title={<>Not a catalogue. A&nbsp;shelf.</>} />
					<div className="space-y-[1.1rem] pt-[1.1rem] text-[1.04rem] text-dim [&_p]:max-w-[58ch]">
						<p>
							This is a small shop with a short list. Things arrive in small runs, get photographed as they
							are, and sit on the shelf until someone takes them home. Nothing here was made to trend.
						</p>
						<p>
							We started {brand.name} because most of what we could buy was made for somewhere else — for a
							feed, a season, a campaign. Ours is made for ordinary days, which turn out to be most of the
							year.
						</p>
						<p>
							The waiting is most of it: for the right material, the right run, the right moment to put
							something out. The pieces should be good at waiting too.
						</p>
					</div>
					{cta && (
						<Link href="/about" className="btn btn-ghost mt-8">
							Read the whole story <span aria-hidden="true">→</span>
						</Link>
					)}
				</div>
			</div>
		</section>
	);
}

/** The ink drop band: the next-drop pitch beside the one-email sign-up. */
export function DropBand() {
	return (
		<section
			id="drop"
			className="bg-ink py-[clamp(72px,11vh,130px)] text-foam selection:bg-coral selection:text-ink [&_:focus-visible]:outline-coral"
		>
			<div className="shell grid items-center gap-[clamp(30px,5vw,70px)] min-[920px]:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
				<div>
					<p className="kicker mb-4 text-coral">[ Next drop ]</p>
					<h2 className="display text-[clamp(2.6rem,6vw,4.6rem)] text-foam">
						New pieces —
						<br />
						first to your inbox.
					</h2>
					<p className="mt-4 max-w-[46ch] text-[#b6c0c7]">
						Small runs sell through. Get one note when something new lands, before it reaches the shelf. It
						drops when it drops; the email is a courtesy.
					</p>
				</div>
				<NewsletterForm />
			</div>
		</section>
	);
}

/** Four numbers over the outlined "In numbers" watermark. */
export async function StatsBand() {
	"use cache";
	cacheLife("minutes");
	const report = await getShopReport();
	const stats = [
		{ value: report.total, unit: "", label: "pieces on the shelf", cap: "counted, not estimated" },
		{ value: report.photos, unit: "", label: "photographs", cap: "of the goods, as they are" },
		{ value: report.sections, unit: "", label: "sections to browse", cap: "start anywhere" },
		{ value: report.variants, unit: "", label: "options to pick from", cap: "sizes and colours, mostly" },
	];

	return (
		<section
			aria-label="The shop in numbers"
			className="relative overflow-hidden py-[clamp(72px,11vh,130px)]"
		>
			<Watermark className="-bottom-[30px] -left-[2vw]">In numbers</Watermark>
			<div className="shell relative z-[1] grid grid-cols-2 gap-x-[clamp(20px,3vw,30px)] gap-y-[clamp(26px,4vw,40px)] min-[860px]:grid-cols-4">
				{stats.map((stat) => (
					<div key={stat.label} className="border-t-2 border-ink pt-[1.1rem]">
						<span className="display block text-[clamp(3rem,5.6vw,4.8rem)] leading-none">
							<CountUp value={stat.value} />
						</span>
						<span className="label-mono mt-3 block text-[0.66rem] tracking-[0.18em] text-denim-deep">
							{stat.label}
						</span>
						<span className="mt-1 block text-[0.88rem] italic text-faint">{stat.cap}</span>
					</div>
				))}
			</div>
		</section>
	);
}
