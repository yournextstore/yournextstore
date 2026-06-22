import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden">
			{/* Full-bleed image */}
			<div className="absolute inset-0">
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
				{/* Soft satin warmth on top */}
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-satin mix-blend-soft-light opacity-90 pointer-events-none"
				/>
				{/* Left-side text legibility wash */}
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/15 to-transparent pointer-events-none"
				/>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex items-center">
					<div className="max-w-xl py-20 sm:py-24">
						<span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/70 px-4 py-1.5 text-[11px] tracking-[0.22em] uppercase text-foreground/75 backdrop-blur-sm">
							<span className="h-1.5 w-1.5 rounded-full bg-magenta" />
							Save 30% off Grippy YNS™
						</span>

						<h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.02] text-balance">
							New Year,
							<br />
							<span className="italic">New YNS</span>™
						</h1>

						<p className="mt-6 max-w-md text-base sm:text-[17px] leading-relaxed text-foreground/75">
							Start the year strong with{" "}
							<span className="font-semibold text-foreground">30% off Grippy YNS™</span>— your go-to
							second-skin essentials for workouts, swim, and everything in between.
						</p>

						<div className="mt-8 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-magenta text-white text-[12px] tracking-[0.18em] uppercase font-semibold shadow-[0_10px_30px_-12px_rgba(232,51,110,0.55)] hover:bg-magenta-deep transition-colors"
							>
								Shop Grippy YNS™
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white/80 text-foreground text-[12px] tracking-[0.18em] uppercase font-semibold border border-foreground/10 backdrop-blur-sm hover:bg-white transition-colors"
							>
								Explore the Edit
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* Soft fade into the press strip below */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none"
			/>
		</section>
	);
}
