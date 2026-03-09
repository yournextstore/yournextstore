const instagramColors = ["#e8d5c4", "#d4c4b0", "#c4b8a8", "#b8a898", "#a89888", "#988878"];

export function InstagramSection() {
	return (
		<section className="py-10 sm:py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
				<h2 className="text-sm sm:text-base font-semibold tracking-[0.15em] uppercase text-foreground">
					@YourNextStore{" "}
					<span className="text-foreground/40 font-normal tracking-normal normal-case text-xs">
						Follow us on Instagram
					</span>
				</h2>
			</div>

			<div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
				{instagramColors.map((color, i) => (
					<div
						key={`insta-${i}-${color}`}
						className="aspect-square cursor-pointer group relative overflow-hidden"
						style={{ backgroundColor: color }}
					>
						<div className="absolute inset-0 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-white/20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
							>
								<rect x="2" y="2" width="20" height="20" rx="5" />
								<circle cx="12" cy="12" r="5" />
								<circle cx="17.5" cy="6.5" r="1" />
							</svg>
						</div>
						<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
							<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 text-white text-xs">
								<span className="flex items-center gap-1">
									<svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
									</svg>
									24
								</span>
								<span className="flex items-center gap-1">
									<svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
										<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
									</svg>
									12
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
