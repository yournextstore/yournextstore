import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[#eef2f5]">
			<div className="max-w-7xl mx-auto">
				<div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
					{/* Left: Image collage */}
					<div className="relative h-[350px] lg:h-auto overflow-hidden">
						<Image
							src="/scraped-1.png"
							alt="People enjoying premium drinkware"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#eef2f5]/30 lg:hidden" />
					</div>

					{/* Right: Text content */}
					<div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-20">
						<div className="space-y-2">
							<h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground leading-[1.1]">
								Minimal <span className="italic font-light text-muted-foreground">Aesthetic</span>
							</h1>
						</div>

						<div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
							<span className="uppercase tracking-widest text-xs font-medium">Our Feature</span>
						</div>

						<p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-sm">
							Made from food-grade stainless steel and BPA-free components, ensuring safety and durability.
						</p>

						<div className="mt-8 flex items-end gap-4">
							<div className="flex items-baseline gap-2">
								<span className="text-4xl font-light text-foreground">12 - 24</span>
								<span className="text-sm text-muted-foreground">Hours</span>
							</div>
						</div>

						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
							>
								Shop Collection
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
