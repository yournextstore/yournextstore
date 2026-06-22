export function AnnouncementBar() {
	return (
		<div className="bg-espresso text-cream/85 text-[11px] sm:text-xs tracking-[0.18em] uppercase">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
				<span className="hidden sm:inline opacity-70">Atelier · Est. 2018</span>
				<p className="flex-1 text-center font-medium">
					Complimentary shipping on orders over $180 · Slow-made, sun-washed essentials
				</p>
				<div className="hidden sm:flex items-center gap-3 opacity-80">
					<span aria-hidden="true">USD</span>
					<span aria-hidden="true" className="opacity-40">
						·
					</span>
					<span>EN</span>
				</div>
			</div>
		</div>
	);
}
