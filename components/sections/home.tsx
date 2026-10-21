import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { faqCategories } from "@/app/faq/faq-data";
import { type CardProduct, ProductCard } from "@/components/product-card";
import { Slider } from "@/components/slider";
import {
	type CatalogCategory,
	getCatalogCategories,
	getFeaturedGroups,
	getHomeProducts,
	getStoreIdentity,
} from "@/lib/catalog";
import { editorial, type Photo } from "@/lib/editorial";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Three portraits side by side under a scrim: Blueprint's full-bleed hero, at native resolution. */
export function PhotoBand({
	frames,
	className,
	children,
}: {
	frames: Photo[];
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<section
			className={cn(
				"relative isolate flex items-center justify-center overflow-hidden bg-neutral-darker text-white",
				className,
			)}
		>
			<div className="absolute inset-0 -z-10 grid md:grid-cols-3">
				{frames.map((frame, index) => (
					<div key={frame.src} className={cn("relative", index > 0 && "hidden md:block")}>
						<YNSMedia
							src={frame.src}
							alt=""
							fill
							priority={index === 0}
							sizes="(max-width: 768px) 100vw, 34vw"
							className="object-cover object-[50%_28%]"
						/>
					</div>
				))}
				<div className="absolute inset-0 bg-black/40" />
			</div>
			<div className="flex max-w-2xl flex-col items-center px-4 text-center">{children}</div>
		</section>
	);
}

export function HeroBanner({ storeName }: { storeName: string }) {
	return (
		<PhotoBand frames={editorial.hero} className="h-[29rem] md:h-[25rem] xl:h-[28rem]">
			<p className="bp-superheading">Trail clothes from {storeName}</p>
			<h1 className="bp-h1 mt-3">Built for the Trail, Worn Every Day</h1>
			<p className="mt-4 text-base md:text-lg">
				Merino tees, grid fleeces and rain shells that go from the ridge path to the high street.
			</p>
			<Link href="/products" className="bp-btn bp-btn-inverse-light mt-6">
				Shop the collection
			</Link>
		</PhotoBand>
	);
}

function ProductSlide({ product }: { product: CardProduct }) {
	return (
		<li className="w-[62%] shrink-0 snap-start xs:w-[44%] md:w-[calc((100%-3*1.25rem)/4)]">
			<ProductCard product={product} sizes="(max-width: 768px) 62vw, 25vw" />
		</li>
	);
}

/** Centred heading over a four-up product slider. */
export async function ProductsSliderSection({ title }: { title: string }) {
	const { arrivals } = await getHomeProducts();
	if (arrivals.length === 0) return null;
	return (
		<section className="bp-container py-12 md:py-16">
			<h2 className="bp-h3 mb-8 text-center md:mb-10">{title}</h2>
			<Slider label={title}>
				{arrivals.map((product) => (
					<ProductSlide key={product.id} product={product} />
				))}
			</Slider>
		</section>
	);
}

/** 50/50 hero: copy on the paper half, the photograph filling the other. */
export function HalfHero({
	image,
	superheading,
	heading,
	body,
	cta,
	href,
	reverse = false,
}: {
	image: Photo;
	superheading?: string;
	heading: string;
	body: string;
	cta: string;
	href: string;
	reverse?: boolean;
}) {
	return (
		<section className="grid md:grid-cols-2">
			<div
				className={cn(
					"relative aspect-square overflow-hidden bg-neutral-lightest md:aspect-auto md:min-h-[36rem]",
					reverse ? "md:order-first" : "md:order-last",
				)}
			>
				<YNSMedia
					src={image.src}
					alt={image.alt}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover"
					style={{ objectPosition: image.position ?? "50% 30%" }}
				/>
			</div>
			<div className="flex flex-col items-start justify-center px-4 py-10 md:px-14 md:py-16 xl:px-14">
				{superheading && <p className="bp-superheading mb-2">{superheading}</p>}
				<h2 className="bp-h3 max-w-lg">{heading}</h2>
				<p className="mt-4 max-w-lg text-base">{body}</p>
				<Link href={href} className="bp-btn bp-btn-sm mt-8 md:[--btn-h:3.125rem] md:[--btn-px:1.25rem]">
					{cta}
				</Link>
			</div>
		</section>
	);
}

