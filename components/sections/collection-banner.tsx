import Image from "next/image";
import { YnsLink } from "../yns-link";

export function CollectionBanner() {
	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
					<div className="relative aspect-[4/5] overflow-hidden bg-secondary">
						<Image
							src="/scraped-12.png"
							alt="Fall Collection"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>
					<div className="flex flex-col justify-center py-8 lg:py-0 lg:pl-8">
						<p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
							By <em className="font-bold not-italic">Your Next Store</em>
						</p>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight leading-tight">
							The new fall collection is focused on durability and functionality in both daily life and nature
							adventures.
						</h2>
						<div className="mt-8">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-block border-2 border-foreground text-foreground px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
							>
								Learn more
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
