import { ChevronLeft, ChevronRight } from "lucide-react";

const items = [
	"PRE-ORDER YNS NOW",
	"FREE SHIPPING OVER $45",
	"NEW: SMOKED HABANERO DROP",
	"100% CLEAN INGREDIENTS",
	"SHIPS WITHIN 48 HOURS",
];

export function AnnouncementBar() {
	const reel = [...items, ...items];

	return (
		<div className="relative isolate w-full bg-ember-gradient text-[var(--brand-cream)]">
			<div className="relative flex items-center gap-3 px-4 py-2.5 text-[11px] font-mono-ed uppercase tracking-[0.18em]">
				<button
					type="button"
					aria-label="Previous announcement"
					className="hidden shrink-0 rounded-full p-1 transition-opacity hover:opacity-70 sm:block"
				>
					<ChevronLeft className="h-4 w-4" />
				</button>
				<div className="relative flex-1 overflow-hidden">
					<div className="yns-marquee flex w-max items-center gap-12 whitespace-nowrap">
						{reel.map((item, i) => (
							<span
								key={`${item}-${i}`}
								className="inline-flex items-center gap-3 text-[var(--brand-cream)]/95"
							>
								<span className="inline-block size-1 rounded-full bg-[var(--brand-cream)]/70" />
								{item}
							</span>
						))}
					</div>
					<div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#e94e1b] to-transparent" />
					<div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#b8350f] to-transparent" />
				</div>
				<button
					type="button"
					aria-label="Next announcement"
					className="hidden shrink-0 rounded-full p-1 transition-opacity hover:opacity-70 sm:block"
				>
					<ChevronRight className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
