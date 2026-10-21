import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export type Crumb = { href?: string; label: string };

/** Breadcrumb trail ("Home Page / …") from 640px; a single "Back to …" link on phones. */
export function Crumbs({ items }: { items: Crumb[] }) {
	const parent = items.findLast((item) => item.href);
	return (
		<nav aria-label="Breadcrumb" className="text-lead">
			<ol className="hidden flex-wrap items-center gap-x-4 gap-y-1 sm:flex">
				{items.map((item, index) => (
					<li key={item.label} className="flex items-center gap-4">
						{index > 0 && (
							<span aria-hidden="true" className="text-foreground">
								/
							</span>
						)}
						{item.href ? (
							<Link href={item.href} className="hover:underline hover:underline-offset-4">
								{item.label}
							</Link>
						) : (
							<span aria-current="page" className="text-muted-foreground">
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
			{parent?.href && (
				<Link href={parent.href} className="flex items-center gap-2 text-copy sm:hidden">
					<ArrowLeftIcon className="size-[1.125rem]" />
					Back to {parent.label}
				</Link>
			)}
		</nav>
	);
}

/** Listing page head: crumbs, then the 48px page title. */
export function ListingHead({ crumbs, title }: { crumbs: Crumb[]; title: string }) {
	return (
		<div className="shell flex flex-col gap-6 pt-8 sm:pt-11">
			<Crumbs items={crumbs} />
			<h1 className="wrap-break-word text-heading-lg md:text-heading-xl">{title}</h1>
		</div>
	);
}

export const listingGrid = "grid w-full grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2 large:grid-cols-3";
