import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { href?: string; label: string };

/** The original's breadcrumb row: dark links, a pale slash, the current page in grey. */
export function Crumbs({ items }: { items: Crumb[] }) {
	return (
		<nav aria-label="Breadcrumb" className="pt-6">
			<ol className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						{index > 0 ? (
							<li aria-hidden className="text-[#d1d5db]">
								/
							</li>
						) : null}
						<li className="min-w-0">
							{item.href ? (
								<Link href={item.href} className="text-[#111827] hover:text-muted-foreground">
									{item.label}
								</Link>
							) : (
								<span aria-current="page" className="text-muted-foreground">
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
