import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-black px-2 pt-2 sm:px-4 sm:pt-4">
			<div className="relative h-[78vh] min-h-[560px] w-full overflow-hidden rounded-2xl sm:rounded-3xl">
				{/* Backdrop image (full-bleed cinematic) */}
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover scale-[1.02]"
				/>

				{/* Gradient overlays for legibility */}
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,transparent_0%,rgba(0,0,0,0.55)_75%,rgba(0,0,0,0.85)_100%)]"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
				/>

				{/* Top-left badge */}
				<div className="absolute left-5 top-5 sm:left-8 sm:top-8 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
					<span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--yns-lime)] shadow-[0_0_12px_var(--yns-lime)]" />
					New · Field Collection 04
				</div>

				{/* Headline + CTA */}
				<div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
					<h1 className="font-display max-w-[18ch] text-[clamp(2.5rem,7.2vw,6rem)] leading-[0.95] text-white">
						The world&apos;s first <span className="italic font-extralight text-white/95">trail-ready</span>{" "}
						soda system
					</h1>
					<p className="mt-6 max-w-xl text-base sm:text-lg text-white/70">
						Use our award-winning device on the Your Next Store bottle, or bring your own Hydro Flask®.
					</p>
					<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="group inline-flex h-12 items-center gap-3 rounded-full bg-[var(--yns-lime)] pl-6 pr-2 text-[14px] font-semibold text-black transition-all hover:bg-white"
						>
							Shop Systems
							<span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition-transform group-hover:translate-x-0.5">
								<ArrowRightIcon className="h-4 w-4" />
							</span>
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#how-it-works"
							className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-[14px] font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-white/10"
						>
							How it works
						</YnsLink>
					</div>
				</div>

				{/* Bottom strip — quick proof points */}
				<div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-white/10 bg-black/30 backdrop-blur-md sm:block">
					<div className="mx-auto grid max-w-[1400px] grid-cols-4 divide-x divide-white/10 text-white/80">
						{[
							{ k: "Award", v: "Outside Gear · 2025" },
							{ k: "Pressure", v: "4.2 bar trail-tested" },
							{ k: "Refills", v: "60+ per capsule" },
							{ k: "Warranty", v: "Lifetime cap" },
						].map((item) => (
							<div key={item.k} className="flex flex-col gap-1 px-6 py-4">
								<span className="text-[10px] uppercase tracking-[0.22em] text-white/45">{item.k}</span>
								<span className="text-sm font-medium text-white">{item.v}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
