import Image from "next/image";
import { YnsLink } from "../yns-link";

export function BundleSection() {
	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-8 items-center">
					<div className="relative aspect-square rounded-xl overflow-hidden">
						<Image
							src="/scraped-0.jpg"
							alt="Skincare bundle"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>

					<div className="space-y-8">
						<div>
							<p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
								Shop skincare set
							</p>
							<h2 className="font-heading text-3xl sm:text-4xl font-light text-foreground">
								Level up skincare routine with the bundle
							</h2>
						</div>

						<div className="space-y-4">
							{[
								{ num: 1, name: "Rejuvenating Night Oil", price: "$79.00", image: "/scraped-6.jpg" },
								{ num: 2, name: "Brightening Sheet Mask", price: "$29.00", image: "/scraped-7.jpg" },
								{ num: 3, name: "Botanical Cleanser", price: "$79.00", image: "/scraped-3.jpg" },
							].map((item) => (
								<div key={item.num} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
									<span className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-primary-foreground text-sm font-medium">
										{item.num}
									</span>
									<div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
										<Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground truncate">{item.name}</p>
										<p className="text-sm text-muted-foreground">{item.price}</p>
									</div>
								</div>
							))}
						</div>

						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-primary-foreground text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
						>
							Shop Bundle
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
