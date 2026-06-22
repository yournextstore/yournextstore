import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="ingredients" className="bg-[#ece4d2] paper-grain">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
					<div className="relative aspect-[4/5] w-full overflow-hidden">
						<Image
							src="/scraped-1.jpg"
							alt="Apothecary flat-lay: amber supplement bottle, dried medicinal mushrooms, rosemary, honey"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
					<div className="max-w-xl">
						<p className="font-label text-clay" style={{ color: "#8b7560" }}>
							OUR SOURCING
						</p>
						<h2 className="font-editorial text-3xl sm:text-4xl lg:text-[44px] font-medium text-foreground leading-[1.1] mt-4">
							Wild-harvested. <em className="not-italic text-[#4a5bc4]">Science-backed.</em>
						</h2>
						<p className="mt-6 text-foreground/75 text-lg leading-relaxed">
							We work directly with small mycology farms in the Pacific Northwest and Yunnan. Every batch is
							dual-extracted, third-party tested for beta-glucans, and milled within 72 hours of harvest.
						</p>
						<blockquote className="mt-8 pl-5 border-l-2 border-[#4a5bc4] font-editorial text-xl italic text-foreground/85 leading-relaxed">
							&ldquo;Mushrooms aren&rsquo;t a trend — they&rsquo;re a 5,000-year-old practice we&rsquo;re
							finally taking seriously.&rdquo;
						</blockquote>
						<p className="mt-3 font-label text-[11px] text-clay" style={{ color: "#8b7560" }}>
							— DR. M. HARLOW, LEAD FORMULATOR
						</p>
						<div className="mt-10">
							<YnsLink
								href="/products"
								className="inline-flex items-center font-label text-[11px] text-foreground/80 hover:text-[#4a5bc4] transition-colors border-b border-foreground/30 hover:border-[#4a5bc4] pb-1"
							>
								Read the full sourcing brief
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
