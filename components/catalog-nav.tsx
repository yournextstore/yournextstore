import Link from "next/link";
import { getCatalogNav } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** The original's left list: a "Products" heading over each group with its count in superscript. */
export async function CatalogNav({ current, className }: { current?: string; className?: string }) {
	const entries = await getCatalogNav();

	return (
		<nav aria-label="Product groups" className={className}>
			<p className="mb-3 text-title font-medium">Products</p>
			<ul className="flex flex-col">
				{entries.map((entry) => (
					<li key={entry.key}>
						<Link
							href={entry.href}
							aria-current={current === entry.key ? "page" : undefined}
							className={cn(
								"inline-block pb-1 text-body hover:underline",
								current === entry.key && "font-bold",
							)}
						>
							{entry.name}
							<sup className="ml-px text-[0.6875rem]">{entry.count}</sup>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
