import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative">
			{/* Main hero banner with gradient background */}
			<div className="relative bg-gradient-to-br from-[#2d5016] via-[#3a6b1e] to-[#4a7c28] overflow-hidden">
				{/* SVG decorative background */}
				<div className="absolute inset-0 opacity-10">
					<Image src="/hero-bg-1.svg" alt="" fill className="object-cover" priority />
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
					<div className="max-w-2xl text-white">
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
							Premium Natural
							<br />
							Wellness Products
						</h1>
						<p className="mt-4 text-lg text-white/80 leading-relaxed max-w-lg">
							Discover our curated collection of natural health products, crafted from the finest ingredients
							for your wellbeing.
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white text-[#2d5016] rounded-lg text-base font-semibold hover:bg-white/90 transition-colors shadow-lg"
							>
								Shop Now
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 border-2 border-white/40 text-white rounded-lg text-base font-semibold hover:bg-white/10 transition-colors"
							>
								Browse All
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* Promotional cards grid - matching reference site's banner cards below hero */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<PromoBanner
						image="/scraped-0.png"
						title="Natural Oils"
						subtitle="Premium quality extracts"
						href="/products"
					/>
					<PromoBanner
						image="/scraped-3.png"
						title="Wellness"
						subtitle="Health & wellbeing essentials"
						href="/products"
					/>
					<PromoBanner
						image="/scraped-5.png"
						title="Skincare"
						subtitle="Natural cosmetics"
						href="/products"
					/>
					<PromoBanner
						image="/scraped-7.jpg"
						title="Food & Drink"
						subtitle="Organic superfoods"
						href="/products"
					/>
				</div>
			</div>
		</section>
	);
}

function PromoBanner({
	image,
	title,
	subtitle,
	href,
}: {
	image: string;
	title: string;
	subtitle: string;
	href: string;
}) {
	return (
		<YnsLink prefetch={"eager"} href={href} className="group relative overflow-hidden rounded-xl shadow-md">
			<div className="relative aspect-[4/3]">
				<Image
					src={image}
					alt={title}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 p-4">
					<h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
					<p className="text-white/70 text-sm mt-0.5">{subtitle}</p>
				</div>
			</div>
		</YnsLink>
	);
}
