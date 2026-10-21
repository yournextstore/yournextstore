import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { href?: string; label: string };

/** Bootstrap-style breadcrumb from the original kit: green links, slash separators, grey current page. */
export function Crumbs({ items }: { items: Crumb[] }) {
	return (
		<nav aria-label="Breadcrumb" className="mt-4">
			<ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-fc-base">
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						{index > 0 ? (
							<li aria-hidden className="text-gray-500">
								/
							</li>
						) : null}
						<li className="min-w-0">
							{item.href ? (
								<Link href={item.href} className="text-green-600 transition hover:text-green-700">
									{item.label}
								</Link>
							) : (
								<span aria-current="page" className="text-gray-500">
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
