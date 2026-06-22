const SLOGANS = [
	"Loud flavor",
	"Zero chill",
	"Crack it open",
	"Bottled lightning",
	"Bold by the can",
	"Fully carbonated",
	"Sip happens",
	"Fizz it up",
];

function Star() {
	return (
		<svg
			className="w-6 h-6 inline-block text-[var(--tizz-orange)] shrink-0"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
		</svg>
	);
}

export function Marquee() {
	const items = [...SLOGANS, ...SLOGANS];
	return (
		<section
			aria-label="Slogans"
			className="bg-[var(--tizz-yellow)] border-y-4 border-[var(--tizz-deep)] overflow-hidden"
		>
			<div className="tizz-marquee-track flex items-center gap-8 whitespace-nowrap py-4">
				{items.map((s, i) => (
					<div key={`${s}-${i}`} className="flex items-center gap-8">
						<span className="tizz-display text-[var(--tizz-deep)] text-3xl sm:text-4xl">{s}</span>
						<Star />
					</div>
				))}
			</div>
		</section>
	);
}
