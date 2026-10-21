import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/munch/carousel";
import { OvalLabel } from "@/components/munch/oval-label";
import { headingSizes, pill } from "@/components/munch/styles";
import { type CardProduct, ProductCard } from "@/components/product-card";
import type { ShowcaseTile } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Large hero: one rounded photograph with the serif headline and a tomato pill at its foot. */
export function Hero({
	image,
	title,
	cta,
}: {
	image: string;
	title: string;
	cta: { href: string; label: string };
}) {
	return (
		<section className="shell pt-1 lg:pt-0">
			<div className="relative flex min-h-[min(590px,calc(100svh-var(--header-h)-3rem))] items-end overflow-hidden rounded-lg bg-[#5a3a22] lg:aspect-video lg:min-h-0">
				<Image
					src={image}
					alt=""
					fill
					priority
					sizes="(max-width: 1440px) 100vw, 1376px"
					className="object-cover object-[center_75%]"
				/>
				{/* Warm shade under the type keeps the white headline legible on any photograph. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-linear-to-t from-[#3b1d0b]/80 via-[#3b1d0b]/35 to-[#3b1d0b]/5"
				/>
				<div className="relative z-10 mx-auto flex w-full flex-col items-center justify-center gap-xl px-s py-2xl text-center text-balance lg:max-w-[680px] lg:py-6xl">
					<h1 className={cn(headingSizes.hero, "text-white")}>{title}</h1>
					<Link href={cta.href} className={pill({ size: "lg", variant: "primary" })}>
						{cta.label}
					</Link>
				</div>
			</div>
		</section>
	);
}

/** The featured collection: a product row with an outlined full-width pill underneath. */
export function FeaturedRow({
	title,
	products,
	cta,
}: {
	title: string;
	products: CardProduct[];
	cta?: { href: string; label: string };
}) {
	return (
		<Carousel
			label={title}
			title={<h2 className={headingSizes.section}>{title}</h2>}
			footer={
				cta ? (
					<Link href={cta.href} className={pill({ size: "xl", variant: "outline", className: "w-full" })}>
						{cta.label}
					</Link>
				) : undefined
			}
		>
			{products.map((product) => (
				<div key={product.id} className="w-[88vw] max-w-[450px] shrink-0 snap-start">
					<ProductCard product={product} sizes="(max-width: 512px) 88vw, 450px" />
				</div>
			))}
		</Carousel>
	);
}

async function ProductRow({ product, highlighted }: { product: CardProduct; highlighted: boolean }) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : [];
	const { min, max } = variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const image = product.images?.find((url) => !isVideoUrl(url));
	return (
		<Link
			href={`/product/${product.slug}`}
			className={cn("flex items-start gap-s rounded-lg p-xs", highlighted && "bg-blush")}
		>
			<span className="relative size-25 shrink-0 overflow-hidden rounded-lg border-[1.5px] border-brand">
				{image && <YNSMedia src={image} alt="" fill sizes="100px" className="object-cover" />}
			</span>
			<span className="flex flex-col gap-xs pt-1">
				<span className="text-b-lg leading-[1.5]">{product.name}</span>
				{min ? (
					<span className="text-b-sm leading-[1.5]">
						{min !== max ? "from " : ""}
						{formatMoney({ amount: min, currency, locale })}
					</span>
				) : null}
			</span>
		</Link>
	);
}

/** A big editorial photograph beside one product card and a Shop now pill
 *  (desktop); on phones the photograph sits above a short list of the collection's products. */
export function CollectionFeature({
	title,
	image,
	href,
	products,
}: {
	title: string;
	image: string;
	href: string;
	products: CardProduct[];
}) {
	const [first] = products;
	if (!first) return null;
	return (
		<section className="shell py-2xl">
			<h2 className={cn(headingSizes.section, "mb-xs")}>{title}</h2>
			<div className="flex flex-col gap-xs lg:flex-row">
				<div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f4ebdb] lg:aspect-auto lg:min-h-[680px] lg:flex-1">
					<Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
				</div>
				<div className="flex flex-col gap-xs lg:hidden">
					{products.slice(0, 4).map((product, index) => (
						<ProductRow key={product.id} product={product} highlighted={index === 1} />
					))}
				</div>
				<div className="hidden w-[450px] shrink-0 flex-col justify-between gap-xs lg:flex">
					<ProductCard product={first} sizes="450px" />
					<Link href={href} className={pill({ size: "xl", variant: "outline", className: "w-full" })}>
						Shop now
					</Link>
				</div>
				<Link
					href={href}
					className={pill({ size: "xl", variant: "outline", className: "mt-xs w-full lg:hidden" })}
				>
					Shop now
				</Link>
			</div>
		</section>
	);
}

/** The bordered box of large centred serif copy. */
export function CenteredText({ text }: { text: string }) {
	return (
		<section className="shell py-m lg:py-xl">
			<div className="rounded-lg border border-brand px-s py-[90px] lg:py-[108px]">
				<p className="mx-auto max-w-180 text-center font-serif text-b-4xl leading-[1.5] text-balance text-brand lg:text-b-6xl">
					{text}
				</p>
			</div>
		</section>
	);
}

/** Climate Crisis words scrolling sideways (two copies, the second hidden from assistive tech). */
export function Marquee({ words }: { words: string[] }) {
	if (words.length === 0) return null;
	return (
		<section className="mx-auto flex max-w-[1440px] items-center gap-20 overflow-hidden py-2xl">
			{[0, 1].map((copy) => (
				<div
					key={copy}
					aria-hidden={copy === 1 ? "true" : undefined}
					className="flex shrink-0 animate-marquee items-center gap-20 [--duration:30s] [--gap:5rem]"
				>
					{words.map((word) => (
						<span
							key={word}
							className="font-display-d whitespace-nowrap text-l-6xl leading-[1.1] tracking-[1.6px] text-brand"
						>
							{word}
						</span>
					))}
				</div>
			))}
		</section>
	);
}

/** "Shop our collections": tall editorial photographs with their name in the drawn oval. */
export function CollectionList({ title, tiles }: { title: string; tiles: ShowcaseTile[] }) {
	if (tiles.length === 0) return null;
	return (
		<Carousel
			label={title}
			title={<h2 className={headingSizes.section}>{title}</h2>}
			showArrows={false}
			showProgress
		>
			{tiles.map((tile, index) => (
				<Link
					key={tile.id}
					href={tile.href}
					className={cn(
						"group relative flex aspect-[3/4] w-[88vw] min-w-80 max-w-[453px] shrink-0 snap-start overflow-hidden rounded-lg lg:w-auto lg:max-w-none lg:flex-1",
						index > 2 && "lg:hidden",
					)}
				>
					<Image
						src={tile.image}
						alt=""
						fill
						sizes="(max-width: 1024px) 88vw, 453px"
						className="object-cover"
					/>
					<span className="absolute bottom-lg left-1/2 -translate-x-1/2">
						<OvalLabel>{tile.name}</OvalLabel>
					</span>
				</Link>
			))}
		</Carousel>
	);
}

/** "HOW-TO": a bordered box (display-caps kicker over serif copy) beside a square photograph. */
export function MediaText({
	label,
	text,
	image,
	imagePosition = "right",
}: {
	label: string;
	text: string;
	image: string;
	imagePosition?: "left" | "right";
}) {
	return (
		<section
			className={cn(
				"shell flex flex-col items-stretch gap-2 py-xl lg:py-2xl",
				imagePosition === "right" ? "lg:flex-row" : "lg:flex-row-reverse",
			)}
		>
			<div className="relative flex min-h-[390px] flex-col items-center justify-start gap-11 rounded-lg border border-brand p-s sm:justify-center lg:w-1/2 lg:py-7xl">
				<p className="font-display-d text-center text-l-sm leading-[1.1] tracking-[0.56px] sm:absolute sm:whitespace-nowrap sm:top-xl sm:left-1/2 sm:-translate-x-1/2 lg:text-l-md">
					{label}
				</p>
				<p className="max-w-145 text-center font-serif text-b-4xl leading-[1.5] text-pretty text-brand lg:text-b-6xl">
					{text}
				</p>
			</div>
			<div className="relative aspect-square overflow-hidden rounded-lg bg-[#f4ebdb] lg:w-1/2">
				<Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
			</div>
		</section>
	);
}
