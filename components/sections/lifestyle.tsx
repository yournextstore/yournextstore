import Image from "next/image";

const SCENES = [
	{
		src: "/scraped-0.jpg",
		eyebrow: "On the move",
		title: "Slips into any tote, never spills a drop.",
		caption: "Compact 480ml profile fits where round bottles can't.",
		span: "lg:col-span-2",
		ratio: "aspect-[16/10]",
	},
	{
		src: "/scraped-1.jpg",
		eyebrow: "Desk-side",
		title: "Hydration that earns a spot on your desk.",
		caption: "Translucent shades that look as good as they perform.",
		span: "",
		ratio: "aspect-[4/5]",
	},
	{
		src: "/scraped-2.jpg",
		eyebrow: "Studio days",
		title: "Built for hot yoga, cold brews, every in-between.",
		caption: "BPA-free Tritan plastic, lightweight and crystal clear.",
		span: "",
		ratio: "aspect-[4/5]",
	},
	{
		src: "/scraped-3.jpg",
		eyebrow: "Weekends out",
		title: "Picnics, parks, and the long way home.",
		caption: "Wrist strap and leakproof seal go everywhere you do.",
		span: "lg:col-span-2",
		ratio: "aspect-[16/10]",
	},
];

export function Lifestyle() {
	return (
		<section className="bg-[#f5efe6] py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="max-w-xl mb-12">
					<span className="inline-block px-3 py-1 rounded-full bg-[#a8d4d4]/40 text-[#3a6a68] text-[11px] font-semibold uppercase tracking-[0.18em]">
						In the wild
					</span>
					<h2 className="mt-4 font-display text-[44px] sm:text-[56px] leading-[1] tracking-[-0.025em] text-[#14111c]">
						Lives <span className="italic text-[#5e3ca8]">beautifully</span> in yours.
					</h2>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
					{SCENES.map((scene, i) => (
						<div
							key={scene.src}
							className={`group relative overflow-hidden rounded-3xl ${scene.span} ${scene.ratio}`}
						>
							<Image
								src={scene.src}
								alt={scene.title}
								fill
								sizes={
									i === 0 || i === 3 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"
								}
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div
								aria-hidden
								className="absolute inset-0 bg-gradient-to-t from-[#14111c]/75 via-[#14111c]/15 to-transparent"
							/>
							<div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
								<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
									{scene.eyebrow}
								</p>
								<h3 className="mt-2 font-display text-[24px] sm:text-[28px] leading-tight max-w-md">
									{scene.title}
								</h3>
								<p className="mt-1.5 text-[13.5px] text-white/75 max-w-md">{scene.caption}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
