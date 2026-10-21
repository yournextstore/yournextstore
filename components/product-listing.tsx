import { type GridItem, ModuleGrid } from "@/components/modules/module-grid";
import type { CardProduct } from "@/components/product-card";
import { picturedFirst } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Listing pages share the home page's staggered grid, one product per cell. */
export function ProductListing({
	products,
	priorityFirst = true,
}: {
	products: CardProduct[];
	priorityFirst?: boolean;
}) {
	// Products without a photograph sink to the end of the page rather than opening it with a blank cell.
	const items: GridItem[] = picturedFirst(products).map((product) => ({
		kind: "product",
		key: product.id,
		product,
	}));
	return <ModuleGrid items={items} priorityFirst={priorityFirst} />;
}

/** The original's listing title: oversized, flush left, no subtitle. */
export function ListingTitle({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<h1 className={cn("max-w-[60rem] pt-6 text-ui-3xl md:pt-9 md:text-ui-5xl", className)}>{children}</h1>
	);
}

export function ListingSkeleton() {
	return (
		<div aria-hidden="true">
			<div className="mb-8 flex justify-start md:justify-end">
				<div className="h-10 w-44 rounded-full bg-lightgray" />
			</div>
			<div className="grid grid-cols-1 gap-[7.5vw] md:grid-cols-2">
				<div className="aspect-square w-full rounded-md bg-lightgray md:w-[65%]" />
				<div className="aspect-square w-full rounded-md bg-lightgray" />
			</div>
		</div>
	);
}
