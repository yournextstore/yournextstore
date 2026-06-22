const PRESS = ["DOMINO", "Vogue", "Architectural Digest", "Dwell", "Goop", "Apartamento"];

export function Press() {
	return (
		<section className="bg-[var(--ivory)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
				<p className="text-center text-[11px] uppercase tracking-[0.32em] text-foreground/55">
					As featured in
				</p>
				<div className="mt-8 grid grid-cols-3 sm:grid-cols-6 items-center gap-x-8 gap-y-6">
					{PRESS.map((name) => (
						<span key={name} className="font-serif italic text-center text-lg sm:text-xl text-foreground/40">
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
