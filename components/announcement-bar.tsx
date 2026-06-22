const MESSAGES = [
	"Free shipping on orders $35+",
	"Receive a mini hydrate & defend kit on orders $70+",
	"Carbon-neutral delivery on every order",
	"Refer a friend, both get 15% off",
];

export function AnnouncementBar() {
	const items = [...MESSAGES, ...MESSAGES, ...MESSAGES, ...MESSAGES];

	return (
		<div className="relative bg-foreground text-background overflow-hidden">
			<div className="flex whitespace-nowrap py-2.5 yns-marquee">
				{items.map((msg, i) => (
					<span
						key={`${msg}-${i}`}
						className="uppercase-display text-[11px] tracking-[0.22em] px-10 inline-flex items-center gap-10"
					>
						{msg}
						<span aria-hidden="true" className="size-1 rounded-full bg-background/60" />
					</span>
				))}
			</div>
		</div>
	);
}
