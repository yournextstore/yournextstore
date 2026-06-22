const messages = [
	"Join the Community for 10% Off Your First Purchase",
	"Free Shipping On Orders Over $35",
	"Plant-Based · Cruelty-Free · Plastic Negative",
	"Subscribe & Save 15% on Every Refill",
];

export function AnnouncementBar() {
	const track = [...messages, ...messages, ...messages];

	return (
		<div className="bg-[#1F2A33] text-[#F5EFE6] text-xs tracking-wide overflow-hidden border-b border-white/5">
			<div className="flex whitespace-nowrap py-2 yns-marquee will-change-transform">
				{track.map((m, i) => (
					<span
						key={`announce-${i}-${m}`}
						className="mx-6 inline-flex items-center gap-3 uppercase font-medium"
					>
						<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
							<circle cx="4" cy="4" r="3" stroke="currentColor" strokeOpacity="0.6" />
						</svg>
						{m}
					</span>
				))}
			</div>
		</div>
	);
}
