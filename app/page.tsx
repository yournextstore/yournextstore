import Image from "next/image";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { YnsLink } from "@/components/yns-link";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-3 w-20 bg-secondary rounded-full animate-pulse" />
					<div className="mt-4 h-10 w-64 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-5 w-80 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
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

const marqueeItems = [
	"Slow-roasted",
	"Small batch",
	"Plastic-free",
	"Single origin",
	"Hand-packed in Brooklyn",
	"Botanical blends",
	"Seasonal harvests",
	"Family-owned farms",
];

function Marquee() {
	return (
		<div className="bg-honey/40 border-y border-honey/60 overflow-hidden">
			<div className="flex w-max animate-marquee py-4">
				{[...Array(2)].map((_, dup) => (
					<div key={dup} className="flex items-center shrink-0">
						{marqueeItems.map((item, i) => (
							<div key={`${dup}-${i}`} className="flex items-center">
								<span className="px-8 font-serif italic text-2xl sm:text-3xl text-ink whitespace-nowrap">
									{item}
								</span>
								<span aria-hidden className="text-coral text-2xl">
									✦
								</span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

const collections = [
	{
		title: "Botanical teas",
		copy: "Floral, foraged, & quietly herbal",
		href: "/products",
		img: "/scraped-2.jpg",
		bg: "bg-coral-soft",
	},
	{
		title: "Slow-roasted beans",
		copy: "Single-origin pours for slow mornings",
		href: "/products",
		img: "/scraped-3.jpg",
		bg: "bg-honey",
	},
	{
		title: "Pantry essentials",
		copy: "Jams, salts & sweet preserves",
		href: "/products",
		img: "/scraped-4.jpg",
		bg: "bg-sage-soft",
	},
];

function CollectionPromo() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
					<div className="max-w-xl">
						<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sage">
							<span className="h-px w-8 bg-sage" />
							Wander the shelves
						</span>
						<h2 className="mt-4 font-serif text-4xl sm:text-5xl tracking-tight text-foreground">
							Collections worth lingering over
						</h2>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
					{collections.map((c) => (
						<YnsLink
							key={c.title}
							href={c.href}
							className={`group relative overflow-hidden rounded-[2rem] ${c.bg} aspect-[3/4] flex flex-col`}
						>
							<div className="relative flex-1 m-4 mb-0 rounded-[1.5rem] overflow-hidden bg-white/40">
								<Image
									src={c.img}
									alt={c.title}
									fill
									sizes="(max-width: 640px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</div>
							<div className="p-6 flex items-end justify-between gap-3">
								<div>
									<h3 className="font-serif text-2xl text-ink">{c.title}</h3>
									<p className="text-sm text-ink/70 mt-1">{c.copy}</p>
								</div>
								<span className="shrink-0 h-10 w-10 rounded-full bg-ink text-cream inline-flex items-center justify-center text-lg group-hover:rotate-45 transition-transform">
									→
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}

function PressStrip() {
	const press = ["Bon Appétit", "Kinfolk", "Cup of Jo", "Cherry Bombe", "The New Yorker"];
	return (
		<div className="bg-background border-y border-border/70">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-5 gap-6 items-center">
				{press.map((p) => (
					<div
						key={p}
						className="font-serif italic text-center text-xl text-muted-foreground/70 hover:text-foreground transition-colors"
					>
						{p}
					</div>
				))}
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<Marquee />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="From the pantry" eyebrow="Featured" limit={8} />
			</Suspense>
			<CollectionPromo />
			<About />
			<PressStrip />
			<Newsletter />
		</>
	);
}
