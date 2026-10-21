import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = { href?: string; label: string };

/**
 * The template's page head: a centred breadcrumb, a large light title and a muted count.
 * Below 640px only the parent crumb shows, prefixed with "←" (UIkit theme rule).
 */
export function PageHeading({
	crumbs,
	title,
	subtitle,
	className,
}: {
	crumbs: Crumb[];
	title: string;
	subtitle?: string | null;
	className?: string;
}) {
	const parentIndex = crumbs.length - 2;
	return (
		<div className={cn("px-[15px] pt-5 pb-5 text-center sm:pt-10 lg:pb-[30px]", className)}>
			<nav aria-label="Breadcrumb">
				<ol className="flex flex-wrap items-center justify-center text-uk-sm text-muted-foreground">
					{crumbs.map((crumb, index) => (
						<li
							key={`${crumb.label}-${index}`}
							className={cn(index === parentIndex ? "inline-flex" : "hidden sm:inline-flex", "items-center")}
						>
							{index > 0 && (
								<span aria-hidden className="mx-5 hidden sm:inline">
									/
								</span>
							)}
							{index === parentIndex && (
								<span aria-hidden className="mr-[10px] sm:hidden">
									←
								</span>
							)}
							{crumb.href ? (
								<Link href={crumb.href} className="transition-colors hover:text-foreground">
									{crumb.label}
								</Link>
							) : (
								<span aria-current="page" className="text-foreground">
									{crumb.label}
								</span>
							)}
						</li>
					))}
				</ol>
			</nav>
			<h1 className="mx-auto mt-[10px] max-w-[1000px] text-[1.75rem] leading-tight wrap-break-word sm:text-uk-h1">
				{title}
			</h1>
			{subtitle && <p className="mt-[5px] text-uk-sm text-muted-foreground">{subtitle}</p>}
		</div>
	);
}
