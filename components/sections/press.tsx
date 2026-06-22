const PRESS = [
	"Vogue",
	"Elle",
	"Allure",
	"Harper's Bazaar",
	"Cosmopolitan",
	"Refinery29",
	"Glamour",
	"Byrdie",
];

export function Press() {
	return (
		<section
			aria-label="As seen in"
			className="border-y border-yns-pink-soft/70 bg-yns-pink-soft/20 py-8 overflow-hidden"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
				<p className="text-[10px] tracking-[0.32em] uppercase text-yns-mauve text-center font-bold">
					As Seen In
				</p>
			</div>
			<div className="relative">
				<div className="flex gap-16 yns-marquee w-max">
					{[...PRESS, ...PRESS].map((name, i) => (
						<span
							key={`${name}-${i}`}
							className="yns-display text-3xl sm:text-4xl text-yns-ink/80 italic whitespace-nowrap"
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
