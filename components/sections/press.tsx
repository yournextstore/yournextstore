const press = [
	"Bon Appétit",
	"GOOP",
	"Kinfolk",
	"Cherry Bombe",
	"Monocle",
	"The Cut",
	"Bon Appétit",
	"GOOP",
	"Kinfolk",
	"Cherry Bombe",
	"Monocle",
	"The Cut",
];

export function Press() {
	return (
		<section className="bg-background border-y border-foreground/10 overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
				<div className="flex items-center justify-center mb-6">
					<p className="text-[11px] tracking-[0.22em] uppercase text-foreground/55 font-medium">
						As featured in
					</p>
				</div>
				<div className="relative">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10"
					/>
					<div className="flex ticker-scroll whitespace-nowrap">
						{[...press, ...press].map((p, idx) => (
							<span
								key={`${p}-${idx}`}
								className="font-display italic text-3xl text-yns-navy/55 mx-10 shrink-0"
							>
								{p}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
