import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** The kicker as a trail: "[ The range / Lighting ]" in ochre mono, slash separators. */
export function Crumbs({ items, className }: { items: Crumb[]; className?: string }) {
	return (
		<nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
			<ol className="flex flex-wrap items-center gap-x-2 before:content-['['] after:content-[']']">
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						{index > 0 && (
							<li aria-hidden="true" className="select-none">
								/
							</li>
						)}
						<li className="min-w-0">
							{item.href ? (
								<Link href={item.href} className="transition-colors">
									{item.label}
								</Link>
							) : (
								<span aria-current="page" className="text-ink">
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
