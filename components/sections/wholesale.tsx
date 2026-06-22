import { YnsLink } from "../yns-link";

export function Wholesale() {
	return (
		<section className="bg-secondary grain-overlay relative isolate">
			<div className="mx-auto max-w-[1400px] px-6 py-24 text-center sm:px-10 sm:py-32">
				<p className="font-mono mb-5 text-[11px] uppercase tracking-[0.3em] text-amber-deep">
					/ wholesale &amp; events
				</p>
				<h2
					className="font-display mx-auto max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight text-mahogany sm:text-6xl lg:text-7xl"
					style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
				>
					pour our ghee at your next table.
				</h2>
				<p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mahogany/70">
					Restaurants, cafés, market stalls, supper clubs — we love a chef who reads the label. Stock the jars
					or invite us to your next pop-up.
				</p>
				<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<YnsLink
						prefetch="eager"
						href="/products"
						className="font-mono inline-flex h-12 items-center justify-center gap-2 bg-mahogany px-8 text-xs uppercase tracking-[0.25em] text-honey transition-colors hover:bg-amber-deep"
					>
						Wholesale inquiries
					</YnsLink>
					<YnsLink
						prefetch="eager"
						href="/products"
						className="font-mono inline-flex h-12 items-center justify-center gap-2 border border-mahogany/30 px-8 text-xs uppercase tracking-[0.25em] text-mahogany transition-colors hover:bg-mahogany hover:text-honey"
					>
						Upcoming events
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
