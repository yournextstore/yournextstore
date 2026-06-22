import { ArrowRight } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-stone-hero">
			{/* Subtle grain overlay */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
				style={{
					backgroundImage:
						"radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)",
					backgroundSize: "3px 3px, 5px 5px",
					backgroundPosition: "0 0, 1px 2px",
				}}
			/>
			{/* Vignette */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					background: "radial-gradient(ellipse at 70% 50%, transparent 0%, rgba(26,26,26,0.18) 100%)",
				}}
			/>

			<div className="relative mx-auto flex min-h-[640px] max-w-[1400px] flex-col justify-center px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40">
				<div className="max-w-3xl">
					<h1 className="font-wordmark text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.92] uppercase text-[var(--brand-cream)]">
						<span className="block">Real Flavor</span>
						<span className="block">Without The</span>
						<span className="block">Nonsense</span>
					</h1>

					<p className="mt-8 max-w-xs font-mono-ed text-[12px] leading-relaxed text-[var(--brand-cream)]/85">
						Clean, convenient
						<br />
						sauces that make every
						<br />
						meal craveable
					</p>

					<div className="mt-10">
						<YnsLink
							href="#products"
							prefetch={"eager"}
							className="group inline-flex items-center gap-3 border border-[var(--brand-cream)]/90 bg-[var(--brand-cream)] px-7 py-3.5 font-mono-ed text-[11px] uppercase tracking-[0.18em] text-[var(--brand-ember)] transition-colors hover:bg-[var(--brand-cream)]/90"
						>
							Pre-Order Now
							<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
						</YnsLink>
					</div>
				</div>

				{/* Floating mono-typewriter caption bottom right */}
				<div className="mt-16 flex items-end justify-end gap-12 self-end font-mono-ed text-[10px] uppercase tracking-[0.2em] text-[var(--brand-cream)]/70 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0">
					<span>EST. 2024</span>
					<span className="hidden sm:inline">Made in small batches</span>
					<span>Vol. 01 / 01</span>
				</div>
			</div>
		</section>
	);
}
