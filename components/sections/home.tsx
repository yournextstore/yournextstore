import { cacheLife } from "next/cache";
import Link from "next/link";
import { FlavourPicker } from "@/components/flavour-picker";
import {
	countWord,
	getCategoryTiles,
	getShopReport,
	getShowcaseProducts,
	pick,
	type ShowcaseProduct,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Heavy uppercase heading with an optional lede underneath; used by the listing pages too. */
export function SectionHead({
	title,
	lede,
	eyebrow,
	as: Heading = "h2",
	className,
}: {
	title: React.ReactNode;
	lede?: React.ReactNode;
	eyebrow?: React.ReactNode;
	as?: "h1" | "h2";
	className?: string;
}) {
	return (
		<div className={className}>
			{eyebrow && (
				<p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-ink-soft">{eyebrow}</p>
			)}
			<Heading className="display wrap-break-word text-side text-ink">{title}</Heading>
			{lede && <p className="mt-4 max-w-xl text-lede text-ink">{lede}</p>}
		</div>
	);
}

/**
 * A product floating like the original's 3D can: the studio photo multiplied onto the panel colour
 * (its off-white backdrop disappears), tilted, with a soft shadow underneath and a slow bob.
 */
export function FloatPhoto({
	src,
	tilt = 0,
	delay = 0,
	priority = false,
	sizes,
	className,
}: {
	src: string;
	tilt?: number;
	delay?: number;
	priority?: boolean;
	sizes: string;
	className?: string;
}) {
	return (
		<div
			aria-hidden="true"
			className={cn("float-photo float-soft pointer-events-none relative aspect-square", className)}
			style={{ ["--tilt" as never]: `${tilt}deg`, ["--bob-delay" as never]: `${delay}s` }}
		>
			<div className="bob absolute inset-0" style={{ rotate: `${tilt}deg` }}>
				<YNSMedia src={src} alt="" fill sizes={sizes} priority={priority} className="object-contain" />
			</div>
		</div>
	);
}

/** Thirty soft bubbles at fixed, scattered positions: the hero's fizz without a WebGL canvas. */
function Bubbles() {
	const bubbles = Array.from({ length: 30 }, (_, i) => {
		const size = 6 + ((i * 37) % 22);
		return {
			left: `${(i * 53) % 100}%`,
			size,
			duration: `${11 + ((i * 7) % 9)}s`,
			delay: `-${(i * 13) % 17}s`,
		};
	});
	return (
		<div aria-hidden="true" className="bubbles">
			{bubbles.map((b, i) => (
				<span
					key={`bubble-${i}`}
					style={{
						left: b.left,
						width: b.size,
						height: b.size,
						["--d" as never]: b.duration,
						["--delay" as never]: b.delay,
					}}
				/>
			))}
		</div>
	);
}

/**
 * The hero: the two-line orange headline over the yellow, a navy subhead and
 * the one orange button, two products floating either side where the cans tumbled in.
 */
export async function HomeHero() {
	"use cache";
	cacheLife("minutes");
	const [report, showcase] = await Promise.all([getShopReport(), getShowcaseProducts()]);
	const left = showcase[0];
	const right = showcase[1] ?? showcase[0];

	return (
		<section className="relative -mt-20 overflow-hidden md:-mt-24">
			<Bubbles />
			<div className="shell relative grid min-h-[min(100svh,60rem)] place-items-center pb-14 pt-28 md:pt-32">
				<div className="relative z-[2] grid auto-rows-min place-items-center text-center">
					<h1 className="display text-hero text-flame">
						<span className="block">Feel</span>
						<span className="block">Good</span>
					</h1>
					<p className="mt-10 text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-none text-ink">
						Soda, perfected
					</p>
					<p className="mt-3 text-[clamp(1.15rem,1.7vw,1.5rem)] text-ink">
						{report.total} {report.total === 1 ? "drink" : "drinks"}. {report.sections}{" "}
						{report.sections === 1 ? "section" : "sections"}. Plenty of fizz.
					</p>
					<Link href="/products" className="btn mt-10 md:[--btn-size:1.5rem] md:[--btn-py:1rem]">
						Shop now
					</Link>
					{left && right && (
						<div className="mt-8 flex w-full max-w-sm justify-between md:hidden">
							<FloatPhoto src={left.image} tilt={-14} sizes="45vw" className="w-[46%]" />
							<FloatPhoto src={right.image} tilt={12} delay={1.2} sizes="45vw" className="w-[46%]" />
						</div>
					)}
				</div>
				{left && right && (
					<>
						<FloatPhoto
							src={left.image}
							tilt={-18}
							priority
							sizes="30vw"
							className="absolute left-[-2%] top-[22%] z-[1] hidden w-[clamp(16rem,30vw,30rem)] md:block"
						/>
						<FloatPhoto
							src={right.image}
							tilt={16}
							delay={1.5}
							priority
							sizes="30vw"
							className="absolute right-[-2%] top-[14%] z-[1] hidden w-[clamp(16rem,30vw,30rem)] md:block"
						/>
					</>
				)}
			</div>
		</section>
	);
}

/** The original's "try all five flavors" lime panel: three products in a tumbling cluster, then the categories. */
export async function TryAll() {
	"use cache";
	cacheLife("minutes");
	const [categories, showcase] = await Promise.all([getCategoryTiles(8), getShowcaseProducts()]);
	const cluster = [2, 3, 4].map((i) =>
		pick(
			showcase.map((p) => p.image),
			i,
		),
	);
	const flavours = categories.length;

	return (
		<section className="relative overflow-hidden bg-lime">
			<div className="shell grid min-h-[min(100svh,52rem)] items-center gap-8 py-16 md:grid-cols-2 md:gap-12">
				<div className="relative mx-auto aspect-square w-full max-w-[34rem]">
					{cluster[0] && (
						<FloatPhoto
							src={cluster[0]}
							tilt={-10}
							sizes="(max-width: 768px) 60vw, 26vw"
							className="absolute left-0 top-[4%] w-[58%]"
						/>
					)}
					{cluster[1] && (
						<FloatPhoto
							src={cluster[1]}
							tilt={9}
							delay={0.8}
							sizes="(max-width: 768px) 60vw, 26vw"
							className="absolute right-0 top-0 w-[54%]"
						/>
					)}
					{cluster[2] && (
						<FloatPhoto
							src={cluster[2]}
							tilt={-4}
							delay={1.6}
							sizes="(max-width: 768px) 60vw, 26vw"
							className="absolute bottom-0 left-[22%] w-[60%]"
						/>
					)}
				</div>
				<div>
					<h2 className="display text-side text-ink">
						Explore all {flavours > 1 ? countWord(flavours) : "the"} {flavours === 1 ? "section" : "sections"}
					</h2>
					<p className="mt-5 max-w-xl text-lede text-ink">
						Single-flavour cases, mixed packs and the glasses to pour them into. Have a look round and find
						your flavour.
					</p>
					{categories.length > 0 && (
						<ul className="mt-7 flex flex-wrap gap-2.5">
							{categories.map((category) => (
								<li key={category.id}>
									<Link
										href={category.href}
										className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 pb-1.5 pt-2 text-[1.05rem] font-bold text-ink transition-colors hover:bg-ink hover:text-lime"
									>
										{category.name}
										<span className="text-sm font-semibold opacity-80">{category.count}</span>
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	);
}

/** The sky dive, frozen mid-fall: a tilted product among clouds, the headline's words scattered round it. */
export async function SkyDive() {
	"use cache";
	cacheLife("minutes");
	const showcase = await getShowcaseProducts();
	const hero = showcase[5] ?? showcase[0];
	const words = ["Dive", "into", "better", "days"];

	return (
		<section className="clouds relative overflow-hidden">
			<h2 className="sr-only">Dive into better days</h2>
			<div
				aria-hidden="true"
				className="shell relative grid min-h-[min(100svh,56rem)] grid-rows-4 items-center py-10 text-[clamp(3.6rem,13vw,11rem)] font-black uppercase leading-none text-flame"
			>
				{words.map((word, i) => (
					<span
						key={word}
						className={cn(
							"block whitespace-nowrap",
							i % 2 === 0 ? "justify-self-start md:pl-[6%]" : "justify-self-end md:pr-[6%]",
						)}
					>
						{word}
					</span>
				))}
				{hero && (
					<FloatPhoto
						src={hero.image}
						tilt={-24}
						sizes="(max-width: 768px) 70vw, 34rem"
						className="absolute left-1/2 top-1/2 w-[min(72vw,34rem)] -translate-x-1/2 -translate-y-1/2"
					/>
				)}
			</div>
		</section>
	);
}

/** The carousel: up to eight products, one per panel colour. */
export async function Flavours() {
	"use cache";
	cacheLife("minutes");
	const showcase = await getShowcaseProducts();
	const items = showcase.slice(0, 8);
	if (items.length === 0) return null;
	return <FlavourPicker items={items} />;
}

const BAND_GROUNDS = ["bg-sun", "bg-blush", "bg-lilac", "bg-lime"];

/**
 * The alternating text sections ("Gut-Friendly Goodness", "Light Calories, Big Flavor"…), one per
 * category: a frosted card of copy on one side, the category's product floating on the other,
 * each band in the next flavour colour.
 */
export async function CategoryBands() {
	"use cache";
	cacheLife("minutes");
	const categories = (await getCategoryTiles(4)).filter((c) => c.image);
	if (categories.length === 0) return null;

	return (
		<div>
			{categories.map((category, i) => (
				<section
					key={category.id}
					className={cn("relative overflow-hidden", BAND_GROUNDS[i % BAND_GROUNDS.length])}
				>
					<div className="shell grid min-h-[min(100svh,48rem)] items-center gap-6 py-16 md:grid-cols-2 md:gap-12">
						<div
							className={cn(
								"relative z-[1] rounded-lg bg-white/30 p-5 backdrop-blur-lg md:bg-transparent md:p-4 md:backdrop-blur-none",
								i % 2 === 1 && "md:col-start-2 md:row-start-1",
							)}
						>
							<h2 className="text-[clamp(2.6rem,5vw,3.75rem)] font-bold leading-[1.02] text-ink">
								{category.name}
							</h2>
							<p className="mt-4 max-w-lg text-[1.25rem] text-ink">
								{category.description ||
									`${category.count} ${category.count === 1 ? "pick" : "picks"} to try, each one picked to brighten your day.`}
							</p>
							<Link href={category.href} className="btn btn-sm mt-6">
								Shop {category.name}
							</Link>
						</div>
						{category.image && (
							<FloatPhoto
								src={category.image}
								tilt={i % 2 === 0 ? 8 : -8}
								delay={i * 0.7}
								sizes="(max-width: 768px) 80vw, 40vw"
								className={cn("mx-auto w-full max-w-[30rem]", i % 2 === 1 && "md:col-start-1 md:row-start-1")}
							/>
						)}
					</div>
				</section>
			))}
		</div>
	);
}

/**
 * The big-type band: giant lemon type on tangerine. Drawn as SVG text, so each line
 * spans the width at any viewport (textLength) and the decorative colour pair is not read as body text.
 */
export function BigText() {
	const line = (text: string, y: number, size: number) => (
		<text x="0" y={y} fontSize={size} textLength="1000" lengthAdjust="spacingAndGlyphs" fontWeight="900">
			{text}
		</text>
	);
	return (
		<section className="overflow-hidden bg-tangerine">
			<h2 className="sr-only">Sips that make you smile</h2>
			<div aria-hidden="true" className="px-3 py-10 md:px-4">
				<svg aria-hidden="true" viewBox="0 0 1000 820" className="hidden h-auto w-full fill-lemon md:block">
					{line("SIPS", 300, 330)}
					{line("THAT MAKE YOU", 480, 150)}
					{line("SMILE", 800, 330)}
				</svg>
				<svg aria-hidden="true" viewBox="0 0 1000 1900" className="h-auto w-full fill-lemon md:hidden">
					{line("SIPS", 330, 360)}
					{line("THAT", 680, 360)}
					{line("MAKE", 1030, 360)}
					{line("YOU", 1380, 360)}
					{line("SMILE", 1730, 360)}
				</svg>
			</div>
		</section>
	);
}

export type { ShowcaseProduct };
