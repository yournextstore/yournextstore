import { Suspense } from "react";
import { About, EditorialParagraph } from "@/components/sections/about";
import { FAQHome } from "@/components/sections/faq-home";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="border-b hairline pb-6 mb-12">
				<div className="h-3 w-24 bg-[var(--cream-deep)] rounded mb-3 animate-pulse" />
				<div className="h-10 w-72 bg-[var(--cream-deep)] rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-[var(--cream-deep)] rounded-sm mb-4 animate-pulse" />
						<div className="h-4 w-2/3 bg-[var(--cream-deep)] rounded animate-pulse" />
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<EditorialParagraph />
			<About />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Featured products"
					description="Pieces in the season's quiet rotation."
					limit={8}
				/>
			</Suspense>
			<FAQHome />
			<Newsletter />
		</>
	);
}
