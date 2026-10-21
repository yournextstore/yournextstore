import {
	ArrowRight,
	ArrowUpRight,
	CreditCard,
	LayoutGrid,
	MessageCircle,
	ShieldCheck,
	Truck,
} from "lucide-react";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import { type CardProduct, ProductCard } from "@/components/product-card";
import type { Tile } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** Section title row with an optional "View all" link (the original's `SectionHead`). */
export function SectionHead({
	title,
	description,
	href,
	linkLabel = "View all",
}: {
	title: string;
	description?: string | null;
	href?: string;
	linkLabel?: string;
}) {
	return (
		<div className="section-head">
			<div>
				<h2>{title}</h2>
				{description && <p>{description}</p>}
			</div>
			{href && (
				<Link href={href} className="button ghost sm">
					{linkLabel} <ArrowRight size={15} aria-hidden />
				</Link>
			)}
		</div>
	);
}

export type HeroSlide = {
	id: string;
	title: string;
	description: string | null;
	href: string;
	cta: string;
	photo: string;
};

/** Hero: copy on a grey panel beside a photograph; the first slide introduces the store. */
export function Hero({ slides }: { slides: HeroSlide[] }) {
	return (
		<div className="hero">
			<Carousel hero label="Featured">
				{slides.map((slide, index) => (
					<div className="hero-slide" key={slide.id}>
						<div className="hero-copy">
							{index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
							{slide.description && <p>{slide.description}</p>}
							<div className="hero-actions">
								<Link className="button primary lg" href={slide.href}>
									{slide.cta} <ArrowRight size={18} aria-hidden />
								</Link>
								{slide.href !== "/products" && (
									<Link className="button lg" href="/products">
										All products
									</Link>
								)}
							</div>
						</div>
						<div className="media hero-media">
							<YNSMedia
								src={slide.photo}
								alt=""
								fill
								priority={index === 0}
								sizes="(max-width: 760px) 100vw, 55vw"
								className="object-cover"
							/>
						</div>
					</div>
				))}
			</Carousel>
		</div>
	);
}

const trust = [
	{ icon: ShieldCheck, title: "Secure checkout", text: "Card and local payment methods, handled by Stripe." },
	{ icon: Truck, title: "Clear delivery costs", text: "Shipping is shown before you pay, never after." },
	{ icon: LayoutGrid, title: "Know what you buy", text: "Clear photos and details on every product page." },
	{ icon: MessageCircle, title: "Help choosing", text: "Questions before you buy? Send us a message." },
];

export function TrustRow() {
	return (
		<section className="trust-row" aria-label="Why shop with us">
			{trust.map(({ icon: Icon, title, text }) => (
				<div className="trust-item" key={title}>
					<span className="icon-tile">
						<Icon size={18} strokeWidth={1.7} aria-hidden />
					</span>
					<div>
						<h3>{title}</h3>
						<p>{text}</p>
					</div>
				</div>
			))}
		</section>
	);
}

/** Phones only: a row of round shortcuts under the hero, like an app's category strip. */
export function PhoneShortcuts({ tiles }: { tiles: Tile[] }) {
	return (
		<nav className="phone-shortcuts" aria-label="Shop by category">
			<Link href="/products" className="phone-shortcut">
				<span aria-hidden>
					<LayoutGrid size={22} strokeWidth={1.6} aria-hidden />
				</span>
				All
			</Link>
			{tiles.map((tile) => (
				<Link key={tile.id} href={tile.href} className="phone-shortcut">
					<span aria-hidden>
						{tile.image ? (
							<YNSMedia src={tile.image} alt="" width={54} height={54} sizes="54px" />
						) : (
							<CreditCard size={22} strokeWidth={1.6} aria-hidden />
						)}
					</span>
					{tile.name}
				</Link>
			))}
		</nav>
	);
}

export function CategoryTiles({ title, tiles }: { title: string; tiles: Tile[] }) {
	if (tiles.length === 0) return null;
	return (
		<section className="section">
			<SectionHead title={title} />
			<div className="category-grid">
				{tiles.map((tile) => (
					<Link key={tile.id} href={tile.href} className="category-tile">
						<div className="media">
							{tile.image && (
								<YNSMedia
									src={tile.image}
									alt=""
									fill
									sizes="(max-width: 760px) 50vw, 25vw"
									className="object-cover"
								/>
							)}
						</div>
						<span className="category-tile-label">
							{tile.name}
							<span className="arrow-chip" aria-hidden>
								<ArrowUpRight size={16} aria-hidden />
							</span>
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}

export function ProductCarousel({
	title,
	href,
	products,
}: {
	title: string;
	href: string;
	products: CardProduct[];
}) {
	if (products.length === 0) return null;
	return (
		<section className="section">
			<SectionHead title={title} href={href} />
			<Carousel label={title}>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</Carousel>
		</section>
	);
}

export function EventCards({ title, tiles }: { title: string; tiles: Tile[] }) {
	if (tiles.length === 0) return null;
	return (
		<section className="section">
			<SectionHead title={title} />
			<div className="event-grid">
				{tiles.map((tile) => (
					<Link key={tile.id} href={tile.href} className="event-card">
						<div className="media">
							<YNSMedia
								src={tile.photo}
								alt=""
								fill
								sizes="(max-width: 760px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						<span className="event-card-copy">
							<strong>{tile.name}</strong>
							{tile.description && <span>{tile.description}</span>}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}

/** "Fragrance houses" in the original: the store's brands as wordmark tiles. */
export function BrandRow({ brands }: { brands: { name: string; slug: string }[] }) {
	if (brands.length === 0) return null;
	return (
		<section className="section">
			<SectionHead title="Our makers" href="/products" linkLabel="All products" />
			<div className="brand-row">
				{brands.map((brand) => (
					<Link key={brand.slug} href={`/products?brand=${brand.slug}`} className="brand-tile">
						<span className="brand-wordmark">{brand.name}</span>
					</Link>
				))}
			</div>
		</section>
	);
}

/** The one full-colour moment on the page: a collection on the forest-green panel. */
export function FeatureBanner({ tile, photo }: { tile: Tile | undefined; photo: string }) {
	if (!tile) return null;
	return (
		<section className="feature-banner">
			<div className="feature-banner-copy">
				<h2>{tile.name}</h2>
				{tile.description && <p>{tile.description}</p>}
				<Link href={tile.href} className="button light lg">
					Shop {tile.name.toLowerCase()} <ArrowRight size={18} aria-hidden />
				</Link>
			</div>
			<div className="media feature-banner-media">
				<YNSMedia src={photo} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" className="object-cover" />
			</div>
		</section>
	);
}
