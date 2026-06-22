import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-[var(--yns-red)]">
			<div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] w-full min-h-[520px] sm:min-h-[640px] yns-grain">
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center mix-blend-multiply"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-b from-[var(--yns-red)]/30 via-transparent to-[var(--yns-red)]/45"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-r from-[var(--yns-red)]/35 via-transparent to-[var(--yns-red)]/35"
				/>

				<div className="absolute top-6 sm:top-10 left-0 right-0 z-10">
					<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-white/85 text-[10px] tracking-[0.25em] uppercase">
						<span>vol. 01 · the red issue</span>
						<span className="hidden sm:inline">sleep is a political act</span>
						<span>est. 2026</span>
					</div>
				</div>

				<div className="absolute inset-x-0 bottom-0 z-10 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 lg:pb-20">
					<div className="max-w-[1600px] mx-auto flex flex-col items-center text-center text-white">
						<span className="yns-keep-case text-[10px] sm:text-xs tracking-[0.35em] uppercase opacity-80 mb-4">
							a wellness label for the chronically awake
						</span>
						<h1 className="font-[family-name:var(--font-display)] italic text-[14vw] sm:text-[10vw] lg:text-[8.5rem] xl:text-[10rem] leading-[0.85] tracking-tight max-w-5xl">
							sleep, or
							<br />
							<span className="not-italic font-[family-name:var(--font-display)] text-white/95">
								die trying
							</span>
						</h1>
						<p className="mt-6 max-w-md text-sm sm:text-base text-white/85 leading-relaxed">
							dissolvable melatonin strips, ritual perfume, and tools for the cult of rest. delivered
							overnight, obviously.
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-11 px-7 bg-white text-[var(--yns-ink)] text-xs tracking-[0.2em] uppercase hover:bg-[var(--yns-cream)] transition-colors"
							>
								shop the drop
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center justify-center h-11 px-7 border border-white/60 text-white text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
							>
								read the manifesto
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
