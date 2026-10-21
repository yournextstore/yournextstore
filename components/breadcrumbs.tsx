import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href: string };

/** Grey crumbs separated by small black dots; the current page is underlined. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
	return (
		<nav aria-label="Breadcrumb" className={className}>
			<ol className="no-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					return (
						<Fragment key={item.href}>
							<li>
								<Link
									href={item.href}
									aria-current={isLast ? "page" : undefined}
									className={cn(
										"text-sm text-neutral-600 hover:underline",
										isLast && "font-medium underline",
									)}
								>
									{item.label}
								</Link>
							</li>
							{!isLast && (
								<li aria-hidden="true" className="flex px-1.5">
									<svg aria-hidden="true" viewBox="0 0 8 8" className="size-1 fill-ink">
										<circle cx="4" cy="4" r="4" />
									</svg>
								</li>
							)}
						</Fragment>
					);
				})}
			</ol>
		</nav>
	);
}
