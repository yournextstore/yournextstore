import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="bg-ghee relative isolate overflow-hidden">
			<div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 sm:px-10 sm:py-32 lg:py-44">
				<h1
					className="font-display max-w-3xl text-[clamp(3rem,9vw,7.5rem)] font-medium leading-[0.92] tracking-tight text-mahogany"
					style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
				>
					<span className="block">spreadable</span>
					<span className="block">searable</span>
					<span className="block">super</span>
					<span className="block">butter</span>
				</h1>
				<div className="mt-10">
					<YnsLink
						prefetch="eager"
						href="/products"
						className="font-mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-mahogany underline decoration-mahogany/40 underline-offset-[6px] transition-all hover:decoration-mahogany"
					>
						shop all <span aria-hidden>→</span>
					</YnsLink>
				</div>
			</div>

			{/* Decorative honeycomb glints */}
			<svg
				aria-hidden="true"
				className="pointer-events-none absolute -right-20 top-10 z-0 h-[400px] w-[400px] opacity-30 mix-blend-overlay sm:right-10 sm:top-20"
				viewBox="0 0 200 200"
				fill="none"
			>
				<circle cx="100" cy="100" r="80" stroke="#fffaee" strokeWidth="0.5" />
				<circle cx="100" cy="100" r="60" stroke="#fffaee" strokeWidth="0.5" />
				<circle cx="100" cy="100" r="40" stroke="#fffaee" strokeWidth="0.5" />
			</svg>
		</section>
	);
}
