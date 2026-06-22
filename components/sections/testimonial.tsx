export function Testimonial() {
	return (
		<section className="relative bg-arame-warm bg-arame-grain border-y border-border/50">
			<div className="max-w-4xl mx-auto px-6 sm:px-10 py-24 sm:py-32 text-center">
				<svg
					aria-hidden="true"
					width="40"
					height="40"
					viewBox="0 0 40 40"
					className="mx-auto text-foreground/35"
					fill="currentColor"
				>
					<path d="M11 24c-3 0-5-2-5-5 0-5 4-10 9-12l1 2c-3 2-5 5-5 7 1-1 2-1 3-1 3 0 5 2 5 5s-3 4-8 4zm17 0c-3 0-5-2-5-5 0-5 4-10 9-12l1 2c-3 2-5 5-5 7 1-1 2-1 3-1 3 0 5 2 5 5s-3 4-8 4z" />
				</svg>
				<blockquote className="mt-8 font-serif text-2xl sm:text-3xl lg:text-[34px] leading-[1.3] text-foreground italic max-w-3xl mx-auto">
					&ldquo;It&apos;s the first thing I reach for and the last thing I see before bed. A small, steadying
					ritual — like lighting a candle, but for your mouth.&rdquo;
				</blockquote>
				<div className="mt-10">
					<p className="font-serif text-base text-foreground">Camille R.</p>
					<p className="text-[11px] tracking-arame uppercase text-foreground/55 mt-1">
						Verified · The Polish, refilled twice
					</p>
				</div>
			</div>
		</section>
	);
}
