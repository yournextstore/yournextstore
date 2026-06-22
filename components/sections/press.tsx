const press = ["FIELD JOURNAL", "COMMON ROUTE", "WAYWARD MAG", "OAKHAUS", "NORTH+SOUTH", "SLOW GOODS"];

export function Press() {
	return (
		<section className="bg-[color:var(--color-yns-cream)] border-y border-[color:var(--color-yns-ink)]/10">
			<div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
				<div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
					<p className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]/55 lg:w-32 shrink-0">
						AS SEEN IN
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10 flex-1">
						{press.map((name) => (
							<div
								key={name}
								className="font-display text-base sm:text-lg lg:text-xl font-black uppercase tracking-[-0.01em] text-[color:var(--color-yns-ink)]/45 hover:text-[color:var(--color-yns-ink)] transition-colors text-center lg:text-left"
							>
								{name}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
