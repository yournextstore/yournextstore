import Image from "next/image";
import { YnsLink } from "../yns-link";

type ShopTheLookProps = {
	outfitImage: string;
	outfitAlt: string;
	flipped?: boolean;
};

export function ShopTheLook({ outfitImage, outfitAlt, flipped = false }: ShopTheLookProps) {
	return (
		<section className="py-14 sm:py-20 bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div
					className={`flex flex-col ${flipped ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-center`}
				>
					<div className="w-full lg:w-1/2">
						<div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
							<Image
								src={outfitImage}
								alt={outfitAlt}
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div className="absolute bottom-4 left-4">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="inline-flex items-center gap-2 bg-background/90 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-background transition-colors"
								>
									View Products
								</YnsLink>
							</div>
						</div>
					</div>
					<div className="w-full lg:w-1/2 space-y-4">
						<h3 className="font-heading text-2xl font-medium mb-6">Shop the Look</h3>
						<div className="grid grid-cols-2 gap-4">
							{Array.from({ length: 2 }).map((_, i) => (
								<div key={`look-placeholder-${i}`} className="group">
									<div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-3">
										<div className="w-full h-full bg-secondary" />
									</div>
									<p className="text-sm font-medium text-foreground">Featured Item</p>
									<p className="text-sm text-muted-foreground">$180.00</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
