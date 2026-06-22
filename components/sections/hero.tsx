import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-burgundy-deep">
			<div className="relative h-[78vh] min-h-[560px] max-h-[820px] w-full">
				<Image
					src="/scraped-0.jpg"
					alt="A figure resting on cream linen sheets at dusk"
					fill
					priority
					sizes="100vw"
					className="object-cover object-center scale-105"
				/>
				{/* Deep cinematic gradient for legibility */}
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_60%,oklch(0.16_0.05_20/0.55),transparent_70%)]"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-linear-to-t from-[oklch(0.18_0.05_15/0.55)] via-[oklch(0.18_0.05_15/0.1)] to-[oklch(0.18_0.05_15/0.4)]"
				/>
				<div className="bg-grain absolute inset-0" />

				{/* Overlay content */}
				<div className="relative z-10 flex h-full items-center justify-center">
					<div className="max-w-3xl px-6 text-center text-cream">
						<p className="mb-5 text-[11px] tracking-[0.32em] uppercase text-cream/85 italic font-serif">
							— Backed by Science —
						</p>
						<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-medium text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
							The nightly ritual for the sleep&nbsp;you&apos;ve been missing.
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-cream/85">
							Deep Sleep Solution is a melatonin-free nighttime drink powered by magnesium, adaptogens, and
							amino acids to support deep, restorative rest and brighter mornings.
						</p>
						<div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-10 rounded-full bg-primary text-primary-foreground text-[11px] tracking-[0.28em] font-semibold uppercase hover:bg-burgundy-deep transition-colors shadow-[0_10px_40px_-12px_oklch(0.16_0.05_20/0.7)]"
							>
								Shop Now
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#story"
								className="text-[11px] tracking-[0.28em] uppercase text-cream/80 hover:text-cream transition-colors px-4 py-3"
							>
								Read our story
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
