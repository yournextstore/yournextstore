export function Footer() {
	return (
		<section className="grid grid-cols-12 grid-border-b md:border-b-0">
			{/* Left column with description text */}
			<div className="col-span-12 md:col-span-4 grid-border-r p-8 md:p-12 min-h-[200px] flex items-center">
				<p className="text-xs leading-relaxed opacity-70">
					Our Sneakers Are Renowned For Their Unparalleled Quality, Comfort, And Durability. Our Products Are
					Crafted Using High-Quality Materials And Cutting-Edge Technologies That Provide Optimal Cushioning,
					Ventilation, And Support For Your Feet Throughout The Day.
				</p>
			</div>

			{/* Middle empty column */}
			<div className="col-span-12 md:col-span-4 grid-border-r hidden md:block" />

			{/* Right empty column */}
			<div className="col-span-12 md:col-span-4 hidden md:block" />
		</section>
	);
}
