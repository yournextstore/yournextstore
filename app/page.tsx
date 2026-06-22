import { Suspense } from "react";
import { Benefits } from "@/components/sections/benefits";
import { Categories } from "@/components/sections/categories";
import { Founder } from "@/components/sections/founder";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { QuizCta } from "@/components/sections/quiz-cta";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="bg-[#fef7f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex items-end justify-between mb-12">
					<div>
						<div className="h-6 w-32 bg-[#f7e4d4] rounded animate-pulse mb-3" />
						<div className="h-9 w-56 bg-[#f7e4d4] rounded animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={`skeleton-${i.toString()}`}>
							<div className="aspect-square bg-[#f7e4d4] rounded-[2rem] mb-4 animate-pulse" />
							<div className="space-y-2">
								<div className="h-5 w-3/4 bg-[#f7e4d4] rounded animate-pulse" />
								<div className="h-5 w-1/4 bg-[#f7e4d4] rounded animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<Categories />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Strips" limit={6} />
			</Suspense>
			<HowItWorks />
			<Benefits />
			<Ingredients />
			<Testimonials />
			<Founder />
			<QuizCta />
			<Newsletter />
		</>
	);
}
