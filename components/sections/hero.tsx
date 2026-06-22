import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-pastel-wash">
			{/* Soft decorative ellipses */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full bg-[#f5f1ea] opacity-40 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-white opacity-30 blur-3xl"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 py-16 sm:py-20 lg:py-28 items-center">
					{/* Left text block */}
					<div className="lg:col-span-6 yns-fade-up">
						<div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-3.5 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#1f2933]/80 ring-1 ring-[#1f2933]/10">
							<span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
							New Spring Collection · 2026
						</div>
						<h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl text-[#1f2933] leading-[1.02] tracking-[-0.02em]">
							Elevate Your Space
							<span className="block italic font-light text-[#1f2933]/85">with Our Furniture</span>
						</h1>
						<p className="mt-7 max-w-md text-base sm:text-lg text-[#1f2933]/70 leading-relaxed">
							Heirloom pieces handcrafted from solid oak, boucle and cane — quietly designed to live with you
							for decades, not seasons.
						</p>
						<div className="mt-9 flex flex-wrap items-center gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="group inline-flex items-center gap-2 h-12 px-7 bg-[#1f2933] text-[#f5f1ea] rounded-full text-sm font-medium hover:bg-[#0e151c] transition-colors"
							>
								Shop Collection
								<ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#story"
								className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-[#1f2933]/15 bg-white/40 backdrop-blur text-[#1f2933] text-sm font-medium hover:bg-white/70 transition-colors"
							>
								Our Story
							</YnsLink>
						</div>

						{/* Stat row */}
						<div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
							{[
								{ k: "12yr", v: "Craft warranty" },
								{ k: "FSC", v: "Sourced timber" },
								{ k: "120+", v: "Studio makers" },
							].map((s) => (
								<div key={s.k} className="border-t border-[#1f2933]/15 pt-3">
									<div className="font-display text-2xl text-[#1f2933]">{s.k}</div>
									<div className="mt-0.5 text-xs uppercase tracking-[0.16em] text-[#1f2933]/55">{s.v}</div>
								</div>
							))}
						</div>
					</div>

					{/* Right collage */}
					<div className="lg:col-span-6 relative h-[440px] sm:h-[540px] lg:h-[600px]">
						<div className="absolute right-0 top-0 w-[64%] h-[58%] rounded-[28px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(31,41,51,0.35)] ring-1 ring-white/40">
							<Image
								src="/scraped-0.jpg"
								alt="Sculptural oak armchair"
								fill
								sizes="(max-width: 1024px) 60vw, 35vw"
								className="object-cover"
								priority
							/>
						</div>
						<div className="absolute left-0 top-[18%] w-[44%] h-[44%] rounded-[28px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(31,41,51,0.4)] ring-1 ring-white/40">
							<Image
								src="/scraped-1.jpg"
								alt="Mid-century dining chair detail"
								fill
								sizes="(max-width: 1024px) 45vw, 26vw"
								className="object-cover"
							/>
						</div>
						<div className="absolute right-[6%] bottom-0 w-[58%] h-[42%] rounded-[28px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(31,41,51,0.35)] ring-1 ring-white/40">
							<Image
								src="/scraped-2.jpg"
								alt="Living room vignette"
								fill
								sizes="(max-width: 1024px) 60vw, 32vw"
								className="object-cover"
							/>
						</div>
						{/* Tag badge */}
						<div className="absolute left-2 bottom-6 sm:left-4 rounded-full bg-white/85 backdrop-blur px-4 py-2.5 text-xs font-medium text-[#1f2933] ring-1 ring-[#1f2933]/10 shadow-md">
							<span className="text-[#e89b3c]">✦</span> Boucle Lounger
							<span className="ml-2 text-[#1f2933]/50">$1,240</span>
						</div>
					</div>
				</div>

				{/* Marquee strip */}
				<div className="border-t border-[#1f2933]/10 py-5 flex flex-wrap items-center justify-between gap-x-10 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-[#1f2933]/55">
					<span>Featured in Dwell</span>
					<span>Architectural Digest</span>
					<span className="hidden sm:inline">Kinfolk</span>
					<span>Wallpaper*</span>
					<span className="hidden sm:inline">Apartamento</span>
				</div>
			</div>
		</section>
	);
}
