import { YnsLink } from "@/components/yns-link";

export function Sustainability() {
	return (
		<section id="sustainability" className="bg-editorial-warm paper-grain">
			<div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<div className="lg:col-span-7">
						<p className="font-eyebrow text-[10px] text-muted-foreground mb-6">— Slow fashion ethos —</p>
						<h2 className="font-serif font-light text-foreground leading-[1.02] tracking-tight text-[44px] sm:text-[60px] lg:text-[78px] xl:text-[88px]">
							Worn slowly,
							<br />
							<em className="not-italic text-taupe italic font-light text-foreground/70">made to outlast.</em>
						</h2>
					</div>
					<div className="lg:col-span-5 lg:pt-6">
						<p className="font-serif text-[20px] sm:text-[22px] leading-[1.55] text-foreground/85 font-light">
							Every Your Next Store piece is cut from organic linen, hand-loomed silk and traceable wool —
							dyed in small batches and finished by ateliers we know by name.
						</p>
						<p className="mt-6 text-[15px] leading-[1.75] text-muted-foreground">
							We design for ten-year wardrobes: garments engineered to soften with wear, to be mended, and to
							remain wearable long after the season has ended.
						</p>
						<div className="mt-10 flex items-center gap-6">
							<YnsLink href="#about" className="font-eyebrow text-[11px] text-foreground editorial-underline">
								Read the Ethos
							</YnsLink>
							<YnsLink
								href="/products"
								className="font-eyebrow text-[11px] text-muted-foreground editorial-underline"
							>
								Materials Index
							</YnsLink>
						</div>
					</div>
				</div>

				{/* Editorial stat strip */}
				<div className="mt-20 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 border-t border-border/70 pt-12">
					{[
						{ value: "100%", label: "Natural & organic fibres" },
						{ value: "12", label: "Family ateliers worldwide" },
						{ value: "0", label: "Synthetic dyes used" },
						{ value: "10yr", label: "Garment design horizon" },
					].map((stat) => (
						<div key={stat.label}>
							<p className="font-serif text-[44px] sm:text-[52px] font-light tracking-tight text-foreground leading-none">
								{stat.value}
							</p>
							<p className="mt-3 font-eyebrow text-[10px] text-muted-foreground max-w-[16ch]">{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
