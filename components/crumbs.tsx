import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** The original's spaced uppercase trail: "Home / Products / Category / Item", the current page in earth. */
export function Crumbs({ items, className }: { items: Crumb[]; className?: string }) {
	return (
		<nav aria-label="Breadcrumb" className={cn("font-body text-xs uppercase tracking-widest", className)}>
			<ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-earth-soft">
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						{index > 0 && (
							<li aria-hidden="true" className="select-none">
								/
							</li>
						)}
						<li className="min-w-0">
							{item.href ? (
								<Link href={item.href} className="transition-colors hover:text-crimson">
									{item.label}
								</Link>
							) : (
								<span aria-current="page" className="text-earth">
									{item.label}
								</span>
							)}
						</li>
					</Fragment>
				))}
			</ol>
		</nav>
	);
}
