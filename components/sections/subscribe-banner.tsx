import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function SubscribeBanner() {
	return (
		<section className="bg-[#fdf6ee]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-25px_rgba(26,26,46,0.35)]">
					{/* Left peach */}
					<div className="relative bg-[#f2c9a6] p-10 sm:p-14 flex items-center min-h-[340px]">
						<div className="absolute inset-0 scent-grain opacity-50" aria-hidden="true" />
						<div className="absolute top-6 right-6 rotate-12 bg-[#1a1a2e] text-[#fdf6ee] text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full">
							Save 15%
						</div>
						<div className="relative">
							<p className="font-script text-2xl text-[#4d4bc4]">subscribe &amp; save</p>
							<h2 className="mt-2 font-display text-4xl sm:text-5xl text-[#1a1a2e] leading-tight">
								Never Run Out of the Good Stuff
							</h2>
							<p className="mt-4 text-[#1a1a2e]/75 max-w-md leading-relaxed">
								Pick your favorite scents, choose your cadence, save 15% on every shipment. Pause, swap or
								cancel anytime.
							</p>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="mt-7 inline-flex items-center gap-2 h-12 px-7 bg-[#1a1a2e] text-[#fdf6ee] rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-[#4d4bc4] transition-colors"
							>
								Start a routine
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
						</div>
					</div>
					{/* Right indigo with floating soap */}
					<div className="relative bg-hero-indigo min-h-[340px] overflow-hidden">
						<div className="absolute inset-0 scent-grain opacity-30" aria-hidden="true" />
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80">
							<div className="absolute inset-0 rounded-full bg-[#fdf6ee]/10 backdrop-blur-md" />
							<Image
								src="/scraped-4.jpg"
								alt="Subscribe and save"
								fill
								sizes="320px"
								className="object-contain p-6"
							/>
						</div>
						<div className="absolute bottom-6 left-6 text-[#fdf6ee]/60 text-xs tracking-[0.3em] uppercase">
							01 / 04
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
