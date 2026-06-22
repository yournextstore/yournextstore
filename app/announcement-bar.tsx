export function AnnouncementBar() {
	return (
		<div className="bg-[#4b1fb5] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 items-center text-center h-10 sm:h-11">
					<div className="hidden sm:block border-r border-white/15 py-3">
						Use code <span className="text-[#f5c518]">FIRST20</span> for 20% off your first order
					</div>
					<div className="py-3 sm:pl-4">No-questions-asked product refund within 7 days</div>
				</div>
			</div>
		</div>
	);
}
