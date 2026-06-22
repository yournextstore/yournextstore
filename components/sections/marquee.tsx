const items = [
	"Get Discount Up To 30%",
	"Free Shipping Over $50",
	"Nitro-Cold Refreshment",
	"Bold Flavors Inside",
	"Crafted in Small Batches",
	"New Drop · Cool 04",
];

export function Marquee() {
	const row = [...items, ...items];

	return (
		<section
			aria-label="Promotional ticker"
			className="relative border-y border-white/10 bg-black overflow-hidden"
		>
			<div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none" />
			<div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none" />
			<div className="flex whitespace-nowrap py-5">
				<div className="yns-marquee flex shrink-0 items-center gap-10 pr-10">
					{row.map((text, idx) => (
						<div
							key={`${text}-${idx}`}
							className="flex items-center gap-10 text-sm sm:text-base uppercase tracking-[0.18em] text-white/85 font-semibold"
						>
							<span>{text}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="var(--color-yns-yellow)"
								aria-hidden="true"
							>
								<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
							</svg>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
