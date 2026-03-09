import Image from "next/image";
import { YnsLink } from "../yns-link";

export function FeaturedProduct() {
	return (
		<section className="py-16 sm:py-24 bg-[#5aff24]">
			<div className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Product image */}
					<div className="relative aspect-square max-w-lg mx-auto lg:mx-0 rounded-md border-[3px] border-black shadow-[8px_8px_0_0_#000] overflow-hidden bg-white">
						<Image src="/scraped-7.jpg" alt="Product of the month" fill className="object-cover" />
						<div className="absolute top-4 right-4 bg-[#ff2524] text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full border-2 border-black shadow-[3px_3px_0_0_#000] rotate-[8deg]">
							New!
						</div>
					</div>

					{/* Product info */}
					<div>
						<span className="text-xs font-bold uppercase tracking-widest text-black/60 mb-2 block">
							Product of the month
						</span>
						<h2 className="font-[family-name:var(--font-prompt)] text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-[0.9] mb-6">
							Crispy Chili Oil
						</h2>
						<p className="text-lg text-black/70 leading-relaxed mb-8 max-w-lg">
							Deliciously fiery and surprisingly versatile! Bold, aromatic chilies get a savory boost from
							garlic and shallots, while a hint of soy sauce adds a delightful umami depth. A must-have for
							everything from stir-fries to noodles.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="inline-flex items-center justify-center gap-2 h-14 px-10 bg-black text-white rounded-full text-base font-bold uppercase tracking-wide border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
						>
							Shop Now
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
