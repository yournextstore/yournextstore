import { ArrowRight, BadgeDollarSign, Package, RotateCcw, Truck } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { NewsletterForm } from "@/components/sections/newsletter-form";
import { ProductGrid } from "@/components/sections/product-grid";
import { YnsLink } from "@/components/yns-link";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary mb-3 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function InspirationSection() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<p className="text-center text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-14">
				Get inspired by shopping our carefully curated selection of beautiful and intentionally designed
				pieces that hold their own over time.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				{[
					{ src: "/scraped-4.png", label: "Living", href: "/collection/living" },
					{ src: "/scraped-7.png", label: "Dining", href: "/collection/dining" },
					{ src: "/scraped-13.png", label: "Bedroom", href: "/collection/bedroom" },
				].map((item) => (
					<YnsLink
						prefetch={"eager"}
						key={item.label}
						href={item.href}
						className="group relative overflow-hidden aspect-[2/3]"
					>
						<Image
							src={item.src}
							alt={item.label}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
						<div className="absolute bottom-6 left-6 text-white">
							<p className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
								{item.label}
							</p>
							<p className="text-sm opacity-80 mt-1">Shop All</p>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}

function SaleBanner() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative h-[40vh] sm:h-[50vh]">
				<Image
					src="/scraped-12.png"
					alt="Modern office furniture on sale"
					fill
					className="object-cover"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
				<div className="absolute inset-0 flex items-center">
					<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
						<div className="max-w-lg text-white">
							<p
								className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								Up to 50% off
							</p>
							<p className="text-base sm:text-lg opacity-90 mb-8">
								Shop our most anticipated studio sale of the year!
							</p>
							<div className="flex gap-4">
								<YnsLink
									prefetch={"eager"}
									href="/collection/sale"
									className="inline-flex items-center gap-2 bg-white text-foreground px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
								>
									Shop Sale
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="/collection/decor"
									className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
								>
									Shop Decor
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function TopCollections() {
	const collections = [
		{ src: "/scraped-8.png", label: "Sofas", href: "/collection/sofas" },
		{ src: "/scraped-13.png", label: "Home Decor", href: "/collection/decor" },
		{ src: "/scraped-3.png", label: "Tables", href: "/collection/tables" },
		{ src: "/scraped-8.png", label: "Chairs", href: "/collection/chairs" },
	];

	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<h2
				className="text-2xl sm:text-3xl font-medium text-center mb-12"
				style={{ fontFamily: "var(--font-heading)" }}
			>
				Top Collections
			</h2>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
				{collections.map((col) => (
					<YnsLink prefetch={"eager"} key={col.label} href={col.href} className="group text-center">
						<div className="relative aspect-square overflow-hidden rounded-sm mb-4">
							<Image
								src={col.src}
								alt={col.label}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="(max-width: 768px) 50vw, 25vw"
							/>
						</div>
						<p className="text-sm font-medium">{col.label}</p>
					</YnsLink>
				))}
			</div>
		</section>
	);
}

function DesignerShowcase() {
	return (
		<section className="bg-secondary py-16 sm:py-20">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="text-2xl sm:text-3xl font-medium text-center mb-12"
					style={{ fontFamily: "var(--font-heading)" }}
				>
					Our Recognized Designers
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
					<div className="relative aspect-[3/4] overflow-hidden">
						<Image src="/scraped-0.png" alt="Featured designer" fill className="object-cover" sizes="300px" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
						<div className="absolute bottom-6 left-6 text-white">
							<p className="text-xs uppercase tracking-widest mb-1">Explore the Brand</p>
							<p className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
								Featured
							</p>
							<p className="text-sm mt-1 opacity-80">Shop More</p>
						</div>
					</div>
					<Suspense fallback={<ProductGridSkeleton />}>
						<ProductGrid title="" description="" limit={6} showViewAll={false} />
					</Suspense>
				</div>
			</div>
		</section>
	);
}

function BrandLogos() {
	return (
		<section className="border-y border-border py-10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-center gap-12 sm:gap-16 flex-wrap opacity-40">
					{["NORMANN", "MENU", "MUUTO", "FERM", "DONNA"].map((brand) => (
						<span key={brand} className="text-lg sm:text-xl font-medium tracking-widest text-foreground">
							{brand}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}

function PromoSlideshow() {
	const promos = [
		{
			src: "/scraped-5.png",
			title: "Sustainable Living",
			description:
				"Save up to 40% on all selections from our environmentally conscious collection, because you deserve it!",
			cta: "Shop Sale",
			href: "/collection/sale",
		},
		{
			src: "/scraped-10.png",
			title: "Nature Inspired",
			description: "Shop our raw Concrete Bowl.",
			cta: "Buy Now",
			href: "/products",
		},
		{
			src: "/scraped-14.png",
			title: "Save Up To 30%",
			description: "Browse our mid-century options.",
			cta: "Shop Now",
			href: "/products",
		},
	];

	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				{promos.map((promo) => (
					<YnsLink
						prefetch={"eager"}
						key={promo.title}
						href={promo.href}
						className="group relative overflow-hidden aspect-[4/3]"
					>
						<Image
							src={promo.src}
							alt={promo.title}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
						<div className="absolute bottom-6 left-6 right-6 text-white">
							<p
								className="text-lg sm:text-xl font-semibold mb-1"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								{promo.title}
							</p>
							<p className="text-sm opacity-80 mb-3 line-clamp-2">{promo.description}</p>
							<span className="inline-flex items-center gap-1 text-sm font-medium border-b border-white/50 pb-0.5 group-hover:border-white transition-colors">
								{promo.cta}
								<ArrowRight className="h-3.5 w-3.5" />
							</span>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}

function ShopBySection() {
	const sections = [
		{
			title: "Shop by Piece",
			image: "/scraped-7.png",
			links: [
				{ label: "Chairs", href: "/collection/chairs" },
				{ label: "Tables", href: "/collection/tables" },
				{ label: "Sofas", href: "/collection/sofas" },
				{ label: "Desks", href: "/collection/desks" },
				{ label: "Shelving", href: "/collection/shelving" },
				{ label: "Beds", href: "/collection/beds" },
				{ label: "Lighting", href: "/collection/lighting" },
			],
		},
		{
			title: "Shop by Brand",
			image: "/scraped-10.png",
			links: [
				{ label: "Featured", href: "/products" },
				{ label: "New Arrivals", href: "/products" },
				{ label: "Best Sellers", href: "/products" },
				{ label: "Sale", href: "/products" },
				{ label: "Trending", href: "/products" },
				{ label: "Shop All", href: "/products" },
			],
		},
		{
			title: "Shop by Collection",
			image: "/scraped-11.png",
			links: [
				{ label: "Bedroom", href: "/collection/bedroom" },
				{ label: "Living Room", href: "/collection/living" },
				{ label: "Dining Room", href: "/collection/dining" },
				{ label: "Office", href: "/collection/office" },
				{ label: "Lighting", href: "/collection/lighting" },
				{ label: "Accessories", href: "/products" },
			],
		},
	];

	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
				{sections.map((section) => (
					<div key={section.title}>
						<div className="flex items-center gap-4 mb-6">
							<div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
								<Image src={section.image} alt={section.title} fill className="object-cover" sizes="56px" />
							</div>
							<h3 className="text-lg font-medium" style={{ fontFamily: "var(--font-heading)" }}>
								{section.title}
							</h3>
						</div>
						<ul className="space-y-2.5">
							{section.links.map((link) => (
								<li key={link.label}>
									<YnsLink
										prefetch={"eager"}
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.label}
									</YnsLink>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
}

function FamilySection() {
	return (
		<section className="bg-secondary">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<h2
					className="text-2xl sm:text-3xl font-medium text-center mb-12"
					style={{ fontFamily: "var(--font-heading)" }}
				>
					Designs the whole family can enjoy
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
					<div className="relative aspect-[4/3] overflow-hidden rounded-sm">
						<Image
							src="/scraped-4.png"
							alt="Family enjoying beautifully designed living space"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>
					<div className="relative aspect-[4/3] overflow-hidden rounded-sm">
						<Image
							src="/scraped-1.png"
							alt="Comfortable bedroom design"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

function Testimonials() {
	const quotes = [
		{
			source: "APARTAMENTO",
			quote:
				"Well, we've said it once and we will continue to say it over and over again, this brand is truly an ode to all things refined and beautiful. Bravo!",
		},
		{
			source: "ARCHITECTURAL DIGEST",
			quote:
				"It's rare to find such a curated brand with options for everyone, especially when it comes to affordability. We are looking forward to future collections.",
		},
		{
			source: "FORBES",
			quote:
				"This brand continues to impress the world with their eco-luxe products and approachability. It's not everyday you stumble across stores like this.",
		},
	];

	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
				{quotes.map((item) => (
					<div key={item.source} className="text-center">
						<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
							{item.source}
						</p>
						<blockquote className="text-sm leading-relaxed text-muted-foreground italic">
							&ldquo;{item.quote}&rdquo;
						</blockquote>
					</div>
				))}
			</div>
		</section>
	);
}

function PolicyBanner() {
	const policies = [
		{
			icon: Package,
			title: "Made to Order",
			description: "Learn more about custom orders.",
			href: "/products",
		},
		{
			icon: RotateCcw,
			title: "Return Policy",
			description: "You have 30 days for returns.",
			href: "/products",
		},
		{
			icon: Truck,
			title: "Contactless Delivery",
			description: "Now offering a safer way to shop.",
			href: "/products",
		},
		{
			icon: BadgeDollarSign,
			title: "Price Matching",
			description: "See something you like elsewhere?",
			href: "/products",
		},
	];

	return (
		<section className="border-y border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
					{policies.map((policy) => (
						<div key={policy.title} className="py-8 px-4 sm:px-6 text-center">
							<policy.icon className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
							<p className="text-sm font-medium mb-1">{policy.title}</p>
							<p className="text-xs text-muted-foreground">{policy.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function NewsletterSection() {
	return (
		<section className="bg-foreground text-primary-foreground py-16 sm:py-20">
			<div className="max-w-xl mx-auto px-4 text-center">
				<h2 className="text-2xl sm:text-3xl font-medium mb-4" style={{ fontFamily: "var(--font-heading)" }}>
					Give 20%, Get $20!
				</h2>
				<p className="text-sm opacity-70 mb-8">
					Join our newsletter today and receive 20% off for a friend and $20 for yourself!
				</p>
				<NewsletterForm />
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Products" limit={5} />
			</Suspense>
			<InspirationSection />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Brand New Selections" limit={5} />
			</Suspense>
			<SaleBanner />
			<TopCollections />
			<DesignerShowcase />
			<BrandLogos />
			<PromoSlideshow />
			<ShopBySection />
			<FamilySection />
			<Testimonials />
			<PolicyBanner />
			<NewsletterSection />
		</main>
	);
}
