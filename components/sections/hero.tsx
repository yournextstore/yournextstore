export function Hero() {
	return (
		<section className="grid grid-cols-12 grid-border-b min-h-[250px] md:min-h-[350px]">
			{/* Left: Giant "Sneakers" text */}
			<div className="col-span-12 md:col-span-8 grid-border-r flex items-center justify-center p-4 overflow-hidden relative">
				<h2 className="font-display font-black text-[15vw] md:text-[11rem] leading-[0.8] tracking-tighter text-center select-none transform hover:scale-105 transition-transform duration-700 ease-out">
					Sneakers
				</h2>
			</div>

			{/* Right: Description text */}
			<div className="col-span-12 md:col-span-4 flex items-center justify-center p-8 md:p-12 text-xs md:text-sm font-light leading-relaxed">
				<p className="text-justify-last-left opacity-80 max-w-xs">
					Allow Us To Become Your Reliable Partner In Achieving Your Athletic Goals And Choosing Footwear That
					Will Accompany You Every Step Of Your Exciting Journey.
				</p>
			</div>
		</section>
	);
}
