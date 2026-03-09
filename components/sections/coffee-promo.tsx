import Image from "next/image";
import { YnsLink } from "../yns-link";

export function CoffeePromo() {
	return (
		<section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
				{/* Left: Product images grid */}
				<div className="grid grid-cols-2 gap-3">
					<div className="relative aspect-square">
						<Image
							src="/scraped-0.png"
							alt="Coffee making"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 50vw, 25vw"
						/>
					</div>
					<div className="relative aspect-square">
						<Image
							src="/scraped-1.png"
							alt="Insulated bottle"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 50vw, 25vw"
						/>
					</div>
					<div className="relative aspect-square">
						<Image
							src="/scraped-2.png"
							alt="Canvas pouch"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 50vw, 25vw"
						/>
					</div>
					<div className="relative aspect-square">
						<Image
							src="/scraped-14.png"
							alt="Desk accessories"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 50vw, 25vw"
						/>
					</div>
				</div>

				{/* Right: Text content */}
				<div className="flex flex-col items-center justify-center bg-secondary px-8 py-16 lg:px-16 text-center">
					<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">new</span>
					<h2 className="font-heading text-3xl sm:text-4xl text-foreground tracking-wide mb-4">
						coffee making essentials
					</h2>
					<p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
						Discover our branded collection of coffee making must have accessories.
					</p>
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="inline-flex items-center border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
					>
						Shop now
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
