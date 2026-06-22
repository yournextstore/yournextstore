const PRESS = [
	"Vogue",
	"Kinfolk",
	"Cereal",
	"Architectural Digest",
	"The World of Interiors",
	"Monocle",
	"Elle Decor",
	"T Magazine",
];

export function PressMarquee() {
	const items = [...PRESS, ...PRESS];
	return (
		<section className="bg-[#1a1410] text-[#c9a87c] border-y border-[#3d2e22]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<p className="text-center text-[10px] tracking-luxe uppercase text-[#c9a87c]/60 mb-6">
					As Featured In
				</p>
				<div className="overflow-hidden relative">
					<div className="marquee-track flex gap-16 whitespace-nowrap w-max">
						{items.map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="font-serif text-2xl tracking-wide text-[#c9a87c]/70 italic"
							>
								{name}
							</span>
						))}
					</div>
					<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1a1410] to-transparent" />
					<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#1a1410] to-transparent" />
				</div>
			</div>
		</section>
	);
}
