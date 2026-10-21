import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

/** Original breadcrumb: muted links joined by ">", the current page at full ink. */
export function Crumbs({ items, className }: { items: Crumb[]; className?: string }) {
	return (
		<nav aria-label="Breadcrumb" className={className ?? "mb-2"}>
			<ol className="flex flex-wrap gap-x-2 text-foreground">
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						{index > 0 ? (
							<li aria-hidden="true" className="text-muted-foreground">
								&gt;
							</li>
						) : null}
						<li className="min-w-0">
							{item.href ? (
								<Link href={item.href} className="text-muted-foreground hover:text-foreground">
									{item.label}
								</Link>
							) : (
								<span aria-current="page">{item.label}</span>
							)}
						</li>
					</Fragment>
				))}
			</ol>
		</nav>
	);
}
