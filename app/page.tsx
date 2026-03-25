import { ArrowRight, Package, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { NewsletterForm } from "@/components/sections/newsletter-form";
import { ProductGrid } from "@/components/sections/product-grid";
import { YnsLink } from "@/components/yns-link";

function ProductGridSkeleton() {
	return (
		<section className="section-shell-tight">
			<div className="mb-10 flex items-end justify-between gap-8">
				<div className="space-y-3">
					<div className="h-3 w-24 rounded-full bg-secondary" />
					<div className="h-10 w-72 rounded bg-secondary" />
					<div className="h-4 w-96 max-w-full rounded bg-secondary" />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="space-y-3">
						<div className="aspect-[4/5] bg-secondary" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 rounded bg-secondary" />
							<div className="h-4 w-1/3 rounded bg-secondary" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function RoomsSection() {
	const rooms = [
		{
			src: "/scraped-4.png",
			label: "Living",
			description: "Low seating, generous textiles, and tables that anchor the room.",
			href: "/collection/living",
			layout: "large",
		},
		{
			src: "/scraped-7.png",
			label: "Dining",
			description: "Solid forms and warmer finishes for slower, longer meals.",
			href: "/collection/dining",
			layout: "small",
		},
		{
			src: "/scraped-13.png",
			label: "Bedroom",
			description: "Quiet silhouettes and tactile materials arranged for rest.",
			href: "/collection/bedroom",
			layout: "small",
		},
	] as const;

	return (
		<section className="section-shell">
			<div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
				<div className="space-y-6">
					<p className="editorial-kicker">Rooms in Focus</p>
					<h2 className="section-title max-w-md">Minimal, but never sterile.</h2>
					<p className="editorial-copy">
						The best rooms do less, but they do it with confidence. We&apos;re leaning into softer finishes,
						architectural shapes, and pieces that feel calm from every angle.
					</p>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
					>
						Browse all pieces
						<ArrowRight className="h-3.5 w-3.5" />
					</YnsLink>
				</div>

				<div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
					{rooms.map((room) => (
						<YnsLink
							prefetch={"eager"}
							key={room.label}
							href={room.href}
							className={`group relative overflow-hidden border border-border/80 bg-card ${
								room.layout === "large"
									? "min-h-[28rem] lg:min-h-[34rem]"
									: "min-h-[14rem] lg:min-h-[16.5rem]"
							}`}
						>
							<Image
								src={room.src}
								alt={room.label}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
								sizes={
									room.layout === "large"
										? "(max-width: 1024px) 100vw, 44vw"
										: "(max-width: 1024px) 100vw, 22vw"
								}
							/>
							<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,17,15,0.04)_0%,rgba(21,17,15,0.64)_100%)]" />
							<div className="absolute inset-x-0 bottom-0 space-y-2 p-5 text-white sm:p-6">
								<p className="font-editorial text-3xl tracking-[-0.04em]">{room.label}</p>
								<p className="max-w-sm text-sm leading-6 text-white/80">{room.description}</p>
								<span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-white/78 transition-colors group-hover:text-white">
									Shop room
									<ArrowRight className="h-3.5 w-3.5" />
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}

function CollectionSpotlight() {
	const links = [
		{ label: "Sofas and lounge chairs", href: "/collection/sofas" },
		{ label: "Dining tables and lighting", href: "/collection/dining" },
		{ label: "Objects and smaller accents", href: "/collection/decor" },
	];

	return (
		<section className="section-shell">
			<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
				<div className="relative min-h-[24rem] overflow-hidden border border-border/80 bg-card sm:min-h-[32rem]">
					<Image
						src="/scraped-12.png"
						alt="Studio edit with warm-toned office furniture"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 58vw"
					/>
					<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,241,234,0.9)_0%,rgba(246,241,234,0.35)_52%,rgba(21,17,15,0.12)_100%)]" />
					<div className="relative flex h-full items-end p-6 sm:p-10">
						<div className="max-w-md space-y-4">
							<p className="editorial-kicker text-foreground/70">Collection Spotlight</p>
							<h2 className="section-title text-foreground">The studio edit is pared back and tactile.</h2>
							<p className="text-sm leading-7 text-foreground/70 sm:text-base">
								Think pale oak, softened stone, brushed hardware, and upholstery that quiets a room the moment
								it arrives.
							</p>
						</div>
					</div>
				</div>

				<div className="surface-panel flex flex-col justify-between p-6 sm:p-8">
					<div className="space-y-5">
						<p className="editorial-kicker">What to Explore</p>
						<p className="font-editorial text-[2rem] leading-[0.98] tracking-[-0.05em] text-foreground">
							Start with the pieces that set the whole tone.
						</p>
						<p className="text-sm leading-7 text-muted-foreground">
							Anchor the room first, then let texture and proportion carry the rest. The strongest spaces
							usually begin with one decisive silhouette.
						</p>
					</div>

					<div className="mt-8 border-t border-border/80 pt-6">
						<ul className="space-y-4">
							{links.map((link) => (
								<li key={link.label}>
									<YnsLink
										prefetch={"eager"}
										href={link.href}
										className="group flex items-center justify-between gap-3 text-sm text-foreground/82 transition-colors hover:text-foreground"
									>
										<span>{link.label}</span>
										<ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
									</YnsLink>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}

function ProofSection() {
	const values = [
		{
			icon: Truck,
			title: "Complimentary delivery",
			description: "Available on larger orders so the final step feels as considered as the first.",
		},
		{
			icon: RotateCcw,
			title: "30-day returns",
			description: "Enough time to see how a piece settles into the room before you decide.",
		},
		{
			icon: ShieldCheck,
			title: "Long-wear materials",
			description: "Surfaces and finishes chosen to look better with time, not just on day one.",
		},
		{
			icon: Package,
			title: "Made in thoughtful runs",
			description: "Smaller production, stronger character, and a closer relationship to the makers.",
		},
	];

	const quotes = [
		{
			source: "APARTAMENTO",
			quote: "A warm, composed selection that feels more like a point of view than a catalog.",
		},
		{
			source: "SIGHT UNSEEN",
			quote: "The restraint is what works. Nothing feels loud, but everything feels deliberate.",
		},
		{
			source: "ARCHITECTURAL DIGEST",
			quote: "Pieces that bring the room together without flattening it into a showroom.",
		},
	];

	return (
		<section className="section-shell">
			<div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
				<div className="surface-panel p-6 sm:p-8">
					<p className="editorial-kicker">Service Notes</p>
					<div className="mt-5 space-y-5">
						{values.map((value) => (
							<div key={value.title} className="border-t border-border/80 pt-5 first:border-t-0 first:pt-0">
								<div className="flex items-start gap-3">
									<div className="mt-0.5 flex h-10 w-10 items-center justify-center border border-border/80 bg-background">
										<value.icon className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="space-y-1.5">
										<p className="font-medium text-foreground">{value.title}</p>
										<p className="text-sm leading-6 text-muted-foreground">{value.description}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					{quotes.map((quote) => (
						<div key={quote.source} className="hairline-panel flex flex-col justify-between p-6 sm:p-7">
							<div className="space-y-5">
								<p className="editorial-kicker">{quote.source}</p>
								<p className="font-editorial text-[1.45rem] leading-[1.08] tracking-[-0.04em] text-foreground">
									&ldquo;{quote.quote}&rdquo;
								</p>
							</div>
							<span className="mt-8 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
								Editorial note
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function NewsletterSection() {
	return (
		<section id="newsletter" className="section-shell">
			<div className="overflow-hidden border border-border/80 bg-foreground px-6 py-12 text-primary-foreground sm:px-10 sm:py-16">
				<div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
					<div className="space-y-4">
						<p className="text-[0.72rem] uppercase tracking-[0.18em] text-primary-foreground/55">
							Studio Notes
						</p>
						<h2 className="font-editorial text-[clamp(2rem,4vw,3.8rem)] leading-[0.96] tracking-[-0.05em] text-balance">
							New arrivals, private pricing previews, and occasional room studies.
						</h2>
					</div>
					<div className="space-y-5">
						<p className="max-w-xl text-sm leading-7 text-primary-foreground/72 sm:text-base">
							Join the list for a more considered pace: product drops worth waiting for, quieter inspiration,
							and first notice when the best pieces land.
						</p>
						<NewsletterForm />
					</div>
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
				<ProductGrid
					title="The current edit"
					description="Sculptural seating, warmer woods, and a few anchor pieces that settle a room quickly."
					limit={5}
				/>
			</Suspense>
			<RoomsSection />
			<CollectionSpotlight />
			<ProofSection />
			<NewsletterSection />
		</main>
	);
}
