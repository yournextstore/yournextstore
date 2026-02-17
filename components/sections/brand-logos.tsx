export function BrandLogos() {
	const brands = ["DIOR", "ARMANI", "CALVIN KLEIN", "CHANEL", "VERSACE", "PRADA"];

	return (
		<section className="border-y border-border py-8 sm:py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between gap-8 overflow-hidden">
					{brands.map((brand) => (
						<div key={brand} className="flex-shrink-0 flex items-center justify-center min-w-[100px]">
							<span className="text-sm sm:text-base font-heading tracking-[0.2em] text-foreground/25 hover:text-foreground/50 transition-colors cursor-default select-none">
								{brand}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
