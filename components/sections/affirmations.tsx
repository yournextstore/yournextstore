const PHRASES = [
	"Celebrate Your Texture",
	"Honor Your Tradition",
	"Express Your True Self",
	"Celebrate Your Texture",
	"Honor Your Tradition",
	"Express Your True Self",
];

function Dot() {
	return (
		<span
			aria-hidden="true"
			className="inline-block mx-7 sm:mx-9 h-1 w-1 rounded-full bg-cream/70"
			style={{ backgroundColor: "rgba(245,241,236,0.7)" }}
		/>
	);
}

export function Affirmations() {
	const row = [...PHRASES, ...PHRASES];

	return (
		<section
			className="overflow-hidden border-y border-cream/20 py-3.5 text-cream"
			style={{ backgroundColor: "#9B8FB8", color: "#F5F1EC", borderColor: "rgba(245,241,236,0.18)" }}
		>
			<div className="relative flex whitespace-nowrap">
				<div className="yns-marquee-track-slow flex shrink-0 items-center">
					{row.map((phrase, i) => (
						<span
							key={`p-a-${i}`}
							className="flex items-center text-[10px] sm:text-[11px] font-medium tracking-[0.32em] uppercase"
						>
							<span>{phrase}</span>
							<Dot />
						</span>
					))}
				</div>
				<div className="yns-marquee-track-slow flex shrink-0 items-center" aria-hidden="true">
					{row.map((phrase, i) => (
						<span
							key={`p-b-${i}`}
							className="flex items-center text-[10px] sm:text-[11px] font-medium tracking-[0.32em] uppercase"
						>
							<span>{phrase}</span>
							<Dot />
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
