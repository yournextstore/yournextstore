import Link from "next/link";
import { Fragment } from "react";

/** The original's breadcrumb: uppercase, tracked, slash-separated. */
export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
	return (
		<nav aria-label="Breadcrumb" className="py-6">
			<ol className="flex min-w-0 flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						{index > 0 && (
							<li aria-hidden className="select-none">
								/
							</li>
						)}
						<li className="min-w-0">
							{item.href ? (
								<Link href={item.href} className="transition-colors hover:text-foreground">
									{item.label}
								</Link>
							) : (
								<span
									aria-current="page"
									className="block max-w-[14rem] truncate text-foreground sm:max-w-xs"
								>
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
