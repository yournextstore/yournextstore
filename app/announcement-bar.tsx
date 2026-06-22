const MESSAGES = [
	"Your Next Store — Rooted in Care, Community, and Intention",
	"Free Shipping on Orders $100+",
	"Your Next Store — Rooted in Care, Community, and Intention",
	"Free Shipping on Orders $100+",
];

function Bag() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
			className="inline-block h-3 w-3 mx-3 opacity-60"
		>
			<title>Bag</title>
			<path d="M6 7h12l-1.2 13.2A2 2 0 0 1 14.81 22H9.19a2 2 0 0 1-1.99-1.8L6 7Z" />
			<path d="M9 7V5a3 3 0 1 1 6 0v2" />
		</svg>
	);
}

export function AnnouncementBar() {
	const row = [...MESSAGES, ...MESSAGES];

	return (
		<div
			className="bg-plum-deep text-cream overflow-hidden text-[10px] sm:text-[11px] tracking-[0.18em] uppercase border-b border-cream/10"
			style={{ backgroundColor: "#2B2530", color: "#F5F1EC" }}
		>
			<div className="relative flex whitespace-nowrap py-2.5">
				<div className="yns-marquee-track flex shrink-0 items-center">
					{row.map((msg, i) => (
						<span key={`a-${i}`} className="flex items-center px-6">
							<span>{msg}</span>
							<Bag />
						</span>
					))}
				</div>
				<div className="yns-marquee-track flex shrink-0 items-center" aria-hidden="true">
					{row.map((msg, i) => (
						<span key={`b-${i}`} className="flex items-center px-6">
							<span>{msg}</span>
							<Bag />
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
