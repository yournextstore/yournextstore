import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { faqCategories } from "@/app/faq/faq-data";
import { Carousel } from "@/components/carousel";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { ArrowLink, SectionHeader } from "@/components/section-header";
import { CollectionTabs, FeaturedBuyBox, Hotspot, Slideshow } from "@/components/sections/home-client";
import { commerce } from "@/lib/commerce";
import { EDITORIAL, editorial, getCatalogueTiles, getLooks, getStoreIdentity } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce
		.productBrowse({ active: true, limit: 12, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	// Photographed, priced, buyable products lead the swimlane; image-less ones, sets priced 0 and
	// sold-out pieces trail.
	const rank = (p: (typeof result.data)[number]) =>
		(p.images.length > 0 ? 0 : 4) +
		(p.variants.some((v) => BigInt(v.price) > 0n) ? 0 : 2) +
		(p.variants.some((v) => v.stock === null || (v.stock ?? 0) > 0) ? 0 : 1);
	return result.data.toSorted((a, b) => rank(a) - rank(b));
}

/**
 * The product shown with its own buy box: a photographed regular product that can be bought,
 * preferring one with a choice of options (the original features swatches), else any regular one.
 */
async function getFeaturedProduct() {
	"use cache";
	cacheLife("minutes");
	const products = await getHomeProducts();
	const regular = products.filter(
		(p) => p.type !== "bundle" && p.images.length > 0 && p.variants.some((v) => BigInt(v.price) > 0n),
	);
	const buyable = regular.filter((p) => p.variants.some((v) => v.stock === null || (v.stock ?? 0) > 0));
	const pool = buyable.length > 0 ? buyable : regular;
	const choice = pool.find((p) => p.variants.length > 1) ?? pool[0];
	if (!choice) return null;
	return commerce.productGet({ idOrSlug: choice.slug }).catch(() => null);
}

const outlineButton =
	"inline-flex h-12 items-center justify-center rounded-xs border border-white/90 px-6 text-[13px] font-medium tracking-[0.02em] text-white uppercase transition-colors hover:bg-white hover:text-foreground";

/** Full-bleed slides, headline bottom-left in white uppercase Tenor, outlined button. */
async function Hero() {
	const [identity, { collections }] = await Promise.all([getStoreIdentity(), getCatalogueTiles()]);
	const copy = [
		{
			title: "Light oak, soft linen",
			text: identity.description ?? "Calm, light furniture in solid oak, linen and stone.",
			href: collections[0]?.href ?? "/products",
		},
		{
			title: "Made to be lived with",
			text: "Sofas, tables, beds and lamps made in materials that sit well together.",
			href: "/products",
		},
	];
	const slides = copy.map((c, i) => {
		return (
			<div key={c.title} className="relative h-full">
				<Image
					src={editorial(EDITORIAL.hero, i)}
					alt=""
					fill
					priority={i === 0}
					sizes="100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-black/10" />
				<div className="absolute inset-x-0 bottom-20 md:bottom-24">
					<div className="shell text-white">
						{i === 0 ? (
							<h1 className="max-w-3xl text-h1 uppercase">{c.title}</h1>
						) : (
							<h2 className="max-w-3xl text-h1 uppercase">{c.title}</h2>
						)}
						<p className="mt-5 max-w-xl text-base text-white/90">{c.text}</p>
						<Link href={c.href} className={cn(outlineButton, "mt-8")}>
							Explore more
						</Link>
					</div>
				</div>
			</div>
		);
	});
	return <Slideshow slides={slides} />;
}

/** Centred heading + a 3 × 2 mosaic of rounded portrait tiles with the name over the photo. */
async function ExploreCollections() {
	const { categories, collections } = await getCatalogueTiles();
	const all = [...collections, ...categories];
	// Full rows only: six fill both layouts, four sit as 2 × 2 on phones and one row of four above.
	const tiles = all.length >= 6 ? all.slice(0, 6) : all.length >= 4 ? all.slice(0, 4) : all.slice(0, 2);
	if (tiles.length === 0) return null;
	return (
		<section className="py-16 md:py-24">
			<div className="shell">
				<SectionHeader
					title="Explore collections"
					subtitle="Furniture for the living room, the dining table and the bedroom."
					action={<ArrowLink href="/products">Explore now</ArrowLink>}
					centered
					className="mb-10 md:mb-12"
				/>
				<ul
					className={cn(
						"grid grid-cols-2 gap-2.5 md:gap-5",
						tiles.length === 4 ? "md:grid-cols-4" : tiles.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
					)}
				>
					{tiles.map((tile) => (
						<li key={tile.href}>
							<Link
								href={tile.href}
								className="group relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md bg-stage"
							>
								<Image
									src={tile.image}
									alt=""
									fill
									sizes="(min-width: 768px) 33vw, 50vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								{/* A soft dark pool behind the label keeps it legible on pale photographs. */}
								<span className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_center,rgb(0_0_0/0.38),transparent)] transition-opacity duration-300 group-hover:opacity-80" />
								<span className="relative px-3 text-center font-serif text-base text-white uppercase sm:text-xl [text-shadow:0_1px_12px_rgb(0_0_0/0.35)] md:text-[1.75rem]">
									{tile.title}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

// Pin positions over each room photo (percent of width / height), in the original's spirit:
// two or three pieces per room, never on the edge.
const PIN_LAYOUTS = [
	[
		{ x: 30, y: 70 },
		{ x: 70, y: 38 },
		{ x: 52, y: 58 },
	],
	[
		{ x: 66, y: 64 },
		{ x: 26, y: 46 },
		{ x: 46, y: 30 },
	],
];

/** Grey band with two rounded room photos carrying product pins. */
async function ShopTheLook() {
	const looks = await getLooks();
	const rooms = looks
		.filter((l) => l.products.length > 0)
		.slice(0, 2)
		.map((look, i) => ({
			look,
			image: editorial(EDITORIAL.looks, i),
			pins: look.products
				.slice(0, 3)
				.map((p, j) => ({ ...p, ...(PIN_LAYOUTS[i % 2]?.[j] ?? { x: 50, y: 50 }) })),
		}));
	if (rooms.length === 0) return null;
	return (
		<section className="bg-band py-16 md:py-20">
			<div className="shell">
				<SectionHeader
					title="Shop the look"
					subtitle="Put together from the collection. Tap a pin to see the piece."
					action={<ArrowLink href="/products">Explore now</ArrowLink>}
					centered
					className="mb-10 md:mb-12"
				/>
				<div className={cn("grid gap-5", rooms.length > 1 && "md:grid-cols-2")}>
					{rooms.map(({ look, image, pins }) => (
						<figure
							key={look.slug}
							className={cn(
								"relative aspect-square overflow-visible rounded-md",
								rooms.length === 1 && "md:aspect-[2/1]",
							)}
						>
							<div className="absolute inset-0 overflow-hidden rounded-md bg-stage">
								<Image
									src={image}
									alt=""
									fill
									sizes={rooms.length === 1 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
									className="object-cover"
								/>
							</div>
							{pins.map((pin) => (
								<Hotspot key={pin.slug} product={pin} />
							))}
							<figcaption className="sr-only">{look.name}</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}

/** "FEATURED PRODUCTS": heading left, VIEW ALL right, a three-up swimlane with chips below. */
async function FeaturedProducts() {
	const products = await getHomeProducts();
	if (products.length === 0) return null;
	return (
		<section className="py-16 md:py-24">
			<div className="shell">
				<SectionHeader
					title="Featured products"
					subtitle="Our best-loved pieces, from the living room to the bedroom."
					action={<ArrowLink href="/products" />}
					className="mb-8 md:mb-10"
					size="h3"
				/>
				<Carousel label="featured products">
					{products.slice(0, 9).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</Carousel>
			</div>
		</section>
	);
}

/** "FEATURED PRODUCT": one large rounded photo beside the uppercase name and an inline buy box. */
async function FeaturedProduct() {
	const product = await getFeaturedProduct();
	if (!product) return null;
	const image = product.images[0] ?? product.variants[0]?.images[0];
	return (
		<section className="pb-16 md:pb-24">
			<div className="shell">
				<h2 className="mb-8 text-h3 uppercase md:mb-12">Featured product</h2>
				<div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-10 lg:gap-12">
					<div className="relative aspect-square overflow-hidden rounded-md bg-stage">
						{image && (
							<YNSMedia
								src={image}
								alt=""
								fill
								sizes="(min-width: 768px) 55vw, 100vw"
								className="object-cover"
							/>
						)}
					</div>
					<div className="md:pt-2">
						<h3 className="text-h3 uppercase">{product.name}</h3>
						{product.summary && (
							<p className="mt-4 max-w-md text-[15px] text-muted-foreground">{product.summary}</p>
						)}
						<div className="mt-6">
							<FeaturedBuyBox
								product={{ id: product.id, name: product.name, slug: product.slug, images: product.images }}
								variants={product.variants}
							/>
						</div>
						<Link
							href={`/product/${product.slug}`}
							className="mt-6 inline-block text-sm underline underline-offset-4 hover:no-underline"
						>
							View full details
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

/** Half grey panel with centred heading and link, half full-height photograph. */
async function ImageWithText() {
	const { collections } = await getCatalogueTiles();
	return (
		<section className="grid bg-band md:min-h-[40rem] md:grid-cols-2 lg:min-h-[50rem]">
			<div className="flex flex-col items-center justify-center px-5 py-16 text-center md:px-10">
				<h2 className="max-w-md text-h3 uppercase">Ready when you are</h2>
				<p className="mt-5 max-w-sm text-[15px]">
					Solid oak, honest joints and fluted fronts: furniture made to be used every day and kept for years.
				</p>
				<ArrowLink href={collections[0]?.href ?? "/products"} className="mt-6">
					Explore now
				</ArrowLink>
			</div>
			<div className="relative aspect-[4/3] md:aspect-auto">
				<Image
					src={EDITORIAL.imageText}
					alt=""
					fill
					sizes="(min-width: 768px) 50vw, 100vw"
					className="object-cover"
				/>
			</div>
		</section>
	);
}

/** Dark band with the collections as tabs; each swaps the backdrop and the line of copy. */
async function CollectionBand() {
	const { categories, collections } = await getCatalogueTiles();
	const entries = [...collections, ...categories].slice(0, 3);
	if (entries.length < 2) return null;
	const tabs = entries.map((entry, i) => {
		return {
			label: entry.title,
			image: <Image src={editorial(EDITORIAL.band, i)} alt="" fill sizes="100vw" className="object-cover" />,
			body: (
				<>
					<p className="font-serif text-xl leading-snug md:text-[1.75rem]">
						{entry.description ||
							"A design language that is intentionally simple, so every piece settles in for the long haul."}
					</p>
					<ArrowLink href={entry.href} className="mt-8 text-white">
						Explore now
					</ArrowLink>
				</>
			),
		};
	});
	return <CollectionTabs tabs={tabs} />;
}

const HIGHLIGHTS = [
	{
		shape: "circle",
		title: "Furniture chosen for how it feels and works.",
		text: "A focused range, picked with care.",
		href: "/products",
	},
	{
		shape: "square",
		title: "Made to fit real life, from busy weekdays to slow weekends.",
		text: "Oak, linen and stone in tones that work together.",
		href: "/about",
	},
	{
		shape: "triangle",
		title: "Help with choosing, from the first question to checkout.",
		text: "Answers on orders, payments and shipping.",
		href: "/faq",
	},
] as const;

function Shape({ shape }: { shape: (typeof HIGHLIGHTS)[number]["shape"] }) {
	return (
		<svg aria-hidden="true" viewBox="0 0 40 40" className="h-10 w-10 fill-[#24211e]">
			{shape === "circle" && <circle cx="20" cy="20" r="20" />}
			{shape === "square" && <rect x="2" y="2" width="36" height="36" />}
			{shape === "triangle" && <path d="M20 1 39 39H1z" />}
		</svg>
	);
}

/** Three ruled columns: a black shape, a short Tenor statement and an underlined link. */
function Highlights() {
	return (
		<section className="pb-16 md:pb-24">
			<div className="shell">
				<ul className="grid divide-y divide-input rounded-md border border-input md:grid-cols-3 md:divide-x md:divide-y-0">
					{HIGHLIGHTS.map((h) => (
						<li key={h.shape} className="flex flex-col items-center px-6 py-12 text-center md:px-10 md:py-16">
							<Shape shape={h.shape} />
							<h3 className="mt-6 max-w-xs text-[1.375rem] leading-snug md:text-2xl">{h.title}</h3>
							<p className="mt-3 text-[13px] text-muted-foreground">{h.text}</p>
							<Link
								href={h.href}
								className="mt-4 text-xs font-medium underline underline-offset-4 hover:no-underline"
							>
								Explore more →
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** "CUSTOMER SERVICE": two columns of grey accordion rows, the first one open. */
function CustomerService() {
	const questions = faqCategories.flatMap((c) => c.questions.slice(0, 1)).slice(0, 4);
	if (questions.length === 0) return null;
	const columns = [questions.filter((_, i) => i % 2 === 0), questions.filter((_, i) => i % 2 === 1)];
	return (
		<section className="pb-16 md:pb-24">
			<div className="shell">
				<h2 className="text-h3 uppercase">Customer service</h2>
				<p className="font-serif text-lg md:text-xl">Answers to what we are asked most.</p>
				<div className="mt-8 grid gap-3 md:mt-12 md:grid-cols-2 md:gap-5">
					{columns.map((column, c) => (
						<div key={c === 0 ? "left" : "right"} className="space-y-3">
							{column.map((q, i) => (
								<details key={q.question} open={c === 0 && i === 0} className="group rounded-xs bg-band">
									<summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[15px] [&::-webkit-details-marker]:hidden">
										{q.question}
										<span
											aria-hidden="true"
											className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current"
										>
											<span className="absolute h-px w-2 bg-current" />
											<span className="absolute h-2 w-px bg-current transition-transform group-open:scale-y-0" />
										</span>
									</summary>
									<p className="border-t border-white px-4 py-4 text-[13px] leading-relaxed text-muted-foreground">
										{q.answer}
									</p>
								</details>
							))}
						</div>
					))}
				</div>
				<ArrowLink href="/faq" className="mt-8">
					All questions
				</ArrowLink>
			</div>
		</section>
	);
}

/** Grey newsletter band (only when the store runs a newsletter). */
async function Newsletter() {
	const identity = await getStoreIdentity();
	if (!identity.newsletterEnabled) return null;
	return (
		<section className="bg-muted py-14 md:py-16">
			<div className="shell flex flex-col items-center text-center">
				<h2 className="text-h5">Subscribe to our newsletter</h2>
				<p className="mt-3 text-sm">New pieces and ideas, now and then.</p>
				<div className="mt-6 w-full max-w-md">
					<NewsletterForm />
				</div>
			</div>
		</section>
	);
}

export async function HomeSections() {
	return (
		<>
			<Hero />
			<ExploreCollections />
			<ShopTheLook />
			<FeaturedProducts />
			<FeaturedProduct />
			<ImageWithText />
			<CollectionBand />
			<div className="pt-16 md:pt-24" />
			<Highlights />
			<CustomerService />
			<Newsletter />
		</>
	);
}
