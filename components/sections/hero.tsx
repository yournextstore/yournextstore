import { ArrowRightIcon, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-honey-gradient">
			{/* Soft floral pattern overlay */}
			<div aria-hidden className="absolute inset-0 bg-dot-pattern opacity-30 mix-blend-multiply" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 lg:py-28 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					{/* Left: copy */}
					<div className="max-w-xl">
						<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink/70">
							<span className="h-px w-8 bg-ink/40" />
							New harvest · No. 12
						</span>
						<h1 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-ink">
							The box of <span className="italic text-coral">forgotten joys</span>
						</h1>
						<div className="mt-6 flex items-baseline gap-3">
							<span className="text-xl text-ink/50 line-through">$27.00</span>
							<span className="text-2xl font-semibold text-coral underline decoration-2 underline-offset-4">
								$21.00
							</span>
							<span className="ml-2 inline-flex items-center rounded-full bg-coral/10 text-coral px-2.5 py-1 text-xs font-medium">
								Save 22%
							</span>
						</div>
						<p className="mt-5 text-base sm:text-lg text-ink/80 leading-relaxed max-w-md">
							A still more glorious dawn awaits — small-batch herbal blends, slow-roasted beans, and pantry
							staples kindled by curious hands and quiet mornings.
						</p>

						{/* Quantity + CTA */}
						<div className="mt-9 flex flex-wrap items-center gap-3">
							<div className="inline-flex items-center rounded-full border border-ink/30 bg-white/40 backdrop-blur-sm h-12 px-1">
								<button
									type="button"
									aria-label="Decrease"
									className="h-10 w-10 inline-flex items-center justify-center text-ink/70 hover:text-ink"
								>
									<Minus className="h-4 w-4" />
								</button>
								<span className="w-8 text-center font-medium tabular-nums">1</span>
								<button
									type="button"
									aria-label="Increase"
									className="h-10 w-10 inline-flex items-center justify-center text-ink/70 hover:text-ink"
								>
									<Plus className="h-4 w-4" />
								</button>
							</div>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-ink text-cream rounded-full text-sm font-semibold uppercase tracking-[0.18em] hover:bg-ink/90 transition-colors"
							>
								Add to cart
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
						</div>

						{/* Trust mini-row */}
						<div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink/70">
							<span className="inline-flex items-center gap-1.5">
								<span className="h-1.5 w-1.5 rounded-full bg-sage" />
								Ships within 48 hrs
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="h-1.5 w-1.5 rounded-full bg-sage" />
								Plastic-free packaging
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="h-1.5 w-1.5 rounded-full bg-sage" />
								Independently sourced
							</span>
						</div>
					</div>

					{/* Right: floating product visual */}
					<div className="relative h-[420px] sm:h-[500px] lg:h-[560px]">
						<div
							aria-hidden
							className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 lg:right-0 lg:translate-x-0 w-[88%] aspect-square"
						>
							{/* Soft glow */}
							<div className="absolute inset-6 rounded-[40%_60%_50%_50%] bg-coral/30 blur-3xl" />
							{/* Floating image — uses scraped artisan visual */}
							<div className="absolute inset-0 flex items-center justify-center animate-float-soft">
								<div className="relative h-[88%] w-[72%] rotate-[-6deg] drop-shadow-[0_30px_50px_rgba(43,33,24,0.25)]">
									<Image
										src="/scraped-0.png"
										alt="Featured artisan product"
										fill
										sizes="(max-width: 1024px) 80vw, 600px"
										className="object-contain"
										priority
									/>
								</div>
							</div>
							{/* Floating badge */}
							<div className="absolute top-6 right-4 sm:top-10 sm:right-10 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-sage text-cream flex flex-col items-center justify-center text-center font-serif italic text-xs sm:text-sm shadow-lg rotate-[12deg]">
								<span className="text-[10px] uppercase tracking-widest not-italic font-semibold opacity-80">
									New
								</span>
								<span className="text-base sm:text-lg leading-tight">harvest</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Sage accent strip — like the breadcrumb in reference */}
			<div className="bg-sage text-cream">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
					<nav className="flex items-center gap-2 text-cream/90">
						<YnsLink href="/" className="hover:text-white transition-colors">
							Home
						</YnsLink>
						<span aria-hidden className="opacity-50">
							/
						</span>
						<YnsLink href="/products" className="hover:text-white transition-colors">
							Pantry
						</YnsLink>
						<span aria-hidden className="opacity-50">
							/
						</span>
						<span className="text-white font-medium">The box of forgotten joys</span>
					</nav>
					<div className="flex items-center gap-3 text-cream/90">
						<span className="text-xs uppercase tracking-[0.2em]">Share</span>
						<span aria-hidden className="h-px w-6 bg-cream/40" />
						<a
							href="#"
							aria-label="Share on Facebook"
							className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-cream/30 hover:bg-white/10 transition-colors"
						>
							<span className="text-xs font-semibold">f</span>
						</a>
						<a
							href="#"
							aria-label="Share on Instagram"
							className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-cream/30 hover:bg-white/10 transition-colors"
						>
							<span className="text-xs font-semibold">ig</span>
						</a>
						<a
							href="#"
							aria-label="Share on Twitter"
							className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-cream/30 hover:bg-white/10 transition-colors"
						>
							<span className="text-xs font-semibold">tw</span>
						</a>
						<a
							href="#"
							aria-label="Share via email"
							className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-cream/30 hover:bg-white/10 transition-colors"
						>
							<span className="text-xs font-semibold">@</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
