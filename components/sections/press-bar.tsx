const PRESS = ["Bon Appétit", "Goop", "Vogue", "The Cut", "Food52", "Cherry Bombe"];

export function PressBar() {
	return (
		<section className="bg-[#fbe9d7] border-y border-[#1b2a2e]/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
				<p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1b2a2e]/60">
					As featured in
				</p>
				<div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 items-center">
					{PRESS.map((name) => (
						<div
							key={name}
							className="font-display text-xl sm:text-2xl font-bold text-[#1b2a2e]/55 text-center tracking-tight italic"
						>
							{name}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
