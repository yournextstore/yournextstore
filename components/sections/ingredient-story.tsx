import Image from "next/image";

const ingredients = [
	{ name: "Cold-pressed coconut oil", note: "Locks in moisture" },
	{ name: "Raw shea butter", note: "Soothes skin" },
	{ name: "Whole oat protein", note: "Calms irritation" },
	{ name: "Essential oils, never fragrance oils", note: "Real scent, no synthetics" },
];

export function IngredientStory() {
	return (
		<section className="bg-[#b9bcf2]/35">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="order-2 lg:order-1">
						<p className="font-script text-2xl text-[#4d4bc4]">from the source</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl text-[#1a1a2e] leading-tight">
							Real ingredients. Stupidly simple lists.
						</h2>
						<p className="mt-5 text-[#1a1a2e]/75 leading-relaxed text-lg">
							We start with whole-plant ingredients you could find at the farmer&apos;s market, then we refuse
							to add anything you can&apos;t pronounce. That&apos;s it. That&apos;s the secret.
						</p>
						<ul className="mt-8 space-y-4">
							{ingredients.map((item) => (
								<li key={item.name} className="flex items-start gap-4 pb-4 border-b border-[#1a1a2e]/10">
									<span className="font-script text-[#4d4bc4] text-xl mt-0.5">+</span>
									<div>
										<p className="font-display text-xl text-[#1a1a2e]">{item.name}</p>
										<p className="text-sm text-[#5c5b78]">{item.note}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
					<div className="order-1 lg:order-2 relative">
						<div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-25px_rgba(26,26,46,0.5)]">
							<Image
								src="/scraped-5.jpg"
								alt="Botanicals and ingredients"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						<div className="absolute -bottom-6 -left-6 bg-[#1a1a2e] text-[#fdf6ee] rounded-2xl px-6 py-4 shadow-xl rotate-[-3deg]">
							<p className="font-script text-xl">100%</p>
							<p className="text-[10px] uppercase tracking-[0.25em]">Naturally Derived</p>
						</div>
						<div className="absolute -top-6 -right-6 bg-[#e8a47a] text-[#1a1a2e] rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-xl rotate-[8deg]">
							<p className="font-display text-2xl leading-none">0</p>
							<p className="text-[9px] uppercase tracking-[0.25em] mt-1">Mystery Goo</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