/** Tall photograph with left-aligned copy and a green button. */
export function FeatureHero({ frames }: { frames: Photo[] }) {
	return (
		<section className="relative isolate flex min-h-[29rem] items-center overflow-hidden bg-neutral-darker text-white md:min-h-[40rem] xl:min-h-[50rem]">
			{/* Two portraits side by side read as one wide shot at near-native resolution. */}
			<div className="absolute inset-0 -z-10 grid md:grid-cols-2">
				{frames.map((frame, index) => (
					<div key={frame.src} className={cn("relative", index > 0 && "hidden md:block")}>
						<YNSMedia
							src={frame.src}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							style={{ objectPosition: frame.position ?? "50% 25%" }}
						/>
					</div>
				))}
				<div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/30 to-black/10" />
			</div>
			<div className="bp-container">
				<div className="max-w-xl">
					<h2 className="bp-h2">Out on the Ridge</h2>
					<p className="mt-4 text-base">Layers for wind, sun and drizzle, made to move when you do.</p>
					<Link href="/products" className="bp-btn bp-btn-sm mt-6">
						Shop new arrivals
					</Link>
				</div>
			</div>
		</section>
	);
}

const PROMISES = [
	{
		icon: Sparkles,
		title: "Fabrics that work",
		body: "Merino, fleece and ripstop nylon, each picked for what a day outside asks of it.",
	},
	{
		icon: ShieldCheck,
		title: "Secure checkout",
		body: "Pay safely with the methods you already use, on every device.",
	},
	{
		icon: MessageCircle,
		title: "Here to help",
		body: "A question about sizing or an order? We answer every message.",
	},
] as const;

/** Black band in the place of the original's reviews slider: three centred statements. */
export function PromiseBand() {
	return (
		<section className="bg-ink px-4 py-12 text-white md:py-16">
			<h2 className="bp-h3 text-center">Why Shop With Us</h2>
			<ul className="mx-auto mt-8 grid max-w-5xl gap-10 md:mt-10 md:grid-cols-3 md:gap-8">
				{PROMISES.map(({ icon: Icon, title, body }) => (
					<li key={title} className="flex flex-col items-center text-center">
						<Icon className="size-6 text-star" strokeWidth={1.75} aria-hidden />
						<p className="mt-3 text-xl font-bold">{title}</p>
						<p className="mt-3 max-w-[15rem] text-sm leading-6">{body}</p>
					</li>
				))}
			</ul>
		</section>
	);
}

/** "Recommended" row: five across on desktop, a swipe row on phones. */
export async function RecommendedProducts() {
	const { recommended } = await getHomeProducts();
	if (recommended.length === 0) return null;
	return (
		<section className="bp-container py-12 md:py-16">
			<h2 className="bp-h3 mb-8 text-center md:mb-10">Recommended for You</h2>
			<Slider label="Recommended for you" arrowTop="36%">
				{recommended.map((product) => (
					<li
						key={product.id}
						className="w-[62%] shrink-0 snap-start xs:w-[44%] md:w-[calc((100%-3*1.25rem)/4)] lg:w-[calc((100%-4*1.25rem)/5)]"
					>
						<ProductCard product={product} sizes="(max-width: 768px) 62vw, 20vw" />
					</li>
				))}
			</Slider>
		</section>
	);
}

