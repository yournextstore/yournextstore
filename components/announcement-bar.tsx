import { TruckIcon } from "lucide-react";

export function AnnouncementBar() {
	return (
		<div className="bg-[#1f2933] text-[#f5f1ea]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase">
				<span className="hidden sm:inline">Free shipping on orders over $250</span>
				<span className="inline-flex items-center gap-2">
					<TruckIcon className="h-3.5 w-3.5" />
					Crafted slowly. Delivered with care.
				</span>
				<span className="hidden sm:inline">EN / USD</span>
			</div>
		</div>
	);
}
