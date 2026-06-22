import Image from "next/image";

const ingredients = [
	{ name: "Marine Collagen", note: "Type I + III", dose: "2,500 mg" },
	{ name: "Hyaluronic Acid", note: "Low molecular", dose: "120 mg" },
	{ name: "Ashwagandha KSM-66", note: "Adaptogen", dose: "300 mg" },
	{ name: "Melatonin", note: "Sleep-cycle", dose: "1 mg" },
	{ name: "Vitamin B12", note: "Methylcobalamin", dose: "500 mcg" },
	{ name: "L-Theanine", note: "Calm-focus", dose: "100 mg" },
];

export function Ingredients() {
	return (
		<section className="bg-[#1a0f4d] text-white relative overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-10 pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 20%, #f5c518 0%, transparent 30%), radial-gradient(circle at 80% 80%, #f4884a 0%, transparent 35%)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<p className="font-marker text-[#f5c518] text-xl mb-3 -rotate-2">what&apos;s inside</p>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
							We list every milligram. <span className="text-[#f5c518]">No proprietary blends.</span>
						</h2>
						<p className="mt-6 text-white/70 text-base leading-relaxed">
							Third-party tested. Made in cGMP-certified facilities. Free of artificial colors, gelatin, and
							sugar — because transparency tastes better.
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							{["Vegan", "Sugar-Free", "Gluten-Free", "Non-GMO", "Third-Party Tested"].map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
								>
									{tag}
								</span>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute -top-4 -left-4 w-32 h-32 bg-[#f4884a]/30 rounded-full blur-2xl" />
						<div className="absolute -bottom-4 -right-4 w-40 h-40 bg-[#4b1fb5]/40 rounded-full blur-2xl" />
						<div className="relative rounded-[2rem] bg-white/5 backdrop-blur-sm border border-white/10 p-6">
							<div className="relative h-40 mb-4 -mt-12">
								<Image
									src="/scraped-3.jpg"
									alt=""
									fill
									sizes="(max-width:1024px) 80vw, 40vw"
									className="object-contain drop-shadow-[4px_8px_20px_rgba(0,0,0,0.4)]"
								/>
							</div>
							<ul className="divide-y divide-white/10">
								{ingredients.map((ing) => (
									<li key={ing.name} className="flex items-center justify-between py-3">
										<div>
											<p className="text-base font-bold text-white">{ing.name}</p>
											<p className="text-xs text-white/50">{ing.note}</p>
										</div>
										<span className="font-marker text-[#f5c518] text-xl">{ing.dose}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
