import Image from "next/image";

export function About() {
	const ingredients = [
		{ label: "Whole Grain Corn", note: "Crisp, nutty base" },
		{ label: "Real Cinnamon", note: "Warm bakery spice" },
		{ label: "Vanilla Glaze", note: "Cozy sweetness" },
		{ label: "Plant Protein", note: "7g per serving" },
	];

	return (
		<section id="story" className="relative bg-cream-band overflow-hidden">
			<div className="absolute inset-0 pointer-events-none opacity-60">
				<svg
					className="absolute -top-10 -left-10 w-72 text-[var(--lavender-deep)]/40"
					viewBox="0 0 200 100"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M40 70c-16 0-30-12-30-28S24 14 40 14c6 0 12 2 17 5C62 9 71 4 82 4c18 0 32 13 33 31 4-2 9-3 14-3 16 0 28 12 28 28 0 14-10 26-24 28-3 7-10 12-19 12H46c-3 0-5-1-6-3" />
				</svg>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="relative aspect-square max-w-lg mx-auto lg:mx-0 w-full">
						<div className="absolute inset-0 rounded-[40px] overflow-hidden cloud-shadow bg-white/40">
							<Image
								src="/scraped-1.jpg"
								alt="Real ingredients flat lay"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						<div className="absolute -bottom-6 -right-6 z-10 rotate-3 bg-[var(--butter)] text-[var(--cobalt)] rounded-2xl px-5 py-3 cloud-shadow">
							<p className="font-display uppercase text-base leading-tight">
								Made with
								<br />
								Real Ingredients
							</p>
						</div>
					</div>

					<div>
						<p className="text-[var(--cobalt)] uppercase tracking-[0.25em] text-xs font-semibold mb-3">
							Our Story
						</p>
						<h2 className="font-display uppercase text-[var(--cobalt)] text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
							A cozy classic,
							<br />
							reimagined.
						</h2>
						<p className="mt-6 text-[var(--cobalt)]/85 text-lg leading-relaxed max-w-md">
							We grew up obsessed with Sunday-morning cinnamon rolls. Then we grew up. Your Next Store is a
							bakery-warm snack that fits in your bag, your gym kit, and your better-for-you era — without
							giving up the swirl.
						</p>
						<ul className="mt-8 grid grid-cols-2 gap-4">
							{ingredients.map((i) => (
								<li
									key={i.label}
									className="rounded-2xl bg-white/70 backdrop-blur p-4 border border-[var(--cobalt)]/10"
								>
									<p className="font-display uppercase text-[var(--cobalt)] text-sm">{i.label}</p>
									<p className="text-[var(--cobalt)]/65 text-xs mt-1">{i.note}</p>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
