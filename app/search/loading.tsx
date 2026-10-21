import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

export default function SearchLoading() {
	return (
		<section className="pt-[30px]">
			<div className="h-16 rounded-xl bg-flash-white" />
			<div className="mt-6">
				<ProductGridSkeleton />
			</div>
		</section>
	);
}
