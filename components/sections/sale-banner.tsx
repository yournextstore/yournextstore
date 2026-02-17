import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function SaleBanner() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative h-[50vh] min-h-[350px] sm:h-[60vh]">
				<Image src="/scraped-6.png" alt="Summer season sale" fill className="object-cover" sizes="100vw" />
				<div className="absolute inset-0 bg-gradient-to-r from-brand-dark/70 to-brand-dark/30" />
				<div className="absolute inset-0 flex items-center justify-center text-center">
					<div className="max-w-2xl px-4">
						<h2 className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
							Summer Season Sale
						</h2>
						<p className="mt-4 text-lg text-white/80 sm:text-xl">
							Up to 50% Off. Don&apos;t miss out &mdash; be cool this summer
						</p>
						<div className="mt-8">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-block bg-white px-10 py-3 text-sm font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:bg-brand-cream"
							>
								Shop Now
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
