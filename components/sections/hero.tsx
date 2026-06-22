import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative bg-background overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 sm:pt-12 sm:pb-8">
				<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
					{/* Left column — headline */}
					<div className="lg:col-span-7 relative z-10">
						<div className="inline-flex items-center gap-2 rounded-full border-2 border-yns-cocoa/15 bg-white px-3 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-yns-green">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-yns-green" />
							Small-batch · Bean to bar
						</div>
						<h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[0.95] tracking-tight text-yns-cocoa italic">
							Snack
							<span className="inline-block ml-2 text-yns-green -rotate-2">happy.</span>
							<br />
							<span className="text-yns-blue">Live</span>{" "}
							<span className="relative inline-block">
								<span className="relative z-10">curious.</span>
								<span
									aria-hidden="true"
									className="absolute -bottom-1 left-0 right-0 h-3 bg-yns-yellow -z-0"
								/>
							</span>
						</h1>
						<p className="mt-5 max-w-md text-base sm:text-lg text-yns-cocoa/75 leading-relaxed">
							Hand-crafted chocolate, made the slow way — single-origin cocoa, tropical fruits, and recipes
							that taste like an afternoon off.
						</p>
						<div className="mt-7 flex flex-wrap gap-3">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-yns-green text-white text-sm font-extrabold uppercase tracking-wider rounded-sm shadow-[4px_4px_0_0_rgba(59,36,24,0.85)] hover:bg-yns-green-dark hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(59,36,24,0.85)] transition-all"
							>
								Shop the bars
								<ArrowRight className="h-4 w-4" strokeWidth={3} />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center justify-center h-12 px-6 border-2 border-yns-cocoa/20 bg-transparent text-yns-cocoa text-sm font-extrabold uppercase tracking-wider rounded-sm hover:border-yns-cocoa transition-colors"
							>
								Our story
							</YnsLink>
						</div>

						{/* Tag strip */}
						<div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-yns-cocoa/70">
							<span className="flex items-center gap-1.5">
								<span className="inline-block h-1.5 w-1.5 rounded-full bg-yns-green" /> Fair-trade cocoa
							</span>
							<span className="flex items-center gap-1.5">
								<span className="inline-block h-1.5 w-1.5 rounded-full bg-yns-blue" /> Plastic-free
							</span>
							<span className="flex items-center gap-1.5">
								<span className="inline-block h-1.5 w-1.5 rounded-full bg-yns-yellow" /> Made in Brooklyn
							</span>
						</div>
					</div>

					{/* Right column — playful card stack */}
					<div className="lg:col-span-5 relative h-[280px] sm:h-[340px] lg:h-[420px]">
						<div className="absolute top-2 right-12 h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-yns-yellow" />
						<div className="absolute bottom-6 left-2 h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-yns-blue" />
						<div className="absolute inset-x-6 sm:inset-x-10 top-6 sm:top-10 bottom-6 sm:bottom-10 rounded-md bg-white border-2 border-yns-cocoa/15 rotate-3 shadow-[8px_8px_0_0_rgba(15,138,59,0.25)] overflow-hidden">
							<Image
								src="/scraped-0.jpg"
								alt="Featured product"
								fill
								sizes="(max-width: 1024px) 80vw, 40vw"
								className="object-cover"
								priority
							/>
						</div>
						<div className="absolute -bottom-2 right-2 sm:right-4 px-3 py-1.5 bg-yns-green text-white text-[11px] font-extrabold uppercase tracking-widest rounded-sm rotate-[-4deg] shadow-md">
							New batch
						</div>
					</div>
				</div>
			</div>

			{/* color stripe */}
			<div className="flex h-1 w-full">
				<div className="flex-1 bg-yns-green" />
				<div className="flex-1 bg-yns-blue" />
				<div className="flex-1 bg-yns-yellow" />
				<div className="flex-1 bg-yns-cocoa" />
			</div>
		</section>
	);
}
