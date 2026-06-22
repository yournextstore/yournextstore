const outlets = ["Wired", "Monocle", "GQ", "Dezeen", "Kinfolk", "Wallpaper*"];

export function PressStrip() {
	return (
		<section className="border-y border-border bg-black/40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<p className="text-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
					As featured in
				</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
					{outlets.map((o) => (
						<span
							key={o}
							className="font-display text-xl sm:text-2xl text-bone/55 italic tracking-tight font-semibold hover:text-bone transition-colors"
						>
							{o}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
