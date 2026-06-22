import { Suspense } from "react";
import { Benefits } from "@/components/sections/benefits";
import { Blog } from "@/components/sections/blog";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FAQs } from "@/components/sections/faqs";
import { Hero } from "@/components/sections/hero";
import { Impact } from "@/components/sections/impact";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="flex items-end justify-between mb-10">
				<div className="space-y-2">
					<div className="h-3 w-24 bg-secondary rounded animate-pulse" />
					<div className="h-9 w-72 bg-secondary rounded animate-pulse" />
					<div className="h-5 w-96 bg-secondary rounded animate-pulse" />
				</div>
				<div className="hidden sm:block h-10 w-44 bg-secondary rounded-full animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="rounded-2xl border border-border bg-card p-3">
						<div className="aspect-[4/3] bg-secondary rounded-xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/2 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Products" limit={6} />
			</Suspense>
			<Benefits />
			<Testimonials />
			<Impact />
			<Blog />
			<FAQs />
			<CtaBanner />
		</main>
	);
}
