import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function PromoBanner() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
				<div className="relative overflow-hidden rounded-[28px] bg-[#1f2933] text-[#f5f1ea]">
					<div className="absolute inset-0">
						<Image
							src="/scraped-3.jpg"
							alt="Sunlit interior"
							fill
							sizes="100vw"
							className="object-cover opacity-90"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-[#1f2933]/85 via-[#1f2933]/55 to-transparent" />
					</div>
					<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-14 lg:p-20">
						<div className="lg:col-span-7">
							<div className="text-[11px] uppercase tracking-[0.22em] text-[#f5f1ea]/70">
								— Designed for slow living
							</div>
							<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em]">
								Transform Your Home <br />
								<span className="italic font-light text-[#f5f1ea]/85">with Forming Furniture</span>
							</h2>
							<p className="mt-5 max-w-lg text-[#f5f1ea]/70 leading-relaxed">
								From a single oak chair to an entire living room — collaborate with our in-house stylists to
								shape spaces that feel unmistakably yours.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="group inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#e89b3c] text-[#1f2933] text-sm font-medium hover:bg-[#f5b25c] transition-colors"
								>
									Book a styling call
									<ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-[#f5f1ea]/25 text-[#f5f1ea] text-sm font-medium hover:bg-[#f5f1ea]/10 transition-colors"
								>
									Browse lookbook
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
