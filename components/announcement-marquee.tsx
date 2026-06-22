import { Sparkles } from "lucide-react";

const items = [
	"AVAILABLE NATIONWIDE",
	"FREE SHIPPING OVER $40",
	"NEW: SOUR WATERMELON",
	"MADE WITH REAL HONEY",
	"NUT-FREE FACILITY",
	"NON-GMO",
	"ELECTROLYTE BLEND",
];

export function AnnouncementMarquee() {
	const loop = [...items, ...items, ...items, ...items];
	return (
		<div className="bg-foreground text-background overflow-hidden py-2 select-none">
			<div className="marquee whitespace-nowrap text-[11px] tracking-[0.28em] font-medium">
				{loop.map((item, i) => (
					<span key={`${item}-${i}`} className="inline-flex items-center gap-3 shrink-0">
						{item}
						<Sparkles className="h-3 w-3 text-[--color-sun-pop]" />
					</span>
				))}
			</div>
		</div>
	);
}
