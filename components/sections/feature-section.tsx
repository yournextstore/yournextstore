import Image from "next/image";

export function FeatureSection() {
	return (
		<section className="py-20 sm:py-28 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section header */}
				<div className="text-center mb-16">
					<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
						Featured Product
					</span>
					<h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
						Perfect for drinks
					</h2>
				</div>

				{/* Feature grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
					{/* Left features */}
					<div className="space-y-10">
						<FeatureItem icon="/scraped-12.png" title="Durable powder-coated body finish" />
						<FeatureItem icon="/scraped-13.png" title="Soft rubber base for quiet placement" />
					</div>

					{/* Center image */}
					<div className="flex justify-center">
						<div className="relative w-[280px] h-[380px]">
							<Image
								src="/scraped-8.png"
								alt="Premium bottle product shot"
								fill
								className="object-contain"
								sizes="280px"
							/>
						</div>
					</div>

					{/* Right features */}
					<div className="space-y-10">
						<FeatureItem icon="/scraped-14.png" title="Double-walled insulation keeps drinks hot" />
						<FeatureItem icon="/scraped-12.png" title="2-in-1 switch functions as both cup and lid" />
					</div>
				</div>
			</div>
		</section>
	);
}

function FeatureItem({ icon, title }: { icon: string; title: string }) {
	return (
		<div className="flex items-start gap-4">
			<div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
				<Image src={icon} alt="" width={20} height={20} className="object-contain" />
			</div>
			<p className="text-sm text-foreground leading-relaxed pt-2">{title}</p>
		</div>
	);
}
