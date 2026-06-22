const press = ["The Reader", "Modern Hearth", "Slow Living", "Off Cuts", "À Table", "Notes & Knots"];

export function PressStrip() {
	return (
		<section className="bg-[#ecd3b8] border-y border-[#d8c4a8]/70">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
				<p className="text-center text-[10px] uppercase tracking-[0.32em] text-[#6b5e4e] mb-5">As seen in</p>
				<ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-5 sm:gap-y-0 items-center">
					{press.map((p, i) => (
						<li
							key={p}
							className={`text-center font-display text-[#2a2622]/65 text-lg sm:text-xl tracking-wide ${i % 2 === 0 ? "italic" : ""}`}
						>
							{p}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
