import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function HydrateSkin() {
	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
					<div className="relative aspect-[4/5] overflow-hidden rounded-sm">
						<Image
							src="/scraped-10.png"
							alt="Hydrate your skin"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
					<div className="space-y-6">
						<h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
							Hydrate Your Skin
						</h2>
						<p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
							Experience the ultimate relief from dryness with our luxurious gel formulas. Designed to
							penetrate deeply into your skin layers, they deliver a calming, soothing sensation for
							long-lasting hydration.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-block border-2 border-foreground px-8 py-3 text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-primary-foreground"
						>
							Shop Cleanser
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
