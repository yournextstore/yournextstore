import { ChevronLeft, ChevronRight } from "lucide-react";

const messages = [
	"Bundle & save 10% off when you add 2+ items to your cart",
	"Free shipping on orders over $50 — every silhouette, every shade",
	"New arrivals just dropped — meet the second-skin collection",
];

export function AnnouncementBar() {
	return (
		<div className="relative bg-magenta text-white text-[12px] tracking-[0.08em]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-10">
					<button
						type="button"
						aria-label="Previous announcement"
						className="opacity-80 hover:opacity-100 transition-opacity p-1 -ml-1"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<div className="flex-1 overflow-hidden">
						<div className="flex items-center justify-center gap-2 whitespace-nowrap">
							<span className="font-medium">{messages[0]}</span>
							<span aria-hidden="true">→</span>
						</div>
					</div>
					<button
						type="button"
						aria-label="Next announcement"
						className="opacity-80 hover:opacity-100 transition-opacity p-1 -mr-1"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
