const press = [
	{ name: "The Knot", tag: "Partner", italic: true },
	{ name: "Vogue", tag: null, italic: false },
	{ name: "Glamour", tag: null, italic: false },
	{ name: "Shark Tank", tag: null, italic: false },
];

export function PressStrip() {
	return (
		<section aria-label="As seen in" className="bg-white border-b border-border/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
				<div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-y-6 gap-x-8">
					{press.map((p) => (
						<div key={p.name} className="flex flex-col items-center justify-center">
							<span
								className={`text-2xl sm:text-[26px] font-display tracking-tight text-foreground ${p.italic ? "italic" : ""}`}
							>
								{p.name}
							</span>
							{p.tag && (
								<span className="mt-1 text-[11px] tracking-[0.18em] uppercase text-foreground/70">
									{p.tag}
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
