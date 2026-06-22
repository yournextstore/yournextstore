export function EditorialStatement() {
	return (
		<section className="relative bg-[var(--brand-cream)]">
			<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-32">
				<p className="font-mono-ed text-center text-[10px] uppercase tracking-[0.32em] text-[var(--brand-ink)]/55">
					— Our pact —
				</p>
				<h2 className="mt-6 text-balance text-center font-display text-[clamp(2rem,5.5vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--brand-ink)]">
					<em className="font-display italic">Always</em> clean.{" "}
					<em className="font-display italic">Always</em> convenient.{" "}
					<em className="font-display italic">Always</em> flavorful.
				</h2>
				<div aria-hidden="true" className="mx-auto mt-12 h-px w-24 bg-[var(--brand-ink)]/20" />
				<p className="mx-auto mt-8 max-w-xl text-balance text-center font-mono-ed text-[12px] leading-relaxed text-[var(--brand-ink)]/65">
					Real ingredients. No seed oils. No preservatives. Just sauces built to make every plate more
					interesting.
				</p>
			</div>
		</section>
	);
}
