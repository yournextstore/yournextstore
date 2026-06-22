import Image from "next/image";
import { YnsLink } from "../yns-link";

export function EditorialSplit() {
	return (
		<section className="relative bg-[#fbf6ec]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					<div className="relative">
						<div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
							<Image
								src="/scraped-0.jpg"
								alt="Editorial campaign photo"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-[#0f0f10]/20 to-transparent" />
						</div>
						<div className="absolute -bottom-4 -right-4 bg-[#e11226] text-[#fbf6ec] px-4 py-2 text-[10px] tracking-[0.28em] uppercase font-semibold rotate-3">
							Best Seller
						</div>
					</div>

					<div className="relative">
						<p className="text-[11px] tracking-[0.4em] uppercase text-[#e11226] font-semibold">The Story</p>
						<h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0f0f10] leading-[1.02] tracking-tight">
							A sip that <span className="italic text-[#e11226]">feels</span> like sunset.
						</h2>
						<div className="mt-6 max-w-md space-y-4 text-[#0f0f10]/70 leading-relaxed">
							<p>
								We start with cold-pressed aloe vera and finish with prebiotic fibers that love your gut back.
								Every can is poured with the same idea: feel-good fizz, no compromises, no artificial
								anything.
							</p>
							<p className="font-serif italic text-2xl text-[#0f0f10] leading-snug pt-2">
								&ldquo;Confidence is the best ingredient. We just add bubbles.&rdquo;
							</p>
						</div>
						<div className="mt-10 flex items-center gap-6">
							<YnsLink
								href="/products"
								className="inline-flex items-center justify-center h-11 px-8 bg-[#0f0f10] text-[#fbf6ec] rounded-full text-xs tracking-[0.28em] uppercase font-semibold hover:bg-[#e11226] transition-colors"
							>
								Discover More
							</YnsLink>
							<span className="text-[10px] tracking-[0.3em] uppercase text-[#0f0f10]/50">
								— Made in Sunshine, CA
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
