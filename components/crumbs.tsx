import { ChevronRight, House } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

/** The original's breadcrumb: a house glyph, "Home", then chevron-separated steps. */
export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
	return (
		<nav aria-label="Breadcrumb" className="flex min-h-11 items-center py-3">
			<ol className="m-0 flex min-w-0 list-none flex-wrap items-center gap-x-2.5 gap-y-1 p-0 text-sm text-muted-foreground">
				<li className="flex items-center">
					<Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
						<House className="h-3.5 w-3.5" aria-hidden />
						Home
					</Link>
				</li>
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						<li aria-hidden className="flex items-center">
							<ChevronRight className="h-3.5 w-3.5" />
						</li>
						<li className="min-w-0 truncate">
							{item.href ? (
								<Link href={item.href} className="transition-colors hover:text-foreground">
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
