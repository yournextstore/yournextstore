import Link from "next/link";
import { type CardProduct, DISPLAY_GRID, DisplayCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

/** The original's "display" block: big heading, underlined "See All", three-up showcase grid. */
export function ProductGrid({
	title,
	products,
	viewAllHref,
	viewAllLabel = "See All",
	className,
	priorityFirst = false,
}: {
	title: string;
	products: CardProduct[];
	viewAllHref?: string;
	viewAllLabel?: string;
	className?: string;
	priorityFirst?: boolean;
}) {
	if (products.length === 0) return null;

	return (
		<section className={cn("mt-14 md:mx-0 md:mt-24 lg:mx-[50px]", className)}>
			<div className="mb-5 flex items-center justify-between gap-4">
				<h2 className="text-[1.625rem] font-medium leading-tight sm:text-sal-xl">{title}</h2>
				{viewAllHref && (
					<Link
						href={viewAllHref}
						className="shrink-0 text-[1.125rem] font-bold underline underline-offset-2"
					>
						{viewAllLabel}
						<span className="sr-only"> {title}</span>
					</Link>
				)}
			</div>
			<div className={DISPLAY_GRID}>
				{products.map((product, index) => (
					<DisplayCard key={product.id} product={product} priority={priorityFirst && index === 0} />
				))}
			</div>
		</section>
	);
}

export function ProductGridSkeletonSection({ count = 6 }: { count?: number }) {
	return (
		<section className="mt-14 md:mt-24 lg:mx-[50px]">
			<div className="mb-5 flex items-center justify-between">
				<div className="h-9 w-64 animate-pulse bg-secondary" />
				<div className="h-6 w-16 animate-pulse bg-secondary" />
			</div>
			<div className={DISPLAY_GRID}>
				{Array.from({ length: count }, (_, i) => (
					<div key={`s-${i}`} className="border border-border">
						<div className="h-[200px] animate-pulse bg-tile" />
						<div className="p-5">
							<div className="h-[30px] w-1/2 animate-pulse bg-secondary" />
							<div className="mt-1 h-[21px] w-1/3 animate-pulse bg-secondary" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
