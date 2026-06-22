import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden">
			{/* Editorial photograph */}
			<div className="relative h-[78vh] min-h-[560px] max-h-[820px] w-full yns-grain">
				<Image
					src="/scraped-0.jpg"
					alt="Editorial photograph: model on a Mediterranean rooftop"
					fill
					priority
					sizes="100vw"
					className="object-cover object-[60%_center]"
				/>
				{/* Soft cinematic overlays for legibility + warmth */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/20" />
				<div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_55%,transparent_0%,rgba(0,0,0,0.18)_70%)]" />

				{/* Centered headline */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
					<span className="text-white/90 text-[11px] tracking-[0.32em] uppercase mb-4 sm:mb-5 drop-shadow-sm">
						Spring · Summer 2026
					</span>
					<h1 className="font-serif text-white text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
						Point Of View
					</h1>
					<p className="mt-5 max-w-xl text-white/90 text-sm sm:text-base font-light tracking-wide drop-shadow-sm">
						Boho-inspired dresses and easy separates for work, play and every day.
					</p>
					<div className="mt-9 flex flex-col sm:flex-row gap-3">
						<YnsLink
							prefetch="eager"
							href="/products"
							className="inline-flex items-center justify-center h-12 px-10 bg-white text-ink text-[11px] font-semibold tracking-[0.22em] uppercase hover:bg-cream transition-colors"
						>
							Shop New In
						</YnsLink>
						<YnsLink
							prefetch="eager"
							href="#edits"
							className="inline-flex items-center justify-center h-12 px-10 bg-transparent text-white border border-white/70 text-[11px] font-semibold tracking-[0.22em] uppercase hover:bg-white/15 transition-colors"
						>
							Discover The Edit
						</YnsLink>
					</div>
				</div>

				{/* Bottom credit line */}
				<div className="absolute bottom-5 left-0 right-0 flex justify-center px-6">
					<p className="text-white/70 text-[10px] tracking-[0.28em] uppercase">Captured · Tangier Medina</p>
				</div>
			</div>
		</section>
	);
}
