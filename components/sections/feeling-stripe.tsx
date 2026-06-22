import { YnsLink } from "../yns-link";

export function FeelingStripe() {
	return (
		<section className="bg-background border-y border-foreground/10">
			<div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-10 py-7 md:py-8">
					<div className="md:col-span-3">
						<p className="font-display text-2xl sm:text-[1.7rem] tracking-tight text-foreground">
							Feeling so seen.
						</p>
					</div>
					<div className="md:col-span-7">
						<p className="text-base sm:text-[1.05rem] text-foreground/70 leading-relaxed max-w-2xl">
							Turns out, you love our hydrating satin balms for all the same reasons we do — a high-shine
							finish, weightless slip, and a finish that lingers without the tack.
						</p>
					</div>
					<div className="md:col-span-2 md:justify-self-end">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-11 px-6 bg-foreground text-background text-[0.72rem] tracking-[0.22em] uppercase font-semibold hover:bg-[color:var(--color-slate-ink)] transition-colors w-full md:w-auto"
						>
							Shop Lip Edit
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
