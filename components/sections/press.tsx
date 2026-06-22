const outlets = [
	"Vogue",
	"Cereal",
	"Kinfolk",
	"Goop",
	"Architectural Digest",
	"T Magazine",
	"Apartamento",
	"Monocle",
];

export function Press() {
	return (
		<section className="bg-background py-14 border-b border-border/50">
			<p className="text-center text-[10px] tracking-arame uppercase text-foreground/55 mb-8">
				As featured in
			</p>
			<div className="relative overflow-hidden">
				<div className="flex w-max gap-16 animate-marquee opacity-70">
					{[...outlets, ...outlets].map((name, i) => (
						<span
							key={`${name}-${i}`}
							className="font-serif italic text-2xl sm:text-3xl text-foreground/55 whitespace-nowrap"
						>
							{name}
						</span>
					))}
				</div>
				{/* Fade edges */}
				<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
			</div>
		</section>
	);
}
