import Image from "next/image";

export function Manifesto() {
	return (
		<section
			id="about"
			className="relative bg-[color:var(--color-yns-ink)] text-[color:var(--color-yns-cream)] overflow-hidden"
		>
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
				<div className="relative min-h-[360px] lg:min-h-[640px]">
					<Image
						src="/scraped-3.jpg"
						alt="Backgammon case standing on a pine workbench"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-r from-transparent to-[color:var(--color-yns-ink)]/40 pointer-events-none"
					/>
				</div>
				<div className="flex items-center px-4 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-28">
					<div className="max-w-xl">
						<p className="text-xs tracking-utility font-semibold text-[color:var(--color-yns-cork)] mb-5">
							MANIFESTO
						</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-[68px] font-black uppercase leading-[0.95] tracking-[-0.02em]">
							Good goods,
							<br />
							made to outlast
							<br />
							the trip.
						</h2>
						<div className="mt-8 space-y-5 text-base sm:text-lg leading-relaxed text-[color:var(--color-yns-cream)]/75">
							<p>
								We started with a question: why does most travel gear feel like a compromise? Plastic where
								there should be wood. Synthetic where there should be skin. Disposable where there should be
								heirloom.
							</p>
							<p>
								So we build the other way. Slow. Honest. Material-first. A small catalog of objects worth
								taking with you &mdash; from the kitchen table to the trailhead and back again.
							</p>
						</div>
						<div className="mt-10 flex items-center gap-4 text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-cream)]/60">
							<span>SIGNED</span>
							<span className="font-display text-lg text-[color:var(--color-yns-cream)]">
								THE YNS WORKSHOP
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
