import Link from "next/link";
import { getSocialLinks } from "@/app/footer";
import { ProductCard } from "@/components/product-card";
import { Wave } from "@/components/wave";
import { type CategoryShowcase, getHomeProducts, pick } from "@/lib/catalog";
import { sentenceCase } from "@/lib/display";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

const IMAGE_FRAME = "relative overflow-hidden rounded-lg bg-gray-100";

/** Hero: big bold title on the left third, two overlapping square photographs on the right. */
export async function Hero({
	frames,
	featured,
}: {
	frames: readonly [string, string];
	featured: { name: string; slug: string }[];
}) {
	const socials = await getSocialLinks();
	return (
		<div className="mx-auto max-w-7xl bg-white pb-6 pt-14 sm:pb-8 lg:pb-12">
			<section className="mx-auto max-w-screen-2xl px-4 md:px-8">
				<div className="mb-8 flex flex-wrap justify-between md:mb-16">
					<div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
						<h1 className="mb-4 text-4xl font-bold text-ink sm:text-5xl md:mb-8 md:text-6xl">
							Find your style
						</h1>
						<p className="max-w-md leading-relaxed text-muted-foreground xl:text-lg">
							Knits for frost, linen for heat and a coat for every turn of the weather. Dress the season you
							are in, from the first snow to the last warm evening.
						</p>
					</div>
					<div className="mb-12 flex w-full md:mb-16 lg:w-2/3">
						<div
							className={cn(
								IMAGE_FRAME,
								"relative left-12 top-12 z-10 -ml-12 h-[550px] w-[550px] shadow-lg md:left-16 md:top-16 lg:ml-0",
							)}
						>
							{frames[0] && (
								<YNSMedia
									src={frames[0]}
									alt=""
									fill
									priority
									sizes="(max-width: 992px) 55vw, 38vw"
									className="object-cover object-[50%_30%]"
								/>
							)}
						</div>
						<div className={cn(IMAGE_FRAME, "h-[550px] w-[550px] shadow-lg")}>
							{frames[1] && (
								<YNSMedia
									src={frames[1]}
									alt=""
									fill
									priority
									sizes="(max-width: 992px) 55vw, 38vw"
									className="object-cover object-[50%_30%]"
								/>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center justify-between gap-8 md:flex-row">
					{featured.length > 0 && (
						<nav
							aria-label="Featured categories"
							className="flex min-h-12 w-full max-w-md divide-x divide-border overflow-hidden rounded-lg border border-border"
						>
							{featured.map((category) => (
								<Link
									key={category.slug}
									href={`/category/${category.slug}`}
									className="flex min-w-0 flex-1 items-center justify-center px-2 py-2 text-center text-sm leading-tight text-muted-foreground [overflow-wrap:anywhere] sm:px-3 sm:text-base transition duration-100 hover:bg-gray-100 active:bg-gray-200"
								>
									{category.name}
								</Link>
							))}
						</nav>
					)}
					{socials.length > 0 && (
						<div className="flex items-center justify-center gap-4 lg:justify-start">
							<span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground sm:text-base">
								Socials
							</span>
							<span aria-hidden className="h-px w-12 bg-subtle" />
							<ul className="flex gap-4">
								{socials.map((social) => (
									<li key={social.href}>
										<a
											href={social.href}
											rel="noreferrer"
											target="_blank"
											className="text-sm text-muted-foreground transition duration-100 hover:text-ink"
										>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}

/** "Your one stop shop" divider: right-aligned title, the wave turned upright, copy and a button. */
export function Divider() {
	return (
		<div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-center px-8 py-16 text-center sm:px-20 lg:text-left">
			<div className="w-full lg:flex-1 lg:text-right">
				<p className="ds-pretitle">Four seasons, one wardrobe</p>
				<h2 className="ds-heading mt-3 text-black">Dressed for the weather</h2>
			</div>
			<div className="w-full text-center lg:w-auto">
				<Wave className="-mb-10 -mt-4 size-32 lg:-ml-8 lg:mb-0 lg:mt-0 lg:rotate-90" />
			</div>
			<div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-md lg:flex-1">
				<p>
					Fewer, better pieces for each season: wool when it snows, linen when it is hot and denim for
					everything in between.
				</p>
				<Link href="/products" className="ds-btn mt-4 uppercase">
					Start now
				</Link>
			</div>
		</div>
	);
}

const SHOWCASE_COPY = [
	{
		pretitle: "Featured",
		description: "The pieces our customers reach for again and again, whatever the weather.",
		cta: "Explore",
	},
	{
		pretitle: "In the shop",
		description: "Small batches that rarely come back. Get yours while the season lasts.",
		cta: "Browse it",
	},
	{
		pretitle: "Just in",
		description: "Fresh pieces to add to your wardrobe for the months ahead.",
		cta: "Get it",
	},
	{
		pretitle: "Worth a look",
		description: "Be the first to wear the new colours of the season.",
		cta: "See more",
	},
] as const;

function ShowcaseCopy({ showcase, index }: { showcase: CategoryShowcase; index: number }) {
	const copy = SHOWCASE_COPY[index % SHOWCASE_COPY.length] ?? SHOWCASE_COPY[0];
	return (
		<div className="relative z-10 min-w-0 px-4 py-12 sm:p-12">
			<p className="text-sm uppercase tracking-widest text-gray-700">{copy.pretitle}</p>
			<h2 className="mt-2 text-3xl font-semibold [overflow-wrap:anywhere]">{sentenceCase(showcase.name)}</h2>
			<p className="mx-auto mt-3 max-w-md">{copy.description}</p>
			<Link href={`/category/${showcase.slug}`} className="ds-btn mt-6 py-4 [--btn-h:auto]">
				{copy.cta}
			</Link>
		</div>
	);
}

/**
 * The original's season block: a tall photograph over two grid rows, the copy in the quarter
 * beside it and two small photographs under the copy. `textFirst` mirrors it.
 */
export function Showcase({
	showcase,
	index,
	photo,
	textFirst,
}: {
	showcase: CategoryShowcase;
	index: number;
	/** The editorial photograph for the tall frame; the small frames show the category's products. */
	photo: string | null;
	textFirst: boolean;
}) {
	const big = photo ?? showcase.frames[0] ?? null;
	const smalls = [pick(showcase.frames, 0), pick(showcase.frames, 1)];
	return (
		<section
			aria-label={sentenceCase(showcase.name)}
			className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 text-gray-700 md:h-svh md:max-h-[60rem] md:min-h-[40rem] md:grid-cols-4 md:grid-rows-2"
		>
			<div
				className={cn("hidden items-center justify-center text-center md:col-span-2", textFirst && "md:flex")}
			>
				{textFirst && <ShowcaseCopy showcase={showcase} index={index} />}
			</div>
			<div className={cn(IMAGE_FRAME, "h-[36rem] sm:h-[700px] md:col-span-2 md:row-span-2 md:h-auto")}>
				{big && (
					<YNSMedia
						src={big}
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 640px"
						className="object-cover object-[50%_30%]"
					/>
				)}
			</div>
			<div
				className={cn("flex items-center justify-center text-center md:col-span-2", textFirst && "md:hidden")}
			>
				<ShowcaseCopy showcase={showcase} index={index} />
			</div>
			{smalls.map((src, smallIndex) => (
				<div
					key={`${src}-${smallIndex}`}
					className={cn(IMAGE_FRAME, "col-span-1 row-span-1 hidden h-64 md:block md:h-auto")}
				>
					{src && <YNSMedia src={src} alt="" fill sizes="320px" className="object-cover object-[50%_30%]" />}
				</div>
			))}
		</section>
	);
}

/** In the original's testimonials slot: three newest products under a plain left-aligned title. */
export async function NewArrivals() {
	const { arrivals } = await getHomeProducts();
	if (arrivals.length === 0) return null;
	return (
		<section className="mx-auto max-w-7xl px-8 py-12 sm:px-16">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<h2 className="text-3xl font-semibold text-black">New arrivals</h2>
				<Link
					href="/products"
					className="text-sm font-medium text-ink underline decoration-sky decoration-2 underline-offset-4 hover:decoration-sky-deep"
				>
					See all products
				</Link>
			</div>
			<div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 md:gap-16 lg:gap-24">
				{arrivals.slice(0, 3).map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						className="max-md:last:hidden max-sm:last:flex"
						sizes="(max-width: 640px) 90vw, 30vw"
					/>
				))}
			</div>
		</section>
	);
}

/** "Our Materials": centred title, two lines of copy, tall photo tiles captioned underneath. */
export function MaterialTiles({ tiles }: { tiles: CategoryShowcase[] }) {
	if (tiles.length === 0) return null;
	return (
		<section className="mx-auto mb-12 max-w-7xl bg-white px-6 sm:px-12 lg:px-24">
			<div className="mb-12">
				<h2 className="ds-heading mt-3 text-center text-black">Our Range</h2>
				<p className="mx-auto mb-6 max-w-xl py-4 text-center leading-relaxed">
					Get to know what we offer, one category at a time.
				</p>
				<p className="mx-auto max-w-3xl text-center text-sm leading-loose tracking-wide text-muted-foreground">
					We keep the range small and considered. Every product is chosen for how it works, how it looks and
					how well it fits into ordinary days, so the things you reach for every day are ones you enjoy.
				</p>
			</div>
			<ul className="-mx-2 flex flex-col flex-wrap justify-center lg:flex-row">
				{tiles.map((tile) => (
					<li key={tile.slug} className="lg:w-1/3">
						<Link href={`/category/${tile.slug}`} className="block p-2 transition-all hover:scale-95">
							<span className="relative mb-8 block h-[300px] overflow-hidden rounded-lg bg-black md:h-[500px]">
								{tile.frames[0] && (
									<YNSMedia
										src={tile.frames[0]}
										alt=""
										fill
										sizes="(max-width: 992px) 90vw, 30vw"
										className="object-cover object-[50%_30%] opacity-90"
									/>
								)}
							</span>
							<span className="block text-center text-xl font-medium">{sentenceCase(tile.name)}</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
