const press = ["VOGUE", "BON APPÉTIT", "BUSTLE", "PUNCH", "FOOD & WINE", "REFINERY29", "COOL HUNTING"];

export function PressStrip() {
	return (
		<section className="relative bg-pop-ink text-pop-yellow py-7 overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-pop-ink to-transparent z-10"
			/>
			<div
				aria-hidden
				className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-pop-ink to-transparent z-10"
			/>
			<div className="flex w-max animate-marquee gap-12">
				{[...press, ...press, ...press].map((p, i) => (
					<div
						key={`${p}-${i}`}
						className="flex items-center gap-12 font-display text-2xl sm:text-3xl tracking-[0.18em]"
					>
						<span>{p}</span>
						<span className="text-pop-pink" aria-hidden>
							✦
						</span>
					</div>
				))}
			</div>
		</section>
	);
}
