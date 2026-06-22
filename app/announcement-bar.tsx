function InstagramGlyph({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			className={className}
			aria-hidden
		>
			<title>Instagram</title>
			<rect x={3} y={3} width={18} height={18} rx={5} ry={5} />
			<circle cx={12} cy={12} r={4} />
			<circle cx={17.5} cy={6.5} r={0.9} fill="currentColor" />
		</svg>
	);
}

export function AnnouncementBar() {
	return (
		<div className="hidden sm:block border-b border-[#d8c4a8]/50 bg-[#fbf3e6]/80">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="relative flex items-center justify-between h-8 text-[11px] uppercase tracking-[0.22em] text-[#6b5e4e]">
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 hover:text-[#1f46c2] transition-colors"
					>
						<InstagramGlyph className="h-3.5 w-3.5" />
						<span>@yournextstore</span>
					</a>
					<span className="absolute left-1/2 -translate-x-1/2 font-script text-[#1f46c2] text-xl normal-case tracking-normal leading-none">
						est. twenty&apos;twenty&apos;six
					</span>
					<span className="hidden md:block">Free shipping over $50 · World-wide</span>
				</div>
			</div>
		</div>
	);
}
