/**
 * The black announcement strip that runs along the top of every page. One link (to the footer
 * signup) carries the sentence once for assistive tech; the moving copies are decoration.
 */
export function Marquee({ text }: { text: string }) {
	const copies = Array.from({ length: 6 }, (_, i) => i);
	return (
		<a
			href="#newsletter"
			className="relative flex h-10 items-center overflow-hidden bg-background text-snow md:h-[clamp(2.75rem,8vh,4.5rem)]"
		>
			<span className="sr-only">{text}</span>
			<span aria-hidden="true" className="marquee-track flex w-max shrink-0">
				{[0, 1].map((half) => (
					<span key={half} className="flex shrink-0">
						{copies.map((i) => (
							<span
								key={i}
								className="flex shrink-0 items-center gap-[0.6em] whitespace-nowrap px-4 text-sm md:px-[1.5vw] md:text-nav"
							>
								<span className="size-[0.35em] rounded-full bg-current" />
								{text}
							</span>
						))}
					</span>
				))}
			</span>
		</a>
	);
}
