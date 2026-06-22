import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Editorial() {
	return (
		<section className="bg-[color:var(--cream)] px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
			<div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
				{/* Big editorial card */}
				<div className="relative lg:col-span-8 aspect-[4/3] lg:aspect-[16/10] overflow-hidden film-grain rounded-sm bg-[color:var(--brown-warm)]">
					<Image
						src="/scraped-1.jpg"
						alt="A rooftop summer party"
						fill
						sizes="(max-width: 1024px) 100vw, 66vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/65 via-[#1a1a1a]/10 to-transparent" />
					<div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-[color:var(--cream)]">
						<p className="text-[11px] uppercase tracking-[0.22em] font-semibold mb-3 text-[color:var(--cream)]/80">
							Made for the moment
						</p>
						<h3 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.96] max-w-[18ch]">
							Rooftops,
							<br />
							long tables,
							<br />
							late nights.
						</h3>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex mt-6 items-center gap-2 px-5 py-2.5 border border-[color:var(--cream)] text-[10px] uppercase tracking-[0.22em] font-semibold rounded-full hover:bg-[color:var(--cream)] hover:text-[color:var(--charcoal)] transition-colors"
						>
							Shop the moments
						</YnsLink>
					</div>
				</div>

				{/* Side stack */}
				<div className="lg:col-span-4 grid grid-cols-1 gap-6 lg:gap-8">
					<div className="relative aspect-[4/3] lg:aspect-square overflow-hidden film-grain rounded-sm bg-[color:var(--terracotta)]">
						<Image
							src="/scraped-4.jpg"
							alt="Still-life pour shot"
							fill
							sizes="(max-width: 1024px) 100vw, 33vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-[#1a1a1a]/40 via-transparent to-transparent" />
						<div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-[color:var(--cream)]">
							<p className="font-display text-xl sm:text-2xl leading-tight">Just-right blend</p>
							<p className="text-xs uppercase tracking-[0.2em] font-semibold mt-1 text-[color:var(--cream)]/80">
								84 cal · 2.8g sugar
							</p>
						</div>
					</div>
					<div className="relative aspect-[4/3] lg:aspect-square overflow-hidden film-grain rounded-sm bg-[color:var(--dusty-blue)]">
						<Image
							src="/scraped-0.jpg"
							alt="Flat lay product"
							fill
							sizes="(max-width: 1024px) 100vw, 33vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-[#3f608a]/45 via-transparent to-transparent" />
						<div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-[color:var(--cream)]">
							<p className="font-display text-xl sm:text-2xl leading-tight">Built to share</p>
							<p className="text-xs uppercase tracking-[0.2em] font-semibold mt-1 text-[color:var(--cream)]/80">
								Pack of four
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
