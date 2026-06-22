import { Truck } from "lucide-react";

const items = [
	"Complimentary shipping on orders over $80",
	"New Spring Collection — handcrafted in small batches",
	"Free returns within 30 days",
	"Members earn double rewards through Sunday",
];

export function AnnouncementBar() {
	return (
		<div className="bg-foreground text-background text-[12px] tracking-[0.18em] uppercase">
			<div className="relative overflow-hidden">
				<div className="flex whitespace-nowrap yns-marquee py-2.5">
					{[...items, ...items, ...items].map((item, idx) => (
						<span key={idx} className="flex items-center gap-3 px-8 shrink-0">
							<Truck className="h-3 w-3 opacity-60" />
							{item}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
