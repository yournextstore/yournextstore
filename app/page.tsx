import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { YnsLink } from "@/components/yns-link";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-4 w-24 bg-secondary rounded animate-pulse mb-2" />
					<div className="h-8 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-card rounded-lg mb-4 animate-pulse border border-border" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

const categories = [
	{
		title: "Gaming PCs",
		description: "High-performance systems for every playstyle.",
		image: "/scraped-6.jpg",
		href: "#products",
		size: "large" as const,
	},
	{
		title: "Headsets",
		description: "Immersive audio for competitive gaming.",
		image: "/scraped-9.jpg",
		href: "#products",
		size: "small" as const,
	},
	{
		title: "Keyboards",
		description: "Responsive keyboards for accurate play.",
		image: "/scraped-12.jpg",
		href: "#products",
		size: "small" as const,
	},
	{
		title: "Mice",
		description: "Precision mice for speed and control.",
		image: "/scraped-3.jpg",
		href: "#products",
		size: "medium" as const,
	},
];

function CategoriesSection() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div className="mb-10">
				<p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Categories</p>
				<h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
					Shop Across Categories
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{categories.map((cat) => (
					<YnsLink
						prefetch={"eager"}
						key={cat.title}
						href={cat.href}
						className={`group relative overflow-hidden rounded-lg ${cat.size === "large" ? "md:col-span-2 lg:col-span-2 h-80" : "h-64"}`}
					>
						<Image
							src={cat.image}
							alt={cat.title}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
						<div className="absolute bottom-0 left-0 p-6">
							<h3 className="font-heading text-lg font-bold uppercase text-foreground">{cat.title}</h3>
							<p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
							<span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary mt-3">
								Shop now <ArrowRight className="h-3 w-3" />
							</span>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}

function PromoBanner() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative h-80 sm:h-96">
				<Image src="/scraped-5.jpg" alt="Gaming setup" fill className="object-cover" />
				<div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
				<div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
					<div className="max-w-lg">
						<span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 inline-block">
							Exclusive
						</span>
						<h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase leading-tight text-foreground">
							Engineered for the Modern Gaming World
						</h2>
						<p className="mt-3 text-muted-foreground">Unmatched power meets sleek design.</p>
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="inline-flex items-center gap-2 mt-6 h-11 px-6 bg-primary text-primary-foreground rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
						>
							Explore Now
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}

const collectionsGrid = [
	{ title: "Fastest Gaming Processors", image: "/scraped-5.jpg" },
	{ title: "Essential Streaming Gear", image: "/scraped-7.jpg" },
	{ title: "New Gaming Mice", image: "/scraped-3.jpg" },
	{ title: "Ergonomic Gaming Chairs", image: "/scraped-8.jpg" },
	{ title: "Mechanical Keyboards", image: "/scraped-11.jpg" },
	{ title: "Premium Headsets", image: "/scraped-10.jpg" },
];

function CollectionsGrid() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div className="mb-10">
				<p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Collections</p>
				<h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
					What&apos;s New
				</h2>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
				{collectionsGrid.map((item) => (
					<YnsLink
						prefetch={"eager"}
						key={item.title}
						href="#products"
						className="group relative aspect-square rounded-lg overflow-hidden"
					>
						<Image
							src={item.image}
							alt={item.title}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
						<div className="absolute bottom-0 left-0 p-4">
							<h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
							<span className="text-xs text-primary font-semibold uppercase tracking-wider">Shop now</span>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<CollectionsGrid />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Top Items" description="Top 10 Items of the Month" limit={9} />
			</Suspense>
			<PromoBanner />
			<CategoriesSection />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Sale" description="Score Big with Hot Deals" limit={6} showViewAll={false} />
			</Suspense>
		</main>
	);
}
