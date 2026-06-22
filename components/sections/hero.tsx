import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
				{/* Peach product side */}
				<div className="relative bg-hero-peach order-2 lg:order-1 overflow-hidden">
					<div className="absolute inset-0 scent-grain opacity-40" aria-hidden="true" />
					<div
						className="absolute -top-20 -left-16 w-80 h-80 rounded-full blur-3xl opacity-50"
						style={{ background: "#f5d3b0" }}
						aria-hidden="true"
					/>
					<div
						className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full blur-3xl opacity-40"
						style={{ background: "#e8a47a" }}
						aria-hidden="true"
					/>
					<div className="relative h-full flex items-end justify-center p-6 sm:p-12">
						<div className="relative w-full max-w-md aspect-[4/5]">
							<Image
								src="/scraped-0.jpg"
								alt="Hero product still life"
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(26,26,46,0.25)]"
							/>
						</div>
					</div>
					{/* Floating "new" badge */}
					<div className="absolute top-8 left-8 hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-full bg-[#1a1a2e] text-[#fdf6ee] rotate-[-12deg] shadow-xl">
						<span className="font-script text-2xl leading-none">new</span>
						<span className="text-[9px] uppercase tracking-[0.25em] mt-1">drop</span>
					</div>
				</div>

				{/* Indigo copy side */}
				<div className="relative bg-hero-indigo order-1 lg:order-2 text-[#fdf6ee] flex items-center">
					<div className="absolute inset-0 scent-grain opacity-30" aria-hidden="true" />
					<svg
						className="absolute top-10 right-10 w-32 h-32 opacity-20"
						viewBox="0 0 100 100"
						fill="none"
						aria-hidden="true"
					>
						<circle cx="50" cy="50" r="40" stroke="#fdf6ee" strokeWidth="1" />
						<circle cx="50" cy="50" r="20" stroke="#fdf6ee" strokeWidth="1" />
						<circle cx="50" cy="50" r="6" fill="#fdf6ee" />
					</svg>
					<div className="relative px-8 sm:px-12 lg:px-16 py-16 lg:py-0 max-w-xl">
						<p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#f2c9a6]">
							Nature&apos;s Never Smelled This Good
						</p>
						<h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-[#fdf6ee]">
							Scents You&apos;ll Be Obsessed With
						</h1>
						<p className="mt-5 text-base sm:text-lg text-[#fdf6ee]/80 leading-relaxed">
							Bold. Iconic. Full-Volume.
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-[#fdf6ee] text-[#1a1a2e] rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-[#fdf6ee]/90 transition-all hover:scale-[1.02]"
							>
								Smell Amazing, Naturally
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 border border-[#fdf6ee]/40 text-[#fdf6ee] rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-white/10 transition-colors"
							>
								Shop All
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
