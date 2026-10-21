import { HouseIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { href?: string; label: string };

/** The original's page banner: a soft grey fade with the title and a "⌂ > Page" trail. */
export function PageHeader({ title, crumbs }: { title: string; crumbs: Crumb[] }) {
	return (
		<section className="cp-page-header">
			<div className="shell py-12 text-center md:py-14">
				<h1 className="cp-h1 mb-4 [overflow-wrap:anywhere]">{title}</h1>
				<nav aria-label="Breadcrumb">
					<ol className="flex flex-wrap items-center justify-center gap-x-1 text-sm text-body-text">
						<li>
							<Link href="/" aria-label="Home" className="flex items-center text-ink hover:opacity-70">
								<HouseIcon aria-hidden className="size-4" />
							</Link>
						</li>
						{crumbs.map((crumb) => (
							<Fragment key={crumb.label}>
								<li aria-hidden className="px-0.5">
									&gt;
								</li>
								<li>
									{crumb.href ? (
										<Link href={crumb.href} className="hover:text-ink">
											{crumb.label}
										</Link>
									) : (
										<span aria-current="page">{crumb.label}</span>
									)}
								</li>
							</Fragment>
						))}
					</ol>
				</nav>
			</div>
		</section>
	);
}

/** Skeleton twin of the banner (same height) for streamed pages. */
export function PageHeaderSkeleton() {
	return (
		<section className="cp-page-header">
			<div className="shell flex flex-col items-center py-12 md:py-14">
				<div className="mb-4 h-[2.58rem] w-64 animate-pulse rounded bg-light md:h-[3.58rem]" />
				<div className="h-5 w-32 animate-pulse rounded bg-light" />
			</div>
		</section>
	);
}
