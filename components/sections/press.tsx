const logos = ["Vogue", "Wallpaper*", "Kinfolk", "Monocle", "Cereal", "Apartamento"];

export function Press() {
	const loop = [...logos, ...logos];
	return (
		<section className="bg-[var(--cream)] overflow-hidden border-b border-[var(--border)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
				<p className="text-center text-[10px] tracking-[0.32em] uppercase text-foreground/55 mb-8">
					As seen in
				</p>
				<div className="relative w-full">
					<div className="flex gap-16 lg:gap-24 w-max animate-marquee items-center">
						{loop.map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="font-display text-2xl lg:text-3xl text-foreground/60 italic shrink-0"
							>
								{name}
							</span>
						))}
					</div>
					<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--cream)] to-transparent" />
					<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--cream)] to-transparent" />
				</div>
			</div>
		</section>
	);
}
