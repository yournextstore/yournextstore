import { ArrowUpRightIcon, Leaf, Star } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function FeaturedCollection() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-yns-mist aspect-[5/4] lg:aspect-auto">
					<Image
						src="/scraped-5.jpg"
						alt="Curated interior"
						fill
						sizes="(max-width: 1024px) 100vw, 60vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-tr from-[#2b1e18]/60 via-transparent to-transparent" />
					<div className="absolute top-5 left-5 flex items-center gap-2">
						<span className="rounded-full bg-background px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-foreground">
							Volume 12
						</span>
						<span className="rounded-full bg-yns-sun px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-foreground">
							New
						</span>
					</div>
					<div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-sm text-background">
						<p className="text-[11px] tracking-[0.22em] uppercase text-background/80 mb-2">
							The featured edit
						</p>
						<h3 className="yns-display text-3xl sm:text-4xl leading-[1.05]">
							Slow mornings, lit by intention.
						</h3>
						<p className="mt-3 text-sm text-background/80 max-w-xs">
							A reading nook built around three pieces — a brushed brass lamp, washed linen throw and sculpted
							ceramic vessel.
						</p>
						<YnsLink
							href="/products"
							className="mt-5 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-5 py-2.5 text-sm font-medium hover:bg-background/90 transition-colors"
						>
							Shop the edit
							<ArrowUpRightIcon className="h-4 w-4" />
						</YnsLink>
					</div>
				</div>

				<div className="lg:col-span-5 flex flex-col gap-6">
					<div className="relative overflow-hidden rounded-3xl bg-yns-sun p-7 flex flex-col justify-between min-h-[260px]">
						<div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-foreground/10" />
						<div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-foreground/5" />
						<div className="relative flex items-start justify-between">
							<span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-1 text-[11px] tracking-[0.18em] uppercase">
								<Leaf className="h-3 w-3" />
								Sustainable
							</span>
							<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
								<ArrowUpRightIcon className="h-4 w-4" />
							</span>
						</div>
						<div className="relative">
							<h3 className="yns-display text-3xl leading-[1.05] text-foreground">
								Brilliance, eco-touched.
							</h3>
							<p className="mt-2 text-sm text-foreground/80 max-w-xs">
								91% recycled materials. 100% repairable. Made to last decades, not seasons.
							</p>
						</div>
					</div>

					<div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-7 flex flex-col gap-5 min-h-[200px]">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-yns-sun">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={i} className="h-4 w-4 fill-current" />
								))}
							</div>
							<span className="text-[11px] tracking-[0.18em] uppercase text-background/60">
								12,400 reviews
							</span>
						</div>
						<blockquote className="yns-display text-xl leading-snug text-background">
							&ldquo;The lamp arrived feeling like a piece I&apos;d had for years. Honestly the warmth in the
							room shifted within a week.&rdquo;
						</blockquote>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="h-9 w-9 rounded-full bg-yns-rose flex items-center justify-center text-foreground text-sm font-medium">
									EM
								</div>
								<div>
									<p className="text-sm">Elena M.</p>
									<p className="text-xs text-background/60">Verified buyer · London</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
