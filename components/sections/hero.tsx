import { Volume2 } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section
			className="relative w-full h-[100svh] min-h-[640px] overflow-hidden bg-ink text-parchment"
			style={{ backgroundColor: "#0e0d0b" }}
		>
			<Image
				src="/scraped-0.jpg"
				alt="At dawn, a man's silhouette against a mountain horizon"
				fill
				priority
				sizes="100vw"
				className="object-cover object-[60%_center] scale-[1.02]"
			/>
			<div className="absolute inset-0 hero-sunburst pointer-events-none mix-blend-screen opacity-90" />
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"linear-gradient(180deg, rgba(14,13,11,0.55) 0%, rgba(14,13,11,0.1) 18%, rgba(14,13,11,0.05) 55%, rgba(14,13,11,0.65) 92%, rgba(14,13,11,0.9) 100%)",
				}}
			/>
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"linear-gradient(90deg, rgba(14,13,11,0.55) 0%, rgba(14,13,11,0.15) 28%, transparent 55%, transparent 100%)",
				}}
			/>

			{/* Scroll arc indicator */}
			<div className="absolute top-24 right-6 sm:top-28 sm:right-10 flex flex-col items-end gap-2 pointer-events-none select-none">
				<div className="scroll-arc" aria-hidden />
				<span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/55">Scroll</span>
			</div>

			{/* Frame markers */}
			<div className="absolute top-24 left-6 sm:top-28 sm:left-10 font-mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/55 pointer-events-none">
				<div>FILM 001 / 24FPS</div>
				<div className="mt-1 text-parchment/35">From the field journal</div>
			</div>

			{/* Hero overlay text bottom-left */}
			<div className="absolute inset-x-0 bottom-0 z-10">
				<div className="px-5 sm:px-10 pb-12 sm:pb-16 lg:pb-20 max-w-3xl">
					<div className="space-y-5">
						<div className="flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-parchment/70">
							<span className="inline-block w-6 h-px bg-parchment/60" />
							<span>Episode 01 — Microalgae</span>
						</div>
						<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-[0.04em] text-parchment uppercase">
							From sea to cell<span className="text-sand">™</span>
						</h1>
						<div className="space-y-3 font-mono text-[0.78rem] sm:text-[0.82rem] leading-relaxed text-parchment/85 max-w-xl tracking-wide">
							<p>
								Microalgae has thrived for 2.5 billion years, evolving adaptive
								<br className="hidden sm:inline" /> functions that directly support human skin.
							</p>
							<p>
								We use these biologically intelligent actives in our formulas, each one
								<br className="hidden sm:inline" /> built specifically for men&apos;s skin and its unique
								biology.
							</p>
						</div>
						<div className="pt-2">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex h-11 items-center justify-center px-10 border border-parchment/80 text-parchment font-mono text-[0.7rem] tracking-[0.32em] uppercase hover:bg-parchment hover:text-ink transition-colors"
							>
								Shop Now
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* Audio mute toggle */}
			<button
				type="button"
				aria-label="Toggle audio"
				className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-20 p-2 text-parchment/70 hover:text-parchment"
			>
				<Volume2 className="w-4 h-4" strokeWidth={1.25} />
			</button>

			{/* Bottom-center caption */}
			<div className="hidden sm:block absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.55rem] tracking-[0.4em] uppercase text-parchment/40">
				Your Next Store — chapter i
			</div>
		</section>
	);
}
