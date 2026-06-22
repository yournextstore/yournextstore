import Image from "next/image";
import { YnsLink } from "../yns-link";

function MartiniIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<path d="M3 4 L21 4 L12 14 Z" strokeLinejoin="round" />
			<path d="M12 14 V21" strokeLinecap="round" />
			<path d="M8 21 H16" strokeLinecap="round" />
			<circle cx="17" cy="6.5" r="1.1" fill="currentColor" />
		</svg>
	);
}

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[color:var(--cream)]">
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
				{/* LEFT: solid dusty blue panel */}
				<div className="relative bg-[color:var(--dusty-blue)] text-[color:var(--cream)] flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-12 lg:py-16">
					<div>
						<p className="font-display text-lg sm:text-xl tracking-[0.04em] text-[color:var(--cream)] leading-tight max-w-md">
							For the ones
							<br />
							who want it all.
						</p>
					</div>

					<div className="relative mt-12 lg:mt-0">
						<h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] text-[color:var(--cream)] max-w-[12ch]">
							A cocktail
							<br />
							that finally
							<br />
							gets it.
						</h1>
						{/* Martini decoration */}
						<MartiniIcon className="hidden sm:block absolute -right-2 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 text-[color:var(--cream)]" />

						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center gap-2 px-6 py-3 border border-[color:var(--cream)] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--cream)] hover:bg-[color:var(--cream)] hover:text-[color:var(--dusty-blue)] transition-colors rounded-full"
							>
								Find Your Next Store near you
							</YnsLink>
						</div>
					</div>

					{/* corner accent */}
					<div
						aria-hidden="true"
						className="absolute top-0 left-0 w-28 h-28 border-t-2 border-l-2 border-[color:var(--cream)]/15"
					/>
				</div>

				{/* RIGHT: lifestyle photograph */}
				<div className="relative film-grain overflow-hidden bg-[color:var(--brown-warm)] min-h-[360px] lg:min-h-0">
					<Image
						src="/scraped-3.jpg"
						alt="Friends celebrating with drinks"
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					{/* warm filmic vignette */}
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-tr from-[#3d1f12]/30 via-transparent to-[#5077a0]/10 mix-blend-multiply"
					/>
				</div>
			</div>
		</section>
	);
}
