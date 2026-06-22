const outlets = ["VOGUE", "GQ", "MONOCLE", "DAZED", "WALLPAPER*", "THE INFATUATION"];

export function PressStrip() {
	return (
		<section className="bg-fizz-cream border-y border-fizz-ink/10 py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p className="text-center text-[0.7rem] uppercase tracking-[0.4em] font-bold text-fizz-ink/50 mb-6">
					As poured at
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 gap-y-4">
					{outlets.map((name) => (
						<span
							key={name}
							className="font-display text-fizz-ink/60 text-lg sm:text-2xl tracking-[0.18em] uppercase hover:text-fizz-ink transition-colors"
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
