import {
	HeadsetIcon,
	type LucideIcon,
	PackageIcon,
	RulerIcon,
	ShieldCheckIcon,
	TruckIcon,
	UserRoundIcon,
} from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { faqCategories } from "@/app/faq/faq-data";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { ArrowLink, SectionHeader } from "@/components/section-header";
import { FeaturedBuyBox } from "@/components/sections/home-client";
import { commerce } from "@/lib/commerce";
import {
	EDITORIAL,
	getCatalogueTiles,
	getLifestyleShots,
	getSocialLinks,
	getStoreIdentity,
	pick,
	resellerHref,
} from "@/lib/theme";
import { YNSMedia } from "@/lib/yns-media";

async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce
		.productBrowse({ active: true, limit: 24, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	// Pictured, priced products first, so the grid never opens on an empty frame or a zero price.
	const lead = (p: (typeof result.data)[number]) =>
		p.images.length > 0 && p.variants.some((v) => BigInt(v.price) > 0n);
	return [...result.data.filter(lead), ...result.data.filter((p) => !lead(p))];
}

/** The product given its own buy box: a pictured, buyable product with the most photos, else the first priced one. */
async function getFeaturedProduct() {
	"use cache";
	cacheLife("minutes");
	const products = await getHomeProducts();
	const regular = products.filter((p) => p.type !== "bundle" && p.variants.some((v) => BigInt(v.price) > 0n));
	const buyable = regular.filter(
		(p) => p.images.length > 0 && p.variants.some((v) => v.stock === null || (v.stock ?? 0) > 0),
	);
	const choice = [...buyable].sort((a, b) => b.images.length - a.images.length)[0] ?? regular[0];
	if (!choice) return null;
	return commerce.productGet({ idOrSlug: choice.slug }).catch(() => null);
}

/** Full-bleed photograph, warm veil, copy bottom-left in white Belleza, a pale "Shop now" pill. */
async function Hero() {
	const identity = await getStoreIdentity();
	return (
		<section className="relative flex h-[34rem] items-end overflow-hidden bg-[#b8ad9f] md:h-[44rem]">
			<YNSMedia src={EDITORIAL.hero.src} alt="" fill priority sizes="100vw" className="object-cover" />
			<div className="absolute inset-0 bg-linear-to-t from-[#3c3428]/70 via-[#3c3428]/25 to-transparent" />
			<div className="shell relative pb-12 text-white md:pb-20">
				<p className="text-sm">{identity.name}</p>
				<h1 className="mt-4 max-w-2xl text-h2">Linen for the bed, bath and table</h1>
				<p className="mt-5 max-w-xl text-sm text-white/90">
					{identity.description ?? "Stonewashed linen in soft earth tones, made to be used every day."}
				</p>
				<Link href="/products" className="btn btn-secondary mt-8">
					Shop now
				</Link>
			</div>
		</section>
	);
}

/** "Collections": rounded image tiles, three across, the name bottom-left in white Belleza. */
async function Collections() {
	const { categories, collections } = await getCatalogueTiles();
	const { lifestyle, packshots } = await getLifestyleShots();
	const all = [...collections, ...categories];
	// Four tiles sit in one row of four; otherwise rows of three, trimmed so no row is left half empty.
	const columns = all.length === 4 ? 4 : 3;
	const count = all.length <= columns ? all.length : Math.min(6, all.length - (all.length % columns));
	const tiles = all.slice(0, count).map((tile, i) => ({
		...tile,
		image: tile.image ?? pick(packshots, i + 1)?.src ?? pick(lifestyle, i)?.src ?? null,
	}));
	if (tiles.length === 0) return null;
	return (
		<section className="bg-band py-14 md:py-20">
			<div className="shell">
				<SectionHeader
					title="Collections"
					action={<ArrowLink href="/products">View All</ArrowLink>}
					className="mb-8 md:mb-12"
				/>
				<ul className={`grid gap-2 sm:grid-cols-2 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
					{tiles.map((tile) => (
						<li key={tile.href}>
							<Link
								href={tile.href}
								className="group relative flex aspect-square items-end overflow-hidden rounded-lg bg-stage p-6 md:p-8"
							>
								{tile.image && (
									<YNSMedia
										src={tile.image}
										alt=""
										fill
										sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								)}
								<span className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
								<span className="relative font-serif text-2xl text-white md:text-[1.75rem]">
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

/** "Featured": a four-up grid of cards, two rows. */
async function Featured() {
	const products = await getHomeProducts();
	if (products.length === 0) return null;
	return (
		<section className="py-14 md:py-20">
			<div className="shell">
				<SectionHeader
					title="Featured"
					action={<ArrowLink href="/products">View All</ArrowLink>}
					className="mb-8 md:mb-12"
				/>
				<ul className="grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
					{products.slice(0, 8).map((product, i) => (
						<li key={product.id} className={i >= 6 ? "md:hidden lg:block" : undefined}>
							<ProductCard product={product} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** Image left, sand panel right with a centred heading, line of copy and a taupe button. */
function ImageWithText() {
	return (
		<section className="grid bg-linen md:grid-cols-2">
			<div className="relative aspect-[4/3] md:aspect-auto md:min-h-[33rem]">
				<YNSMedia
					src={EDITORIAL.story.src}
					alt={EDITORIAL.story.alt}
					fill
					sizes="(min-width: 768px) 50vw, 100vw"
					className="object-cover"
				/>
			</div>
			<div className="flex flex-col items-center justify-center px-5 py-14 text-center md:px-12">
				<h2 className="max-w-md text-h4">Made for slow mornings</h2>
				<p className="mt-5 max-w-sm text-sm">
					Soft, breathable linen that feels lived-in from the first night.
				</p>
				<Link href="/products" className="btn btn-primary mt-8">
					Discover now
				</Link>
			</div>
		</section>
	);
}

const SERVICE_ICONS: LucideIcon[] = [TruckIcon, RulerIcon, PackageIcon, ShieldCheckIcon];

/** "Customer Service": contact facts on the left, icon accordions on greige rows on the right. */
export async function CustomerService() {
	const identity = await getStoreIdentity();
	const questions = faqCategories.flatMap((c) => c.questions.slice(0, 1)).slice(0, 4);
	if (questions.length === 0) return null;
	return (
		<section className="bg-[#fbfaf9] py-14 md:py-20">
			<div className="shell grid gap-10 md:grid-cols-2 md:gap-12">
				<div>
					<h2 className="text-h4">Customer Service</h2>
					<p className="mt-3 text-lg">We are here to help, every step of the way.</p>
					<dl className="mt-8 space-y-4 text-[13px] text-muted-foreground">
						<div>
							<dt>Questions</dt>
							<dd>
								<Link href="/faq" className="underline underline-offset-4 hover:no-underline">
									Read the FAQ
								</Link>
							</dd>
						</div>
						<div>
							<dt>Get in touch</dt>
							<dd>
								<Link
									href={resellerHref(identity.contactEnabled)}
									className="underline underline-offset-4 hover:no-underline"
								>
									Contact our team
								</Link>
							</dd>
						</div>
					</dl>
				</div>
				<ul className="space-y-3">
					{questions.map((q, i) => {
						const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length] ?? TruckIcon;
						return (
							<li key={q.question}>
								<details className="group rounded-md bg-secondary">
									<summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-2.5 font-serif text-[15px] [&::-webkit-details-marker]:hidden">
										<Icon aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.25} />
										<span className="grow">{q.question}</span>
										<span
											aria-hidden="true"
											className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-muted-foreground text-muted-foreground"
										>
											<span className="absolute h-px w-2.5 bg-current" />
											<span className="absolute h-2.5 w-px bg-current transition-transform group-open:scale-y-0" />
										</span>
									</summary>
									<p className="px-11 pb-4 text-[13px] leading-relaxed text-muted-foreground">{q.answer}</p>
								</details>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}

/** "Instagram": four rounded photos and a white card pointing at the account (or the shop). */
async function Gallery() {
	const socials = await getSocialLinks();
	const shots = EDITORIAL.gallery;
	const instagram = socials.find((s) => s.label === "Instagram");
	const handle = instagram ? `@${instagram.url.replace(/\/+$/, "").split("/").at(-1)}` : null;
	return (
		<section className="bg-band py-14 md:py-20">
			<div className="shell">
				<SectionHeader
					title={instagram ? "Instagram" : "At home with linen"}
					action={
						instagram && handle ? (
							<a
								href={instagram.url}
								target="_blank"
								rel="noreferrer"
								className="link-reveal py-1 underline underline-offset-4"
							>
								{handle}
							</a>
						) : (
							<ArrowLink href="/products">Shop all</ArrowLink>
						)
					}
					className="mb-8 md:mb-12"
				/>
				<ul className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
					{shots.map((shot) => (
						<li key={shot.src}>
							<Link
								href="/products"
								className="relative block aspect-square overflow-hidden rounded-lg bg-stage"
							>
								<YNSMedia
									src={shot.src}
									alt={shot.alt}
									fill
									sizes="(min-width: 768px) 20vw, 50vw"
									className="object-cover transition-transform duration-700 hover:scale-105"
								/>
							</Link>
						</li>
					))}
					<li className="col-span-2 md:col-span-1">
						<a
							href={instagram?.url ?? "/products"}
							className="flex h-full min-h-32 flex-col items-center justify-center rounded-lg bg-white p-4 text-center font-serif text-lg text-muted-foreground transition-colors hover:text-foreground"
						>
							View more {instagram ? "in" : "of"}
							<span className="text-xl text-foreground">{handle ?? "the collection"}</span>
						</a>
					</li>
				</ul>
			</div>
		</section>
	);
}

const HIGHLIGHTS: { icon: LucideIcon; title: string; text: string }[] = [
	{
		icon: UserRoundIcon,
		title: "Customer Support",
		text: "Questions about an order or a product? Get in touch and we will help.",
	},
	{
		icon: ShieldCheckIcon,
		title: "Chosen with Care",
		text: "Every sheet, towel and napkin is chosen for its fibre, its weave and how it feels.",
	},
	{
		icon: HeadsetIcon,
		title: "Easy Ordering",
		text: "Secure checkout, with delivery options and costs shown before you pay.",
	},
];

/** Three greige cards with a white icon disc, a Belleza title and one line of copy. */
function Highlights() {
	return (
		<section className="bg-band pb-14 md:pb-20">
			<div className="shell">
				<ul className="grid gap-3 md:grid-cols-3 md:gap-6">
					{HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
						<li key={title} className="rounded-lg bg-linen p-7">
							<span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
								<Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
							</span>
							<h3 className="mt-6 text-2xl">{title}</h3>
							<p className="mt-3 max-w-xs text-[13px]">{text}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/** "Newsletter": centred heading and inline form on the mist band (when the store runs one). */
async function Newsletter() {
	const identity = await getStoreIdentity();
	if (!identity.newsletterEnabled) return null;
	return (
		<section className="bg-muted py-14 md:py-20">
			<div className="shell flex flex-col items-center text-center">
				<h2 className="text-h4">Newsletter</h2>
				<p className="mt-3 text-[13px] text-muted-foreground">
					Be the first to know about new collections and exclusive offers.
				</p>
				<div className="mt-6 w-full max-w-md">
					<NewsletterForm />
				</div>
			</div>
		</section>
	);
}

/** "Become a Reseller": the original's B2B form, here a centred invitation to get in touch. */
async function Reseller() {
	const identity = await getStoreIdentity();
	return (
		<section className="py-14 md:py-20">
			<div className="shell flex flex-col items-center text-center">
				<h2 className="text-h5">Become a Reseller</h2>
				<p className="mt-2 max-w-md text-[13px] text-muted-foreground">
					Stocking {identity.name} in your shop or studio? Tell us about your business and we will get back to
					you with trade terms.
				</p>
				<Link href={resellerHref(identity.contactEnabled)} className="btn btn-primary btn-sm mt-6">
					Get in touch
				</Link>
			</div>
		</section>
	);
}

/** Single product block: rounded photo beside the name, price, options and buy box, on sand. */
async function FeaturedProduct() {
	const product = await getFeaturedProduct();
	if (!product) return null;
	const image = product.images[0] ?? product.variants[0]?.images[0];
	return (
		<section className="bg-linen py-14 md:py-20">
			<div className="shell grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-14">
				<div className="relative aspect-square overflow-hidden rounded-lg bg-stage">
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
					<h2 className="text-h4">{product.name}</h2>
					{product.summary && (
						<p className="mt-4 line-clamp-3 max-w-md text-[13px] text-muted-foreground">{product.summary}</p>
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
						View full details →
					</Link>
				</div>
			</div>
		</section>
	);
}

export async function HomeSections() {
	return (
		<>
			<Hero />
			<Collections />
			<Featured />
			<ImageWithText />
			<CustomerService />
			<FeaturedProduct />
			<Gallery />
			<Highlights />
			<Newsletter />
			<Reseller />
		</>
	);
}
