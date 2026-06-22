export function ValueProps() {
	return (
		<section className="relative bg-[#7fb8d6] text-white overflow-hidden">
			<div aria-hidden="true" className="absolute inset-0 opacity-20 bg-confetti pointer-events-none" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
				<h2 className="font-heading font-black uppercase text-2xl sm:text-3xl lg:text-4xl tracking-tight">
					Chickpea-Based Cookie Mixes
				</h2>
				<div className="mt-6 flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-6 gap-y-2 text-[11px] sm:text-sm tracking-[0.28em] font-extrabold uppercase">
					<span>Gluten-free</span>
					<span aria-hidden className="text-white/60">
						|
					</span>
					<span>Dairy-free</span>
					<span aria-hidden className="text-white/60">
						|
					</span>
					<span>Nut-free</span>
				</div>
			</div>
		</section>
	);
}

export function About() {
	const ingredients = [
		{
			emoji: "🌾",
			title: "Real chickpeas",
			body: "Stone-milled garbanzo flour for fiber, protein, and a tender crumb.",
			color: "#fcefa8",
			tilt: "-rotate-1",
		},
		{
			emoji: "🍫",
			title: "Indulgent chunks",
			body: "Fair-trade chocolate, rainbow sprinkles, real vanilla — never artificial.",
			color: "#7fb8d6",
			tilt: "rotate-1",
		},
		{
			emoji: "🌿",
			title: "Nothing weird",
			body: "No gums, no fillers, no preservatives. Just pantry-shelf goodness.",
			color: "#f8a98a",
			tilt: "-rotate-2",
		},
	];

	return (
		<section id="about" className="relative bg-[#fdf6cf] overflow-hidden">
			<div aria-hidden="true" className="absolute inset-0 opacity-10 bg-confetti pointer-events-none" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto">
					<span className="inline-block rounded-full bg-[#e8456a] text-[#fcefa8] px-4 py-1.5 text-[11px] tracking-[0.22em] font-bold uppercase shadow-pop">
						Our Ingredients
					</span>
					<h2 className="mt-5 font-heading font-black text-[#3a4a8c] text-3xl sm:text-5xl leading-[1.05] tracking-tight">
						Cookies you can <span className="font-display text-[#e8456a]">actually</span> feel good about.
					</h2>
					<p className="mt-5 text-base sm:text-lg text-[#3a4a8c]/75 leading-relaxed">
						We grew up loving the cookies that came from the blue bag and the red box. So we rebuilt them —
						chickpea-first, snackable-second, with the same wide-eyed joy.
					</p>
				</div>

				<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
					{ingredients.map((item) => (
						<div
							key={item.title}
							className={`relative rounded-3xl p-7 sm:p-9 border-2 border-[#3a4a8c]/15 ${item.tilt} hover:rotate-0 transition-transform`}
							style={{ backgroundColor: item.color }}
						>
							<div className="text-5xl mb-4">{item.emoji}</div>
							<h3 className="font-heading font-black text-2xl text-[#3a4a8c] mb-2">{item.title}</h3>
							<p className="text-[#3a4a8c]/85 leading-relaxed">{item.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
