import { StarIcon } from "lucide-react";

const messages = [
	"FREE SHIPPING ON ORDERS OVER $80",
	"NEW DROP: SUMMER COLLECTION",
	"BUILD YOUR CUSTOM PAIR — START NOW",
	"WORLDWIDE DELIVERY",
	"MEMBERS GET 15% OFF",
	"E-COMMERCE NEXT GENERATION",
];

export function AnnouncementBar() {
	const items = [...messages, ...messages, ...messages];
	return (
		<div className="yns-bg-lime border-b-2 border-foreground overflow-hidden">
			<div className="yns-marquee py-2.5">
				{items.map((msg, i) => (
					<span
						key={`${msg}-${i}`}
						className="flex items-center gap-3 text-[11px] font-bold tracking-[0.18em] uppercase text-foreground shrink-0"
					>
						<StarIcon className="h-3 w-3 fill-foreground" />
						{msg}
					</span>
				))}
			</div>
		</div>
	);
}
