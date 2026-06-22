import { WipBenefitGlyph } from "@/components/wip-monogram";

const benefits = [
	"Natural Flavors",
	"No Calories",
	"No Nicotine",
	"B Vitamins",
	"Natural Caffeine",
	"No Sugar",
];

export function BenefitsMarquee() {
	const loop = [...benefits, ...benefits, ...benefits, ...benefits];

	return (
		<section
			aria-label="Product benefits"
			className="relative overflow-hidden border-y border-foreground/10 bg-[#f3f3f3] py-5"
		>
			<div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
				{loop.map((item, i) => (
					<div key={`${item}-${i}`} className="flex items-center gap-10">
						<span className="font-display text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
							{item}
						</span>
						<WipBenefitGlyph className="h-6 w-6 shrink-0 text-zap" />
					</div>
				))}
			</div>
		</section>
	);
}
