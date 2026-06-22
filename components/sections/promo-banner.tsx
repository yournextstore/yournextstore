import Image from "next/image";
import { YnsLink } from "../yns-link";

export function PromoBanner() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<YnsLink
					prefetch={"eager"}
					href="#products"
					className="group relative overflow-hidden h-52 sm:h-64 flex items-center bg-gold"
				>
					<Image
						src="/scraped-2.jpg"
						alt="Flash sale"
						fill
						className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
					/>
					<div className="relative z-10 p-8 text-center w-full">
						<p className="text-[#1a1a1a]/70 text-xs uppercase tracking-widest font-medium">
							High Quality Products
						</p>
						<h3 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#1a1a1a] uppercase mt-1">
							Flash Sale
						</h3>
						<p className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-[#1a1a1a] mt-2">
							75<span className="text-2xl">%</span> OFF
						</p>
						<span className="inline-block mt-3 bg-[#1a1a1a] text-white px-6 py-2 text-sm font-bold uppercase tracking-wider">
							Shop Now
						</span>
					</div>
				</YnsLink>

				<YnsLink
					prefetch={"eager"}
					href="#products"
					className="group relative overflow-hidden h-52 sm:h-64 flex items-center bg-gold"
				>
					<Image
						src="/scraped-3.jpg"
						alt="Clearance"
						fill
						className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
					/>
					<div className="relative z-10 p-8 text-center w-full">
						<p className="text-[#1a1a1a]/70 text-xs uppercase tracking-widest font-medium">
							Limited Time Offer
						</p>
						<h3 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[#1a1a1a] uppercase mt-1">
							Clearance
						</h3>
						<p className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-[#1a1a1a] mt-2">
							75<span className="text-2xl">%</span> OFF
						</p>
						<span className="inline-block mt-3 bg-[#1a1a1a] text-white px-6 py-2 text-sm font-bold uppercase tracking-wider">
							Shop Now
						</span>
					</div>
				</YnsLink>
			</div>
		</section>
	);
}
