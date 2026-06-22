import Image from "next/image";
import { YnsLink } from "../yns-link";

export function InsightsEditorial() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
				<div className="rounded-[28px] bg-cream-wash ring-1 ring-[#1f2933]/5 overflow-hidden">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
						<div className="relative min-h-[320px] lg:min-h-[460px]">
							<Image
								src="/scraped-5.jpg"
								alt="Editorial styling"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						<div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
							<div className="text-[11px] uppercase tracking-[0.22em] text-[#c8a57a] mb-3">— Long read</div>
							<h3 className="font-display text-3xl sm:text-4xl tracking-[-0.015em] text-[#1f2933] leading-[1.1]">
								Creative Insights &amp; Home <em className="italic font-light">Transformation</em> Ideas From
								Our Store
							</h3>
							<p className="mt-5 text-[#1f2933]/65 leading-relaxed max-w-lg">
								Three Your Next Store stylists walk through how to layer texture, light and breathing room — a
								quiet field guide to living more slowly with what you already own.
							</p>
							<div className="mt-8 flex items-center gap-4">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#1f2933] text-[#f5f1ea] text-sm font-medium hover:bg-[#0e151c] transition-colors"
								>
									Read the field guide
								</YnsLink>
								<span className="text-xs uppercase tracking-[0.18em] text-[#1f2933]/55">
									12 min read · YNS Journal
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
