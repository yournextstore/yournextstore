import Image from "next/image";
import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { YnsLink } from "@/components/yns-link";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="text-center mb-14">
				<div className="h-8 w-48 bg-secondary rounded animate-pulse mx-auto" />
				<div className="mt-3 h-5 w-64 bg-secondary rounded animate-pulse mx-auto" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary mb-4 animate-pulse" />
						<div className="space-y-2 flex flex-col items-center">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CategoryGrid() {
	const categories = [
		{ name: "Green Teas", image: "/scraped-8.jpg" },
		{ name: "Black Teas", image: "/scraped-2.jpg" },
		{ name: "White Teas", image: "/scraped-11.jpg" },
		{ name: "Oolong Teas", image: "/scraped-10.jpg" },
		{ name: "Matcha", image: "/scraped-12.jpg" },
		{ name: "Accessories", image: "/scraped-9.jpg" },
	];

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="text-center mb-12">
				<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-medium text-foreground">
					Our Collections
				</h2>
				<p className="mt-3 text-muted-foreground">Browse teas by type</p>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
				{categories.map((cat) => (
					<YnsLink
						prefetch={"eager"}
						key={cat.name}
						href="#products"
						className="group relative aspect-square overflow-hidden bg-cream"
					>
						<Image
							src={cat.image}
							alt={cat.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-110"
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
						/>
						<div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-white text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase text-center px-2">
								{cat.name}
							</span>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}

function FeatureBanner() {
	return (
		<section className="bg-secondary/50 py-16 sm:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-14">
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-medium text-foreground">
						What Sets Our Teas Apart?
					</h2>
				</div>
				<div className="grid md:grid-cols-3 gap-10 md:gap-16">
					<div className="text-center">
						<div className="mx-auto mb-5 h-px w-12 bg-tea" />
						<h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-foreground mb-3">
							Tradition
						</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Our teas are produced in accordance with Chinese and Japanese traditions, without artificial
							flavors or additives.
						</p>
					</div>
					<div className="text-center">
						<div className="mx-auto mb-5 h-px w-12 bg-tea" />
						<h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-foreground mb-3">
							Selection
						</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Every tea in our collection has been rigorously tested before purchase. With us, there are no
							bad choices.
						</p>
					</div>
					<div className="text-center">
						<div className="mx-auto mb-5 h-px w-12 bg-tea" />
						<h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-foreground mb-3">
							Packaging
						</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Our packaging is 100% plastic-free. You will notice our compostable cellulose film — a better
							choice for the environment.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function MatchaBanner() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
				<div className="relative aspect-[4/3] overflow-hidden bg-cream">
					<Image
						src="/scraped-12.jpg"
						alt="Matcha tea set with traditional accessories"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>
				<div>
					<p className="text-xs tracking-[0.3em] uppercase text-tea font-medium mb-4">Featured Collection</p>
					<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-medium text-foreground leading-tight">
						Japanese Matcha
					</h2>
					<p className="mt-5 text-muted-foreground leading-relaxed">
						Experience the finest ceremonial and culinary grade matcha, sourced directly from renowned tea
						gardens in Uji and Nishio, Japan. Stone-ground to perfection for a vibrant, smooth flavor.
					</p>
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="inline-flex items-center justify-center mt-8 h-12 px-8 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium hover:bg-primary/90 transition-colors"
					>
						Explore Matcha
					</YnsLink>
				</div>
			</div>
		</section>
	);
}

function WorkshopBanner() {
	return (
		<section className="bg-cream py-16 sm:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
					<div className="order-2 lg:order-1">
						<p className="text-xs tracking-[0.3em] uppercase text-tea font-medium mb-4">Learn & Discover</p>
						<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-medium text-foreground leading-tight">
							Tea Workshops & Events
						</h2>
						<p className="mt-5 text-muted-foreground leading-relaxed">
							Want to discover the secrets of tea? Our life revolves around tea and we love sharing our
							passion. We regularly host tea workshops and tastings to deepen your appreciation of this
							wonderful plant.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="inline-flex items-center justify-center mt-8 h-12 px-8 border border-foreground/20 text-sm tracking-[0.15em] uppercase font-medium hover:bg-foreground/5 transition-colors"
						>
							View Events
						</YnsLink>
					</div>
					<div className="order-1 lg:order-2 relative aspect-[4/3] overflow-hidden">
						<Image
							src="/scraped-10.jpg"
							alt="Tea preparation with loose leaf tea"
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

function BlogPreview() {
	const posts = [
		{
			title: "The Art of Tea Brewing",
			category: "Tea Knowledge",
			image: "/scraped-8.jpg",
			excerpt: "A visual guide to tea accessories and brewing tools from around the world.",
		},
		{
			title: "Understanding Water Temperature",
			category: "Tea Knowledge",
			image: "/scraped-3.jpg",
			excerpt:
				"At what temperature should you brew your tea? The answer is both simple and infinitely complex.",
		},
		{
			title: "Specialty Tea Cupping Notes",
			category: "Culture",
			image: "/scraped-14.jpg",
			excerpt: "A small collection of tea curiosities and tasting notes from our archive.",
		},
	];

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="text-center mb-14">
				<p className="text-xs tracking-[0.3em] uppercase text-tea font-medium mb-3">From Our Blog</p>
				<h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-medium text-foreground">
					Tea Knowledge & Stories
				</h2>
				<p className="mt-3 text-muted-foreground">Join us on a journey through the world of tea</p>
			</div>
			<div className="grid md:grid-cols-3 gap-8">
				{posts.map((post) => (
					<article key={post.title} className="group">
						<div className="relative aspect-[4/3] overflow-hidden bg-cream mb-5">
							<Image
								src={post.image}
								alt={post.title}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
						</div>
						<p className="text-xs tracking-[0.15em] uppercase text-tea font-medium mb-2">{post.category}</p>
						<h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-tea transition-colors">
							{post.title}
						</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
					</article>
				))}
			</div>
		</section>
	);
}

function ContactBanner() {
	return (
		<section className="bg-primary py-12 text-center">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p className="text-primary-foreground/80 text-sm mb-3">Have a question?</p>
				<YnsLink
					prefetch={"eager"}
					href="#"
					className="inline-flex items-center justify-center h-12 px-8 border border-primary-foreground/30 text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium hover:bg-primary-foreground/10 transition-colors"
				>
					Get in Touch
				</YnsLink>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<CategoryGrid />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Our Selection" description="Discover our handpicked favorites" limit={6} />
			</Suspense>
			<FeatureBanner />
			<MatchaBanner />
			<WorkshopBanner />
			<BlogPreview />
			<ContactBanner />
		</main>
	);
}
