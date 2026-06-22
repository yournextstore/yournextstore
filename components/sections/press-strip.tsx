const press = ["Vogue", "Goop", "The Cut", "Bon Appétit", "Forbes", "Well + Good"];

export function PressStrip() {
	return (
		<section className="bg-cream border-y border-border/70">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<p className="text-center text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium mb-6">
					— As seen in —
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
					{press.map((name) => (
						<span
							key={name}
							className="font-serif italic text-lg sm:text-xl text-foreground/70 tracking-wide"
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
