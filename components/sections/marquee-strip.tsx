import { LeafIcon } from "lucide-react";

const PHRASES = [
	"Single-origin botanicals",
	"Carbon-neutral shipping",
	"Lab-tested purity",
	"Slow small-batch formulas",
	"Glass refill program",
	"Crafted with intention",
];

export function MarqueeStrip() {
	const items = [...PHRASES, ...PHRASES];
	return (
		<section className="bg-[#0f2412] text-leaf-50 border-y border-leaf-50/10">
			<div className="marquee py-5">
				<div className="marquee-track">
					{items.map((phrase, i) => (
						<div key={`${phrase}-${i}`} className="flex items-center gap-3 shrink-0">
							<LeafIcon className="h-4 w-4 text-leaf-300 shrink-0" />
							<span className="font-display italic text-2xl sm:text-3xl whitespace-nowrap">{phrase}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
