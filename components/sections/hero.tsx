import { ArrowRight, Camera, Check, Play } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const features = [
	"100% Authentic Essentials",
	"Free & Easy Returns",
	"Worldwide Delivery",
	"Safe & Secure Payments",
];

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div aria-hidden className="absolute inset-0 bg-sunset-radial" />
			<div aria-hidden className="absolute inset-0 bg-dot-grid opacity-40 mix-blend-soft-light" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
					{/* Left column */}
					<div className="lg:col-span-6 xl:col-span-5">
						<div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[--ink] ring-1 ring-white/60">
							<span className="h-1.5 w-1.5 rounded-full bg-[--ember]" />
							New Season · 2026
						</div>
						<h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight text-[--ink]">
							The Best Online Store for <span className="italic text-[--ember]">Modern</span> Living
						</h1>
						<p className="mt-5 max-w-md text-base sm:text-lg text-[--ink]/70 leading-relaxed">
							Hand-picked essentials and editorial-grade pieces. Discover curated drops, premium fabrics, and
							the kind of quality that lasts past the season.
						</p>

						<div className="mt-8 flex flex-wrap items-center gap-3">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[--ember] text-white text-sm font-medium shadow-[0_10px_30px_-12px_rgba(255,87,34,0.7)] hover:bg-[--ink] transition-colors"
							>
								Explore More
								<span className="grid place-items-center h-6 w-6 rounded-full bg-white text-[--ember]">
									<ArrowRight className="h-3.5 w-3.5" />
								</span>
							</YnsLink>
							<button
								type="button"
								className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[--ink] text-white hover:bg-[--ember] transition-colors"
								aria-label="Watch story"
							>
								<Play className="h-4 w-4 fill-current" />
							</button>
						</div>

						<div className="mt-10">
							<p className="font-display text-lg font-semibold text-[--ink]">What Makes Us Pro?</p>
							<ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-md">
								{features.map((feature) => (
									<li key={feature} className="flex items-center gap-2.5 text-sm text-[--ink]/80">
										<span className="grid place-items-center h-5 w-5 rounded-full bg-[--ember] text-white">
											<Check className="h-3 w-3" strokeWidth={3} />
										</span>
										{feature}
									</li>
								))}
							</ul>
						</div>

						<div className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/85 backdrop-blur pl-1.5 pr-5 py-1.5 ring-1 ring-white/70 shadow-sm">
							<span className="grid place-items-center h-8 w-8 rounded-full bg-[--ember] text-white">
								<Camera className="h-4 w-4" />
							</span>
							<span className="text-sm font-medium text-[--ink]">Watch Our Story</span>
						</div>
					</div>

					{/* Right column — overlapping tilted images + 50% off badge */}
					<div className="relative lg:col-span-6 xl:col-span-7 min-h-[420px] sm:min-h-[520px]">
						{/* CTA chip top-right */}
						<div className="absolute right-0 top-0 z-30 hidden sm:flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 ring-1 ring-white/70 text-xs sm:text-sm font-medium text-[--ink] shadow-sm">
							Get 100+ Spirit of Modern Style
							<ArrowRight className="h-3.5 w-3.5 text-[--ember]" />
						</div>

						{/* Big tilted card */}
						<div className="absolute left-0 top-6 sm:top-10 w-[58%] sm:w-[55%] aspect-[3/4] rounded-[28px] bg-[#0e8b7c] rotate-[-6deg] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)] overflow-hidden ring-1 ring-[--ink]/10">
							<Image
								src="/scraped-0.jpg"
								alt="Featured editorial look"
								fill
								priority
								sizes="(max-width: 768px) 60vw, 35vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10" />
							<div className="absolute left-4 bottom-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[--ink]">
								Edition 01
							</div>
						</div>

						{/* Smaller tilted card */}
						<div className="absolute right-0 sm:right-2 top-32 sm:top-44 w-[48%] sm:w-[42%] aspect-[3/4] rounded-[24px] bg-[--ink] rotate-[7deg] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)] overflow-hidden ring-1 ring-white/10">
							<Image
								src="/scraped-1.jpg"
								alt="Featured product"
								fill
								sizes="(max-width: 768px) 50vw, 30vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/30" />
						</div>

						{/* 50% OFF badge */}
						<div className="absolute right-2 sm:right-10 top-24 sm:top-32 z-20 rotate-[-12deg]">
							<div className="relative">
								<div className="bg-[--ink] text-white px-4 py-1.5 rounded-md font-display font-bold text-sm sm:text-base shadow-lg">
									50% OFF
								</div>
								<svg
									aria-hidden
									className="absolute -right-3 -top-2 h-5 w-5 text-[--ember]"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
								</svg>
							</div>
						</div>

						{/* Floating tag bottom */}
						<div className="absolute left-2 sm:left-8 bottom-0 z-10 hidden sm:flex items-center gap-2 rounded-2xl bg-white/85 backdrop-blur px-3 py-2 ring-1 ring-white/70 shadow-sm">
							<span className="h-2 w-2 rounded-full bg-[--teal]" />
							<span className="text-xs font-medium text-[--ink]/80">Studio crafted · Limited stock</span>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom curve into the next section */}
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-0 h-10 bg-background"
				style={{
					maskImage: "radial-gradient(ellipse 60% 100% at 50% 100%, transparent 60%, black 61%)",
					WebkitMaskImage: "radial-gradient(ellipse 60% 100% at 50% 100%, transparent 60%, black 61%)",
				}}
			/>
		</section>
	);
}
