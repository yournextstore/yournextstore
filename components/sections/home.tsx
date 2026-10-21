import { ArrowRight, ArrowUpRight, CalendarDays, CircleUserRound, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";
import { getCatalogCategories, getFeaturedProducts } from "@/lib/catalog";
import { sentenceCase } from "@/lib/display";
import { EDITORIAL } from "@/lib/editorial";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

function SectionHead({
	eyebrow,
	title,
	href,
	cta,
}: {
	eyebrow: string;
	title: string;
	href: string;
	cta: string;
}) {
	return (
		<header className="mb-[clamp(20px,2.4vw,32px)] flex items-center justify-between gap-6 sm:items-end">
			<div>
				<span className="ed-eyebrow mb-2.5">{eyebrow}</span>
				<h2 className="ed-display m-0 text-display-section">{title}</h2>
			</div>
			<Link href={href} className="ed-link">
				{cta}
				<ArrowRight aria-hidden />
			</Link>
		</header>
	);
}

/** One landscape editorial photograph in a rounded frame, as in the original's hero and lookbook. */
function Photo({
	src,
	className,
	priority = false,
	sizes,
}: {
	src: string;
	className?: string;
	priority?: boolean;
	sizes: string;
}) {
	return (
		<div className={cn("relative overflow-hidden rounded-lg bg-stone", className)}>
			<YNSMedia src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
		</div>
	);
}

export function EditorialHero() {
	return (
		<section className="bg-canvas">
			<div className="page-width grid items-center gap-7 py-[clamp(28px,3.4vw,48px)] min-[901px]:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] min-[901px]:gap-[clamp(24px,3.5vw,48px)]">
				<div className="order-2 grid gap-3.5 min-[901px]:order-1 min-[901px]:max-w-[34rem]">
					<span className="ed-eyebrow">New in</span>
					<h1 className="ed-display m-0 text-display-hero">
						Fine jewellery
						<em className="block italic text-primary">for every day</em>
					</h1>
					<p className="m-0 max-w-[42ch] text-base leading-[1.55] text-muted-foreground">
						Rings, necklaces, earrings and bracelets in gold vermeil and sterling silver, made to wear every
						day and layer together.
					</p>
					<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
						<Link href="/products" className="ed-btn">
							Shop jewellery
						</Link>
						<a href="#categories" className="ed-link">
							Explore categories
							<ArrowRight aria-hidden />
						</a>
					</div>
					<p className="m-0 text-[0.8rem] tracking-[0.01em] text-muted-foreground">
						Gold vermeil & sterling silver · Secure checkout
					</p>
				</div>
				<Photo
					src={EDITORIAL.hero}
					priority
					sizes="(min-width: 901px) 56vw, 100vw"
					className="order-1 aspect-[16/10] max-h-[46vh] w-full min-[901px]:order-2 min-[901px]:aspect-[4/3] min-[901px]:max-h-none"
				/>
			</div>
		</section>
	);
}

const RIBBON = ["Gold vermeil & sterling silver", "Freshwater pearls", "Clear prices", "Secure checkout"];

export function Ribbon() {
	return (
		<div className="border-y border-border bg-card">
			<ul className="page-width flex list-none flex-wrap items-center justify-center gap-x-4 gap-y-1.5 py-3 text-xs uppercase leading-[1.4] tracking-[0.08em] text-muted-foreground">
				{RIBBON.map((item, index) => (
					<li key={item} className="flex items-center gap-4">
						{index > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />}
						{item}
					</li>
				))}
			</ul>
		</div>
	);
}

export async function CategoryTiles() {
	const all = await getCatalogCategories();
	// Three fill one row of three; otherwise an even count, so no row ends on a lone tile.
	const categories = all.length === 3 ? all : all.slice(0, all.length >= 4 ? 4 : 2);
	if (categories.length === 0) return null;
	return (
		<section id="categories" className="scroll-mt-24 bg-canvas">
			<div className="page-width ed-band">
				<SectionHead eyebrow="Browse" title="Shop by category" href="/products" cta="View all" />
				<ul
					className={cn(
						"m-0 grid list-none gap-[clamp(14px,1.6vw,22px)] p-0",
						categories.length === 3 ? "grid-cols-3" : "grid-cols-2 min-[901px]:grid-cols-4",
					)}
				>
					{categories.map((category) => (
						<li key={category.slug}>
							<Link href={`/category/${category.slug}`} className="group block text-foreground">
								<div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-stone">
									{category.image ? (
										<YNSMedia
											src={category.image}
											alt=""
											fill
											sizes="(min-width: 901px) 22vw, 46vw"
											className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
										/>
									) : (
										<div className="h-full w-full bg-[linear-gradient(160deg,#efe9e0,#e3dcd1)]" />
									)}
								</div>
								<span className="mt-2.5 flex items-center justify-between gap-2 text-sm font-semibold">
									{sentenceCase(category.name)}
									<ArrowUpRight
										aria-hidden
										className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-primary"
									/>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export async function FeaturedPieces() {
	const products = await getFeaturedProducts(8);
	return (
		<section className="bg-card">
			<div className="page-width ed-band">
				<SectionHead eyebrow="Handpicked" title="Featured pieces" href="/products" cta="View all" />
				{products.length > 0 ? (
					<ul className="m-0 grid list-none grid-cols-2 gap-x-[clamp(14px,1.6vw,22px)] gap-y-6 p-0 min-[901px]:grid-cols-4">
						{products.map((product) => (
							<li key={product.id}>
								<ProductCard product={product} />
							</li>
						))}
					</ul>
				) : (
					<div className="grid justify-items-center gap-3 rounded-lg border border-border px-6 py-14 text-center">
						<h3 className="ed-display m-0 text-[1.375rem]">No products available</h3>
						<p className="m-0 max-w-[42ch] text-muted-foreground">
							Products will appear here once they are added to the store.
						</p>
						<Link href="/products" className="ed-btn mt-2">
							Browse the catalogue
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}

export function Lookbook() {
	return (
		<section className="bg-canvas">
			<div className="page-width grid items-stretch gap-[clamp(20px,3vw,40px)] pt-[calc(clamp(40px,5vw,64px)/2)] pb-[clamp(40px,5vw,64px)] min-[901px]:grid-cols-2 min-[901px]:pt-[clamp(40px,5vw,64px)]">
				<Photo
					src={EDITORIAL.lookbook}
					sizes="(min-width: 901px) 50vw, 100vw"
					className="aspect-[16/11] min-[901px]:aspect-[4/3]"
				/>
				<div className="grid content-center justify-items-start gap-3.5 min-[901px]:max-w-[34rem]">
					<span className="ed-eyebrow">From the studio</span>
					<h2 className="ed-display m-0 text-display-section">Made at the bench</h2>
					<p className="m-0 max-w-[46ch] text-base leading-[1.55] text-muted-foreground">
						Each piece starts at our jewellery bench: simple shapes in recycled metals, finished by hand and
						made to be worn every day.
					</p>
					<Link href="/products" className="ed-btn ed-btn--ghost">
						Discover more
					</Link>
				</div>
			</div>
		</section>
	);
}

const ASSURANCES: { icon: ReactNode; title: string; text: string }[] = [
	{ icon: <Sparkles aria-hidden />, title: "Finished by hand", text: "Shaped and polished at the bench" },
	{ icon: <CalendarDays aria-hidden />, title: "New arrivals", text: "Fresh additions as they land" },
	{ icon: <ShieldCheck aria-hidden />, title: "Secure checkout", text: "Encrypted & protected" },
	{ icon: <CircleUserRound aria-hidden />, title: "Your account", text: "Every order in one place" },
];

export function Assurances() {
	return (
		<section className="bg-canvas pb-[clamp(40px,5vw,64px)]" aria-label="Why shop with us">
			<ul className="page-width grid list-none grid-cols-2 border-y border-border p-0 min-[901px]:grid-cols-4">
				{ASSURANCES.map((item, index) => (
					<li
						key={item.title}
						className={cn(
							"flex items-center gap-3.5 px-[clamp(12px,2vw,26px)] py-5 [&_svg]:h-[22px] [&_svg]:w-[22px] [&_svg]:flex-none [&_svg]:stroke-[1.5] [&_svg]:text-primary",
							index % 2 === 1 && "border-l border-border",
							index >= 2 && "border-t border-border min-[901px]:border-t-0",
							index === 2 && "min-[901px]:border-l",
						)}
					>
						{item.icon}
						<div>
							<p className="m-0 text-sm font-semibold">{item.title}</p>
							<p className="m-0 mt-0.5 text-[0.82rem] text-muted-foreground">{item.text}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
