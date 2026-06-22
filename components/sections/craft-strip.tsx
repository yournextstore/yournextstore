import { Flame, Leaf, MapPin, Recycle } from "lucide-react";

const TILES = [
	{
		Icon: Leaf,
		title: "Natural Wax",
		text: "Coconut & apricot blend, never paraffin",
	},
	{
		Icon: MapPin,
		title: "Traceable Origin",
		text: "Single-source oils from named growers",
	},
	{
		Icon: Flame,
		title: "55-Hour Burn",
		text: "Hand-poured in small, numbered batches",
	},
	{
		Icon: Recycle,
		title: "Refillable Vessel",
		text: "Mouth-blown glass made to outlast the wax",
	},
];

export function CraftStrip() {
	return (
		<section className="bg-cream-grain border-y border-[#e8dcc8]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
					{TILES.map(({ Icon, title, text }) => (
						<div key={title} className="text-center">
							<div className="mx-auto mb-5 inline-flex items-center justify-center h-12 w-12 rounded-full border border-[#c9a87c]/50 text-[#8b6b4a]">
								<Icon className="h-5 w-5" strokeWidth={1.25} />
							</div>
							<h3 className="font-serif text-base text-foreground">{title}</h3>
							<p className="mt-2 text-xs leading-relaxed text-muted-foreground max-w-[14ch] mx-auto">
								{text}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
