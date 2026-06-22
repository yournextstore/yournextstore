export function AnnouncementBar() {
	return (
		<div className="w-full mush-yellow-gradient text-[color:var(--color-mush-espresso)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-9 text-[12px] sm:text-[13px] tracking-wide">
					<div className="flex items-center gap-2 mx-auto sm:mx-0 font-medium">
						<span className="inline-flex items-center rounded-full bg-[color:var(--color-mush-espresso)] px-2 py-0.5 text-[10px] font-display tracking-widest text-[color:var(--color-mush-yellow)]">
							NEW
						</span>
						<span className="font-semibold uppercase">Free shipping over $40 — naturally</span>
					</div>
					<div className="hidden sm:flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-semibold">
						<span>English</span>
						<svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
							<path d="M3 5l3 3 3-3" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}