/** The press slider's shape: one large statement over a row of names, here the store's categories. */
export function Statement({ text, categories }: { text: string; categories: CatalogCategory[] }) {
	return (
		<section className="bp-container py-12 md:py-16">
			<p className="mx-auto max-w-3xl text-center text-2xl font-bold leading-tight md:text-3xl">{text}</p>
			{categories.length > 0 && (
				<ul className="no-scrollbar -mx-4 mt-8 flex gap-8 overflow-x-auto px-4 md:mx-auto md:w-fit md:max-w-full md:gap-12 md:px-0">
					{categories.map((category, index) => (
						<li key={category.slug} className="shrink-0">
							<Link
								href={`/category/${category.slug}`}
								className={cn(
									"block whitespace-nowrap border-b-2 pb-2 text-lg font-bold uppercase tracking-widest transition-colors md:text-xl",
									index === 0
										? "border-black text-black"
										: "border-transparent text-neutral-medium hover:text-black",
								)}
							>
								{category.name}
							</Link>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

/** Three photo tiles with a white headline and outline button over each. */
export function ImageTiles({ categories }: { categories: CatalogCategory[] }) {
	const tiles = categories.filter((category) => category.image).slice(0, 3);
	if (tiles.length === 0) return null;
	return (
		<section className="bp-container py-6">
			<ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto scroll-px-4 px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
				{tiles.map((category) => (
					<li key={category.slug} className="w-[70%] shrink-0 snap-start md:w-auto">
						<Link
							href={`/category/${category.slug}`}
							className="group relative flex aspect-[3/4] items-end justify-center overflow-hidden bg-neutral-darker text-white"
						>
							{category.image && (
								<YNSMedia
									src={category.image}
									alt=""
									fill
									sizes="(max-width: 768px) 70vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							)}
							<span className="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent" />
							<span className="relative flex flex-col items-center px-4 pb-8 text-center">
								<span className="bp-h4 capitalize">{category.name}</span>
								<span className="bp-btn bp-btn-sm bp-btn-inverse-light mt-3">Shop now</span>
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

/** Two wide tiles with "Headline →" captions, as in Blueprint's tiles slider: one per collection or category. */
export async function TilesPair() {
	const groups = await getFeaturedGroups();
	const tiles = editorial.tiles.map((photo, index) => ({
		photo,
		href: groups[index]?.href ?? "/products",
		title: groups[index]?.title ?? "Shop all",
	}));
	return (
		<section className="bp-container py-12 md:py-16">
			<ul className="grid gap-8 md:grid-cols-2 md:gap-5">
				{tiles.map((tile) => (
					<li key={tile.photo.src}>
						<Link href={tile.href} className="group block">
							<span className="relative block aspect-[5/4] overflow-hidden bg-neutral-lightest">
								<YNSMedia
									src={tile.photo.src}
									alt={tile.photo.alt}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</span>
							<span className="mt-4 flex items-center gap-2 text-xl font-bold capitalize md:text-2xl">
								<span className="line-clamp-1">{tile.title}</span>
								<ArrowRight
									className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
									aria-hidden
								/>
							</span>
							<span className="mt-1 block text-sm">Find the layer you need for your next walk.</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

/** Centred heading over plus-icon accordion rows. */
export function FaqAccordions() {
	const questions = faqCategories.flatMap((category) => category.questions).slice(0, 4);
	return (
		<section className="bp-container py-12 md:py-16">
			<h2 className="bp-h3 text-center">Frequently Asked Questions</h2>
			<div className="mx-auto mt-8 max-w-3xl">
				{questions.map((item) => (
					<details key={item.question} className="group border-b border-border">
						<summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
							{item.question}
							<span aria-hidden className="relative size-3.5 shrink-0">
								<span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
								<span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform group-open:scale-y-0" />
							</span>
						</summary>
						<p className="pb-5 text-sm leading-6">{item.answer}</p>
					</details>
				))}
				<div className="mt-8 text-center">
					<Link href="/faq" className="main-underline text-sm font-bold uppercase">
						View all questions
					</Link>
				</div>
			</div>
		</section>
	);
}

export async function getHomeData() {
	const [categories, identity] = await Promise.all([getCatalogCategories(), getStoreIdentity()]);
	return { categories, identity };
}
