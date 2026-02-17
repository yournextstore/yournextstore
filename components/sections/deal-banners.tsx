import Image from "next/image";
import { YnsLink } from "../yns-link";

export function DealBanners() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative h-auto min-h-[400px]">
				<Image
					src="/scraped-6.png"
					alt="Automotive headlight close-up"
					fill
					className="object-cover"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />

				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 items-center py-14">
					<div className="text-white">
						<p className="font-heading text-brand text-xs font-semibold uppercase tracking-widest">
							Deal of the Day
						</p>
						<h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase mt-2 leading-tight">
							Black-Silver Carbon Fiber Style Emblem
						</h3>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-4 inline-flex items-center justify-center h-10 px-6 bg-brand text-brand-foreground font-heading font-semibold uppercase text-xs tracking-wider hover:bg-yellow-500 transition-colors"
						>
							SHOP NOW
						</YnsLink>
					</div>

					<div className="text-white text-center">
						<p className="font-heading text-brand text-xs font-semibold uppercase tracking-widest">
							Bestseller of the Week
						</p>
						<h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase mt-2 leading-tight">
							All Weather Terrain Braker AS/PRO
						</h3>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-4 inline-flex items-center justify-center h-10 px-6 border border-white/30 text-white font-heading font-semibold uppercase text-xs tracking-wider hover:bg-white/10 transition-colors"
						>
							VIEW DETAILS
						</YnsLink>
					</div>

					<div className="text-white sm:text-right">
						<p className="font-heading text-brand text-xs font-semibold uppercase tracking-widest">
							Save on Peripherals
						</p>
						<h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase mt-2 leading-tight">
							Turbo Diesel Timing Belt (4WD, 2WD/4WD)
						</h3>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-4 inline-flex items-center justify-center h-10 px-6 bg-brand text-brand-foreground font-heading font-semibold uppercase text-xs tracking-wider hover:bg-yellow-500 transition-colors"
						>
							SHOP NOW
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
