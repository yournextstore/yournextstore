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
					<div className="h-8 w-48 bg-secondary animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-3 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function PromoBanner() {
	return (
		<section className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
			<Image src="/scraped-6.png" alt="New arrivals" fill className="object-cover" sizes="100vw" />
			<div className="absolute inset-0 bg-black/20" />
			<div className="relative z-10 h-full flex items-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="max-w-md">
						<span className="text-xs tracking-[0.2em] uppercase text-white/80 font-medium">New arrival</span>
						<h2 className="mt-3 font-heading text-4xl sm:text-5xl font-light text-white">Denim</h2>
						<div className="mt-6">
							<YnsLink
								prefetch="eager"
								href="/collection/all"
								className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
							>
								Explore collection
								<ArrowRight className="w-3.5 h-3.5" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function GiftCardBanner() {
	return (
		<section className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
			<Image src="/scraped-8.png" alt="Gift cards" fill className="object-cover" sizes="100vw" />
			<div className="absolute inset-0 bg-black/30" />
			<div className="relative z-10 h-full flex items-center justify-end">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="max-w-md ml-auto text-right">
						<h2 className="font-heading text-4xl sm:text-5xl font-light text-white">Gift cards</h2>
						<p className="mt-4 text-base text-white/80 font-light">
							Help support local business by buying a gift card.
						</p>
						<p className="mt-2 text-sm text-white/60">Local pickup available!</p>
						<div className="mt-6">
							<YnsLink
								prefetch="eager"
								href="/collection/all"
								className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
							>
								Shop gift cards
								<ArrowRight className="w-3.5 h-3.5" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function TextBanner() {
	return (
		<section className="py-14 sm:py-20 bg-white">
			<div className="max-w-3xl mx-auto px-4 text-center">
				<p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed">
					Fashion inspired by where we&apos;re from — the sunny shores of California.
				</p>
			</div>
		</section>
	);
}

function CapsuleBanner() {
	return (
		<section className="relative w-full overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				<div className="relative h-[60vh] lg:h-[80vh]">
					<Image
						src="/scraped-10.png"
						alt="Business casual capsule"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
					<div className="absolute inset-0 bg-black/20" />
					<div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12">
						<span className="text-xs tracking-[0.2em] uppercase text-white/80 font-medium">discover our</span>
						<h2 className="mt-2 font-heading text-3xl sm:text-4xl font-light text-white">
							Business casual
							<br />
							Capsule essentials
						</h2>
						<p className="mt-3 text-sm text-white/80 font-light">
							Get the perfect look for your fall classic wardrobe.
						</p>
					</div>
				</div>

				<div className="grid grid-rows-2 h-[60vh] lg:h-[80vh]">
					<YnsLink
						href="/collection/all"
						className="relative bg-[#e8e4de] flex items-center justify-center p-8 group"
					>
						<div className="text-center">
							<div className="flex items-baseline gap-2 justify-center">
								<span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Up to</span>
								<span className="font-heading text-6xl sm:text-7xl font-light text-foreground">50%</span>
							</div>
							<span className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-1 block">
								off Select products
							</span>
							<div className="mt-4 flex gap-3 justify-center">
								<div className="w-16 h-20 bg-secondary overflow-hidden relative">
									<Image src="/scraped-0.png" alt="Sale" fill className="object-cover" sizes="64px" />
								</div>
								<div className="w-16 h-20 bg-secondary overflow-hidden relative">
									<Image src="/scraped-1.png" alt="Sale" fill className="object-cover" sizes="64px" />
								</div>
							</div>
						</div>
					</YnsLink>
					<YnsLink
						href="/collection/all"
						className="relative bg-[#d4cfc7] flex items-center justify-center p-8 group"
					>
						<div className="text-center">
							<div className="flex items-baseline gap-2 justify-center">
								<span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Up to</span>
								<span className="font-heading text-6xl sm:text-7xl font-light text-foreground">25%</span>
								<span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">off</span>
							</div>
							<span className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-1 block">
								summer tops
							</span>
							<div className="mt-4 flex gap-3 justify-center">
								<div className="w-16 h-20 bg-secondary overflow-hidden relative">
									<Image src="/scraped-2.png" alt="Sale" fill className="object-cover" sizes="64px" />
								</div>
								<div className="w-16 h-20 bg-secondary overflow-hidden relative">
									<Image src="/scraped-3.png" alt="Sale" fill className="object-cover" sizes="64px" />
								</div>
							</div>
						</div>
					</YnsLink>
				</div>
			</div>
		</section>
	);
}

function ShopByCategory() {
	const categories = [
		{ name: "Tops", image: "/scraped-11.png", href: "/collection/all" },
		{ name: "Tunics", image: "/scraped-12.png", href: "/collection/all" },
		{ name: "Dresses", image: "/scraped-13.png", href: "/collection/all" },
		{ name: "Accessories", image: "/scraped-14.png", href: "/collection/all" },
	];

	return (
		<section className="py-16 sm:py-24 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="font-heading text-3xl sm:text-4xl font-light text-center mb-12">Shop by category</h2>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{categories.map((cat) => (
						<YnsLink key={cat.name} href={cat.href} className="group">
							<div className="relative aspect-[3/4] overflow-hidden bg-secondary">
								<Image
									src={cat.image}
									alt={cat.name}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 640px) 50vw, 25vw"
								/>
							</div>
							<h3 className="mt-4 text-center text-sm font-medium tracking-[0.1em] uppercase text-foreground">
								{cat.name}
							</h3>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}

function JournalSection() {
	const posts = [
		{ title: "Looks we love", date: "May 10, 2024", image: "/scraped-4.png" },
		{ title: "10 ways to unwind", date: "May 01, 2024", image: "/scraped-5.png" },
		{ title: "Featured designer: Bethany Jones", date: "Apr 30, 2024", image: "/scraped-9.png" },
	];

	return (
		<section className="py-16 sm:py-24 bg-[#f5f5f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-12">
					<h2 className="font-heading text-3xl sm:text-4xl font-light">From the journal</h2>
					<span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
						View all
					</span>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{posts.map((post) => (
						<article key={post.title} className="group cursor-pointer">
							<div className="relative aspect-[4/3] overflow-hidden bg-secondary">
								<Image
									src={post.image}
									alt={post.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>
							</div>
							<div className="mt-4">
								<p className="text-xs text-muted-foreground mb-2">{post.date}</p>
								<h3 className="text-base font-medium text-foreground group-hover:text-accent transition-colors">
									{post.title}
								</h3>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Popular picks" description="Best selling" limit={8} />
			</Suspense>
			<PromoBanner />
			<GiftCardBanner />
			<TextBanner />
			<CapsuleBanner />
			<ShopByCategory />
			<JournalSection />
		</main>
	);
}
