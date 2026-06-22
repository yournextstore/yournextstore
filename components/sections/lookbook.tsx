import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Lookbook() {
	return (
		<section className="border-b-2 border-foreground bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
				<div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center">
					{/* Editorial copy */}
					<div className="order-2 lg:order-1">
						<div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4 text-foreground/60">
							Lookbook
						</div>
						<h2 className="font-display uppercase text-4xl sm:text-5xl lg:text-7xl leading-[0.92] text-foreground">
							Summer
							<br />
							<span className="text-foreground/30">2026</span>
						</h2>
						<p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed">
							A pastel chaos of platforms, charms and city sun. Shot on real friends — never models — in a
							single afternoon across three blocks.
						</p>
						<div className="mt-8 flex items-center gap-6">
							<YnsLink prefetch={"eager"} href="/products" className="yns-btn-brutal">
								Shop The Lookbook
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
							<div className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/60">
								12 looks · 34 pieces
							</div>
						</div>
					</div>

					{/* Image with brutalist label */}
					<div className="order-1 lg:order-2 relative">
						<div className="relative aspect-[4/5] sm:aspect-[5/6] bg-secondary border-2 border-foreground overflow-hidden">
							<Image
								src="/scraped-2.jpg"
								alt="Summer 2026 lookbook"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
								priority={false}
							/>
							<div className="absolute top-4 left-4 right-4 flex justify-between items-start">
								<span className="font-display text-xs uppercase tracking-[0.2em] text-background bg-foreground/80 backdrop-blur px-3 py-1.5">
									Your Next Store
								</span>
								<span className="font-display text-xs uppercase tracking-[0.2em] text-foreground bg-background/90 backdrop-blur px-3 py-1.5">
									Summer 2026
								</span>
							</div>
							<div className="absolute bottom-4 right-4 yns-bg-lime border-2 border-foreground px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase">
								Issue · 04
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
