export function AnnouncementBar() {
	return (
		<div className="bg-espresso-grain text-[#f4efe6] border-b border-[#3d2e22]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-center h-9 text-[10px] sm:text-[11px] tracking-luxe uppercase font-light">
					<span className="hidden sm:inline">Complimentary shipping on orders over $120</span>
					<span className="mx-3 hidden sm:inline opacity-50">·</span>
					<span>Hand-poured in small batches</span>
					<span className="mx-3 hidden sm:inline opacity-50">·</span>
					<span className="hidden sm:inline">Free returns within 30 days</span>
				</div>
			</div>
		</div>
	);
}
