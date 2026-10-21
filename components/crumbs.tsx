import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Home › … › current. Links in ink, the current page in grey, thin chevrons between. */
export function Crumbs({ items, className }: { items: Crumb[]; className?: string }) {
	return (
		<nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
			<ol className="flex flex-wrap items-center gap-y-1 text-sm">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					return (
						<Fragment key={`${item.label}-${index}`}>
							{index > 0 && (
								<li aria-hidden className="mx-2 flex items-center text-gray-400 sm:mx-3">
									<ChevronRight className="size-4" />
								</li>
							)}
							<li className="flex min-w-0 items-center">
								{isLast || !item.href ? (
									<span aria-current={isLast ? "page" : undefined} className="text-muted-foreground">
										{item.label}
									</span>
								) : (
									<Link href={item.href} className="text-ink transition-colors hover:text-ink/70">
										{item.label}
									</Link>
								)}
							</li>
						</Fragment>
					);
				})}
			</ol>
		</nav>
	);
}
