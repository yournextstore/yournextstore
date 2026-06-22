const outlets = ["GOOP", "BON APPÉTIT", "WELL+GOOD", "NEW YORK MAG", "VOGUE", "THE CUT"];

export function Press() {
	return (
		<section className="bg-[#ece4d2] border-y border-[#d6c8af]/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
				<p className="font-label text-center text-clay mb-7" style={{ color: "#8b7560" }}>
					AS SEEN IN
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
					{outlets.map((name) => (
						<span
							key={name}
							className="font-editorial text-lg sm:text-xl text-foreground/45 hover:text-foreground/70 transition-colors tracking-wide"
							style={{ fontStyle: "italic", fontVariationSettings: '"opsz" 36' }}
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
