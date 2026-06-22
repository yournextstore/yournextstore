import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Caption + supporting copy */}
					<div className="lg:col-span-5 order-2 lg:order-1">
						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
							<span className="h-1.5 w-1.5 rounded-full bg-burgundy" />
							Built for the long road
						</div>
						<p className="mt-6 font-display text-2xl sm:text-3xl leading-snug tracking-tight text-foreground">
							All our bags are stain & water resistant. They look great, wear great and will beautifully
							complement your life & style.
						</p>
						<div className="mt-8 space-y-4 max-w-md">
							<Feature label="Full-grain leather sourced from a single Italian tannery." />
							<Feature label="Solid brass hardware, polished by hand and built to outlive trends." />
							<Feature label="Lifetime restitching and edge refinishing — included with every piece." />
						</div>
						<div className="mt-10 flex items-center gap-4">
							<YnsLink
								href="/products"
								className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
							>
								Browse the atelier
							</YnsLink>
							<YnsLink
								href="/faq"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
							>
								Care guide →
							</YnsLink>
						</div>
					</div>

					{/* Image stack */}
					<div className="lg:col-span-7 order-1 lg:order-2">
						<div className="relative">
							<div className="relative aspect-[4/5] sm:aspect-[5/4] rounded-[32px] overflow-hidden bg-secondary">
								<Image
									src="/scraped-2.jpg"
									alt="Featured leather bag detail"
									fill
									sizes="(max-width: 1024px) 100vw, 720px"
									className="object-cover"
								/>
							</div>
							<div className="absolute -bottom-6 -left-6 sm:-left-10 hidden sm:block w-40 lg:w-56 aspect-square rounded-3xl overflow-hidden border-[6px] border-background shadow-xl">
								<Image src="/scraped-4.jpg" alt="Detail shot" fill sizes="220px" className="object-cover" />
							</div>
							<div className="absolute -top-4 right-4 sm:-top-6 sm:right-8 rounded-2xl bg-background border border-border px-4 py-3 shadow-lg">
								<div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
									Avg. lifespan
								</div>
								<div className="font-display text-2xl text-foreground">12+ yrs</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function Feature({ label }: { label: string }) {
	return (
		<div className="flex items-start gap-3">
			<span
				aria-hidden="true"
				className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tan/15 text-tan"
			>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<title>check</title>
					<path
						d="M2 6.5L4.5 9L10 3.5"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
			<p className="text-sm sm:text-base text-foreground/80 leading-relaxed">{label}</p>
		</div>
	);
}
