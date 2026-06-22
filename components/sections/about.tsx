import Image from "next/image";

export function About() {
	return (
		<section id="about" className="bg-[color:var(--cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
				<div className="relative aspect-[4/5] sm:aspect-square overflow-hidden film-grain rounded-sm bg-[color:var(--brown-warm)]">
					<Image
						src="/scraped-2.jpg"
						alt="Behind the bar"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-tr from-[#1a1a1a]/30 via-transparent to-transparent" />
				</div>
				<div>
					<p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[color:var(--brown-warm)] mb-3">
						Our story
					</p>
					<h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.94] text-[color:var(--charcoal)]">
						Not too sweet.
						<br />
						Not too strong.
						<br />
						<span className="text-[color:var(--dusty-blue)]">Just right.</span>
					</h2>
					<p className="mt-6 text-base sm:text-lg leading-relaxed text-[color:var(--muted-foreground)]">
						We started Your Next Store because every canned cocktail on the shelf felt like a compromise. Too
						syrupy, too boozy, too… try-hard. So we built our own — with real spirits, a whisper of sugar, and
						the kind of restraint that makes a drink genuinely worth the second sip.
					</p>
					<p className="mt-4 text-base sm:text-lg leading-relaxed text-[color:var(--muted-foreground)]">
						Eighty-four calories. Two-point-eight grams of sugar. Zero shortcuts.
					</p>

					<dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
						{[
							["84", "Calories"],
							["2.8g", "Sugar"],
							["100%", "Real spirits"],
						].map(([num, label]) => (
							<div key={label}>
								<dt className="font-display text-3xl sm:text-4xl text-[color:var(--charcoal)] leading-none">
									{num}
								</dt>
								<dd className="mt-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[color:var(--brown-warm)]">
									{label}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}
