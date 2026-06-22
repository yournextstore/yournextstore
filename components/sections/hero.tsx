import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden yns-hero-sky">
			<div className="absolute inset-0 yns-hero-clouds pointer-events-none" aria-hidden="true" />

			{/* SVG drifting clouds */}
			<svg
				aria-hidden="true"
				className="absolute inset-x-0 bottom-0 w-full pointer-events-none"
				viewBox="0 0 1440 120"
				preserveAspectRatio="none"
			>
				<path
					d="M0,80 C240,40 480,110 720,70 C960,30 1200,100 1440,60 L1440,120 L0,120 Z"
					fill="rgba(255,255,255,0.4)"
				/>
				<path
					d="M0,100 C200,80 460,120 720,90 C980,60 1200,110 1440,90 L1440,120 L0,120 Z"
					fill="rgba(255,255,255,0.6)"
				/>
			</svg>

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[640px] lg:min-h-[720px] py-16 lg:py-24">
					{/* Left: headline */}
					<div className="relative z-10 max-w-xl">
						<h1 className="font-display text-white text-[64px] sm:text-[88px] lg:text-[112px] leading-[0.88] tracking-tight uppercase drop-shadow-[0_2px_30px_rgba(0,0,0,0.15)]">
							Silky Hair
							<br />
							In Seconds
						</h1>
						<p className="mt-6 text-lg sm:text-xl text-white/95 max-w-md font-medium tracking-wide">
							Fight Frizz. Hydrate Ends. Add Silky Softness.
						</p>
						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="yns-btn-red inline-flex items-center justify-center h-14 px-8 text-[13px] font-extrabold tracking-[0.18em] uppercase"
							>
								Shop Silk Revival Spray
							</YnsLink>
						</div>
					</div>

					{/* Right: model image (decorative scraped image) */}
					<div className="relative h-[420px] sm:h-[520px] lg:h-[680px] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[55%]">
						<Image
							src="/scraped-0.jpg"
							alt=""
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 55vw"
							className="object-cover object-center"
						/>
						<div
							className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#a9d3e6] to-transparent pointer-events-none"
							aria-hidden="true"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
