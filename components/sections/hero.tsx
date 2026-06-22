import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-studio">
			{/* Subtle grid overlay */}
			<div aria-hidden="true" className="absolute inset-0 bg-grid opacity-50 mix-blend-multiply" />

			{/* Cinematic backdrop image — covers the bottom 80% so the headline floats above */}
			<div className="absolute inset-x-0 bottom-0 top-[16%] z-0">
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center mix-blend-luminosity opacity-95"
				/>
				{/* Top fade to blend with studio sky */}
				<div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#f2f3f5] via-[#f2f3f5]/40 to-transparent" />
				{/* Floor vignette */}
				<div className="absolute inset-0 bg-floor" />
				{/* Side light wash */}
				<div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#e3e5e8]/70 to-transparent" />
			</div>

			{/* Foreground content */}
			<div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				<div className="flex min-h-[88vh] flex-col justify-between pt-10 pb-10 sm:pt-14 sm:pb-14">
					{/* Top — oversized wordmark */}
					<div>
						<h1 className="display-headline text-[clamp(3rem,12vw,11rem)] text-[#1a1c1f] text-balance">
							<span className="block">Your Next</span>
							<span className="block">Store</span>
						</h1>
					</div>

					{/* Bottom-right CTA pill */}
					<div className="flex items-end justify-between gap-6">
						<div className="hidden sm:flex flex-col gap-2 max-w-[18rem]">
							<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#3d4146]">
								Edition 01 · 2026
							</span>
							<p className="text-[13px] leading-relaxed text-[#3d4146]">
								Built ground-up. Designed without compromise. A new chassis for everything you carry.
							</p>
						</div>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="group inline-flex items-center gap-3 rounded-full border border-[#3d4146]/30 bg-white/70 backdrop-blur-sm px-5 py-3 text-[13px] font-medium text-[#1a1c1f] shadow-sm transition-all hover:bg-white hover:border-[#3d4146]/60"
						>
							<span className="relative flex size-2">
								<span className="absolute inset-0 rounded-full bg-[#22c55e] signal-dot" />
								<span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
							</span>
							Meet the Collection
							<ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
