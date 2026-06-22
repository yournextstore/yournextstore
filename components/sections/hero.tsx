import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-ink text-bone">
			<div className="relative h-[78vh] min-h-[560px] max-h-[820px] w-full">
				<Image
					src="/scraped-0.jpg"
					alt="Designed for the urban everyday"
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,29,32,0.45)_0%,rgba(27,29,32,0.2)_35%,rgba(27,29,32,0.55)_100%)]" />
				<div className="absolute inset-0 bg-grain opacity-40 mix-blend-overlay" />

				<div className="relative z-10 h-full w-full">
					<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-bone/80 mb-6">
							<span className="block w-6 h-px bg-brick" />A new edit · Spring 26
							<span className="block w-6 h-px bg-brick" />
						</span>
						<h1 className="font-display-wide text-[clamp(2.6rem,8.5vw,7rem)] leading-[0.92] tracking-[-0.01em] uppercase text-white text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
							Built for the
							<br />
							urban everyday
						</h1>
						<p className="mt-7 max-w-xl text-sm sm:text-base text-bone/85 leading-relaxed">
							A small, opinionated catalog for people who actually use their stuff. Wheels on the pavement,
							hands full of groceries, eyes on the next thing.
						</p>
						<div className="mt-10 flex items-center gap-3">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex h-12 items-center justify-center gap-2 bg-white text-ink px-9 text-[12px] font-semibold tracking-[0.28em] uppercase hover:bg-bone transition-colors"
							>
								Let&apos;s roll
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="hidden sm:inline-flex h-12 items-center justify-center gap-2 border border-white/40 text-white px-7 text-[12px] font-medium tracking-[0.28em] uppercase hover:bg-white/10 transition-colors"
							>
								Our story
							</YnsLink>
						</div>
					</div>
				</div>

				<div className="absolute bottom-5 left-4 sm:left-6 right-4 sm:right-6 z-10 flex items-end justify-between text-[10px] tracking-[0.3em] uppercase text-bone/70">
					<span className="flex items-center gap-2">
						<span className="block h-px w-8 bg-bone/50" />
						01 / Street · East Village
					</span>
					<span className="hidden sm:inline">Scroll ↓</span>
					<span className="hidden md:inline">f. 2024</span>
				</div>
			</div>

			{/* ticker below the hero */}
			<div className="relative bg-ink border-t border-bone/10 py-3 overflow-hidden">
				<div className="marquee flex w-max gap-12 whitespace-nowrap text-[11px] tracking-[0.3em] uppercase text-bone/75">
					{Array.from({ length: 2 }).map((_, copyIdx) => (
						<div key={`marquee-copy-${copyIdx}`} className="flex items-center gap-12">
							<span>Built to roll</span>
							<span className="text-brick">●</span>
							<span>Carries 50L of life</span>
							<span className="text-brick">●</span>
							<span>All-terrain, all-week</span>
							<span className="text-brick">●</span>
							<span>Folds flat. Stands tall.</span>
							<span className="text-brick">●</span>
							<span>Ships in 48h</span>
							<span className="text-brick">●</span>
							<span>Made for the everyday</span>
							<span className="text-brick">●</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
