import Image from "next/image";
import { YnsLink } from "../yns-link";

export function HeritageStory() {
	return (
		<section id="about" className="bg-[#fbe5ea] py-20 sm:py-28 relative overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_20%,rgba(217,164,65,0.18)_0%,transparent_60%),radial-gradient(50%_40%_at_10%_90%,rgba(184,30,38,0.15)_0%,transparent_60%)]"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				<div className="grid grid-cols-2 gap-4">
					<div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#f4c2cb]">
						<Image
							src="/scraped-3.jpg"
							alt="Heritage spice tins arranged like a tower"
							fill
							sizes="(max-width: 1024px) 50vw, 25vw"
							className="object-cover"
						/>
					</div>
					<div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#b81e26] mt-12">
						<Image
							src="/scraped-4.jpg"
							alt="Levantine breakfast spread"
							fill
							sizes="(max-width: 1024px) 50vw, 25vw"
							className="object-cover"
						/>
					</div>
				</div>
				<div className="lg:pl-6">
					<p className="text-[11px] uppercase tracking-[0.3em] text-[#b81e26] font-semibold">Our heritage</p>
					<h2 className="mt-3 font-display italic text-4xl sm:text-5xl text-[#7a0e15] leading-[1.05]">
						Recipes carried from the kitchens of Beirut, Aleppo &amp; Marrakech.
					</h2>
					<p className="mt-6 text-[15px] leading-relaxed text-[#2b2120]/80 max-w-lg">
						Every tin we send begins with a family. We work with third-generation millers, spice traders and
						pomegranate farmers across the Levant and the Maghreb, paying fair-trade rates so the old ways
						stay alive a little longer.
					</p>
					<p className="mt-4 text-[15px] leading-relaxed text-[#2b2120]/80 max-w-lg">
						No flavor extracts. No filler salt. Just the things you&apos;d find in our grandmother&apos;s jars
						— only fresher, and beautifully tinned for your shelf.
					</p>
					<YnsLink
						href="#impact"
						className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#b81e26] hover:text-[#7a0e15]"
					>
						<span className="hayati-star" /> Read our impact report
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
