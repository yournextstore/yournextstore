import Link from "next/link";

/** Mono path line ("Home / Catalogue / Sunbeam Tote"), as the original's guide page heads its back link. */
export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
	return (
		<nav aria-label="Breadcrumb" className="hs-mono text-[0.72rem] uppercase tracking-[0.12em] text-faint">
			<ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
				{items.map((item, index) => (
					<li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
						{index > 0 && <span aria-hidden="true">/</span>}
						{item.href ? (
							<Link href={item.href} className="hover:text-signal">
								{item.label}
							</Link>
						) : (
							<span aria-current="page" className="truncate text-foreground">
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
