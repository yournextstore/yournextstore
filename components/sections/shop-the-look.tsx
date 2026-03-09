import Image from "next/image";
import { YnsLink } from "../yns-link";

export function ShopTheLook() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative h-[500px] sm:h-[600px]">
				<Image
					src="/scraped-6.png"
					alt="Shop the look — lifestyle scene with premium tumbler"
					fill
					className="object-cover"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-black/20" />

				{/* Floating product card */}
				<div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 bg-white rounded-2xl p-4 shadow-xl max-w-xs">
					<div className="flex gap-3">
						<div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
							<Image src="/scraped-10.png" alt="Travel tumbler" fill className="object-cover" sizes="64px" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">Wide Mouth Travel Bottle</h4>
							<p className="text-xs text-muted-foreground mt-1">Cupholder-friendly design</p>
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="text-xs font-medium text-foreground underline mt-2 inline-block"
							>
								Shop now
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
