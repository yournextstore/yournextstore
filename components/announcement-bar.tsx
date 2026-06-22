export function AnnouncementBar() {
	return (
		<div className="relative bg-[#e11226] text-[#fbf6ec] overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-center">
				<p className="text-[10px] sm:text-[11px] tracking-[0.36em] uppercase font-medium text-center">
					Official Your Next Store · Free shipping on orders over $40
				</p>
			</div>
			<div className="pointer-events-none absolute inset-0 yns-grain opacity-30" />
		</div>
	);
}
