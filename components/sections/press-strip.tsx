const press = ["Vogue", "GQ", "Esquire", "The Cut", "Allure", "Highsnobiety", "Refinery 29", "Bon Appétit"];

export function PressStrip() {
	const items = [...press, ...press];
	return (
		<section className="bg-[#b9bcf2] overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
				<p className="text-center text-[11px] tracking-[0.35em] uppercase text-[#1a1a2e]/70 mb-6">
					As Seen In
				</p>
				<div className="relative w-full overflow-hidden">
					<div className="flex gap-12 sm:gap-16 marquee whitespace-nowrap w-max">
						{items.map((name, i) => (
							<span
								key={`${name}-${i}`}
								className="font-display text-2xl sm:text-3xl text-[#1a1a2e]/80 tracking-tight"
							>
								{name}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
