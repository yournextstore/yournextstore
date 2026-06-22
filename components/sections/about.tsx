import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative bg-soot text-cream overflow-hidden">
			<div aria-hidden className="absolute inset-0 bg-soot-gradient" />
			<div
				aria-hidden
				className="absolute inset-y-0 right-0 w-2/3 opacity-30 pointer-events-none flame-noise"
			/>

			<div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				<div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-sm overflow-hidden border border-flame/20 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
					<Image
						src="/scraped-3.jpg"
						alt="A cast-iron pan of bubbling crimson tomato sauce in a stone trattoria kitchen"
						fill
						sizes="(max-width: 1024px) 100vw, 600px"
						className="object-cover"
					/>
					<div
						aria-hidden
						className="absolute inset-0 bg-gradient-to-tr from-soot/70 via-transparent to-transparent"
					/>
					<div className="absolute bottom-6 left-6 right-6 font-condensed tracking-[0.22em] text-[11px] text-cream/80">
						Est. The Year Nonna Stopped Speaking To Us
					</div>
				</div>

				<div id="story">
					<span className="inline-flex items-center gap-3 text-[11px] font-condensed tracking-[0.32em] text-flame">
						<span aria-hidden className="h-px w-10 bg-flame/60" /> Our Heresy
					</span>
					<h2 className="mt-5 font-display text-5xl sm:text-6xl text-cream leading-[1.02]">
						Sauce that bites back.
					</h2>
					<div className="mt-8 space-y-5 text-cream/80 text-base sm:text-lg leading-relaxed max-w-xl">
						<p>
							We started this kitchen because every jar on the supermarket shelf tasted like an apology.
							Watery. Polite. Loaded with sugar to hide the fact that nobody actually cooked it.
						</p>
						<p>
							So we cracked open the cellar, threw a Sangiovese in the pot, charred a fistful of garlic, and
							dropped in chilies that would make your nonna chase you out of the kitchen with a wooden spoon.
							We don&apos;t apologize for the heat. We don&apos;t apologize for anything.
						</p>
					</div>

					<dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
						<div>
							<dt className="font-display text-4xl text-gold">12</dt>
							<dd className="mt-1 font-condensed text-[11px] tracking-[0.18em] text-cream/60">Hour Simmer</dd>
						</div>
						<div>
							<dt className="font-display text-4xl text-flame">003</dt>
							<dd className="mt-1 font-condensed text-[11px] tracking-[0.18em] text-cream/60">
								Limited Batches
							</dd>
						</div>
						<div>
							<dt className="font-display text-4xl text-blush">0</dt>
							<dd className="mt-1 font-condensed text-[11px] tracking-[0.18em] text-cream/60">
								Apologies Given
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</section>
	);
}
