const MESSAGES = [
	"New arrivals dropping every week",
	"Timeless pieces, made to be worn",
	"Sign up for early access to new drops",
	"Secure checkout",
];

/**
 * The original's scrolling announcement strip. The list is rendered twice and the track slides by
 * half its width, so the loop is seamless; the copy is static, so it stays in the prerendered shell.
 */
export function AnnouncementBar() {
	const items = [...MESSAGES, ...MESSAGES];
	return (
		<div className="overflow-hidden bg-secondary text-foreground">
			<p className="sr-only">{MESSAGES.join(". ")}</p>
			<div aria-hidden className="flex w-max animate-marquee">
				{items.map((message, index) => (
					<span key={`${message}-${index}`} className="px-10 py-2 text-body-sm whitespace-nowrap md:px-14">
						{message}
					</span>
				))}
			</div>
		</div>
	);
}
