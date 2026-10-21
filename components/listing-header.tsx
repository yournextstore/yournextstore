import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type Crumb = { href: string; label: string };

const sentenceCase = (label: string) => label.charAt(0).toUpperCase() + label.slice(1);

/** Breadcrumbs, a centred title and a hairline: the original's listing header. */
export function ListingHeader({
	crumbs,
	title,
	description,
}: {
	crumbs: Crumb[];
	title: string;
	description?: ReactNode;
}) {
	return (
		<div className="border-b border-border pb-8">
			<Breadcrumb className="pt-2">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
					</BreadcrumbItem>
					{crumbs.map((crumb, index) => (
						<Fragment key={crumb.href}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{index === crumbs.length - 1 ? (
									<BreadcrumbPage>{sentenceCase(crumb.label)}</BreadcrumbPage>
								) : (
									<BreadcrumbLink render={<Link href={crumb.href} />}>
										{sentenceCase(crumb.label)}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
			<h1 className="mt-10 text-center text-2xl sm:text-3xl">{sentenceCase(title)}</h1>
			{description ? (
				<div className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">{description}</div>
			) : null}
		</div>
	);
}

/** Placeholder with the toolbar's exact footprint, for the Suspense fallback. */
export function ListingToolbarSkeleton() {
	return (
		<div className="flex h-10 items-center justify-end gap-4">
			<div className="h-10 w-48 animate-pulse rounded-md bg-secondary" />
			<div className="h-10 w-28 animate-pulse rounded-md bg-secondary" />
		</div>
	);
}
