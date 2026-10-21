import { type CardProduct, ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";
import { CallToActionModule, type CallToActionProps } from "./call-to-action";
import { CalloutModule, type CalloutProps } from "./callout";
import { CollectionModule, type CollectionModuleProps } from "./collection";

export type GridItem =
	| { kind: "product"; key: string; product: CardProduct; imageOnly?: boolean }
	| ({ kind: "collection"; key: string } & CollectionModuleProps)
	| ({ kind: "callToAction"; key: string } & CallToActionProps)
	| ({ kind: "callout"; key: string } & CalloutProps);

// The original's signature rhythm: a two-column grid whose cards cycle through these widths,
// alignments and one vertical offset, so no two rows sit alike.
const PRODUCT_LAYOUT = [
	{ align: "items-start justify-start", offset: false, width: "md" },
	{ align: "items-start justify-end", offset: false, width: "lg" },
	{ align: "items-start justify-start", offset: false, width: "lg" },
	{ align: "items-center justify-start", offset: false, width: "sm" },
	{ align: "items-start justify-end", offset: false, width: "md" },
	{ align: "items-start justify-end", offset: true, width: "md" },
	{ align: "items-start justify-start", offset: false, width: "lg" },
	{ align: "items-center justify-end", offset: false, width: "lg", landscape: true },
] as const;

const WIDTHS = {
	sm: "w-full md:w-[55%]",
	md: "w-full md:w-[65%]",
	lg: "w-full",
} as const;

const FULL_WIDTH = new Set<GridItem["kind"]>(["callout", "callToAction"]);

export function ModuleGrid({ items, priorityFirst = false }: { items: GridItem[]; priorityFirst?: boolean }) {
	return (
		<ul className="grid grid-cols-1 gap-[7.5vw] md:grid-cols-2">
			{items.map((item, index) => {
				const layout = PRODUCT_LAYOUT[index % PRODUCT_LAYOUT.length] ?? PRODUCT_LAYOUT[0];
				if (item.kind !== "product") {
					return (
						<li
							key={item.key}
							className={cn(
								"flex items-center justify-center overflow-hidden",
								FULL_WIDTH.has(item.kind) && "md:col-span-2",
							)}
						>
							<div className="w-full">
								{item.kind === "collection" && <CollectionModule {...item} />}
								{item.kind === "callToAction" && <CallToActionModule {...item} />}
								{item.kind === "callout" && <CalloutModule {...item} />}
							</div>
						</li>
					);
				}
				return (
					<li key={item.key} className={cn("flex", layout.align, layout.offset && "md:mt-[5vw]")}>
						<div className={WIDTHS[layout.width]}>
							<ProductCard
								product={item.product}
								imageOnly={item.imageOnly}
								priority={priorityFirst && index === 0}
								aspectClassName={"landscape" in layout ? "aspect-square md:aspect-video" : "aspect-square"}
								sizes={
									layout.width === "lg" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"
								}
							/>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
