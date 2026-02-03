import { cacheLife } from "next/cache";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { ProductCardSmall } from "./product-card";

type NewArrivalsProps = {
	limit?: number;
};

function NewArrivalsSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-x-6 gap-y-12">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i}>
					<Skeleton className="aspect-[4/5] mb-4" />
					<Skeleton className="h-5 w-24 mb-1" />
					<Skeleton className="h-4 w-16" />
				</div>
			))}
		</div>
	);
}

async function NewArrivalsProducts({ limit = 4 }: NewArrivalsProps) {
	"use cache";
	cacheLife("minutes");

	const products = await commerce.productBrowse({ active: true, limit });

	if (products.data.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-2 gap-x-6 gap-y-12">
			{products.data.map((product) => (
				<ProductCardSmall key={product.id} product={product} />
			))}
		</div>
	);
}

export function NewArrivals({ limit = 4 }: NewArrivalsProps) {
	return (
		<section className="w-full relative z-50 bg-secondary overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left - Large hero image */}
				<div className="relative min-h-[500px] lg:min-h-[800px] w-full overflow-hidden order-1 lg:order-1">
					<Image
						alt="New Collection Banner"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQEkpui6fJgW9o7yR-T_4_9sZsxproCJ5njHANk8Xetb1UnG911H8Tv7MvIiUW8A-cDi9n-TCgFoczEcdogWXRX1SpH2pI8iQXDjOxbbwMiOLbBkI6TBMkPH3hEo7WWWkpI3oONwocSRebOE52Enu-dEtFTOfF8F1u0FB5Q7bMcBl5GMYlIZRtZDGr6sA8Q-wKp2zz24Ic6u5YEw3EDWEhOFP-q8nN0bgkGT_bdiKFGTR_D78zin_M9Vt586EGaAD7o7-veYWBogN0=s1600"
						fill
						priority
						quality={95}
						className="object-cover object-top lg:object-center hover:scale-105 transition-transform duration-[2s]"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
					<div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
				</div>

				{/* Right - Content and products */}
				<div className="p-8 md:p-16 xl:p-24 flex flex-col justify-center order-2 lg:order-2">
					<div className="mb-12">
						<span className="text-xs font-semibold tracking-widest text-primary uppercase mb-2 block">
							Just Launched
						</span>
						<h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">New Arrivals</h2>
						<p className="text-muted-foreground font-light text-lg leading-relaxed mb-8 max-w-md">
							Discover our latest formulations, crafted with potent botanicals and cutting-edge science to
							rejuvenate your skin from within.
						</p>
						<YnsLink
							href="/collection/all"
							className="inline-block text-sm font-medium tracking-wide hover:text-primary transition-colors border-b border-foreground hover:border-primary pb-1"
						>
							EXPLORE COLLECTION
						</YnsLink>
					</div>

					<Suspense fallback={<NewArrivalsSkeleton />}>
						<NewArrivalsProducts limit={limit} />
					</Suspense>
				</div>
			</div>
		</section>
	);
}
