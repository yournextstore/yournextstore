const press = ["MEN'S HEALTH", "WELL+GOOD", "BON APPÉTIT", "OUTSIDE", "FORBES", "FAST COMPANY"];

export function Press() {
	return (
		<section className="bg-black border-y border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div className="flex flex-col items-center gap-6">
					<div className="font-display uppercase tracking-[0.3em] text-[11px] text-white/40">
						As featured in
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-10 items-center w-full">
						{press.map((name) => (
							<div
								key={name}
								className="text-center font-display uppercase text-sm sm:text-base tracking-[0.18em] text-white/55 hover:text-white transition-colors"
							>
								{name}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
