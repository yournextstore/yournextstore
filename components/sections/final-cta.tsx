import { ArrowUpRight } from "lucide-react";
import { YnsLink } from "../yns-link";

export function FinalCTA() {
	return (
		<section className="relative w-full overflow-hidden bg-cinema-deep">
			{/* Atmosphere */}
			<div className="absolute inset-0 bg-stardust opacity-40 pointer-events-none" />
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse 60% 40% at 50% 100%, rgba(46,92,255,0.25) 0%, transparent 60%)",
				}}
			/>

			<div className="relative max-w-4xl mx-auto px-6 py-32 sm:py-44 text-center">
				<p className="font-sans text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-8">
					Edition 01 · Limited run
				</p>
				<h2 className="font-serif text-balance text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05]">
					Carry something <em className="not-italic text-foreground">quietly remarkable.</em>
				</h2>
				<p className="mt-8 max-w-md mx-auto text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
					Ships from our atelier this season. Free returns for the first thirty nights.
				</p>

				<div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="btn-cobalt inline-flex items-center justify-center gap-1.5 h-12 px-8 rounded-full text-[14px] font-medium text-white"
					>
						Shop the Edition
						<ArrowUpRight className="h-4 w-4" />
					</YnsLink>
					<YnsLink
						prefetch={"eager"}
						href="#what"
						className="btn-onyx inline-flex items-center justify-center h-12 px-7 rounded-full text-[14px] font-medium text-foreground"
					>
						Learn more
					</YnsLink>
				</div>

				<div className="mt-16 inline-flex items-center gap-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
					<span>30-night returns</span>
					<span className="h-1 w-1 rounded-full bg-border" />
					<span>2-year warranty</span>
					<span className="h-1 w-1 rounded-full bg-border" />
					<span>Free shipping</span>
				</div>
			</div>
		</section>
	);
}
