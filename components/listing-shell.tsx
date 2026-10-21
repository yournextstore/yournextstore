import { type ReactNode, Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

export function CountSkeleton() {
	return <span className="inline-flex h-[1lh] w-[2ch] animate-pulse rounded-lg bg-contrast-100" />;
}

/**
 * Soul's products-list section: a serif title with the result count in grey, the sort pill (and
 * the Filters button below lg) on the right, a filter sidebar and the product grid. The title
 * prerenders; every part that reads the URL streams behind a fallback of its own size.
 */
export function ListingShell({
	title,
	count,
	breadcrumbs,
	description,
	toolbar,
	sidebar,
	children,
}: {
	title: ReactNode;
	count?: ReactNode;
	breadcrumbs?: ReactNode;
	description?: ReactNode;
	toolbar?: ReactNode;
	sidebar?: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="container-soul py-10 sm:py-14 lg:py-12">
			{breadcrumbs}
			<div className="flex flex-wrap items-center justify-between gap-4 pt-6 pb-8">
				<div>
					<h1 className="flex flex-wrap items-baseline gap-x-2 text-3xl leading-none sm:text-4xl md:text-5xl">
						{title}
						{count}
					</h1>
					{description}
				</div>
				{/* Its own row on phones, so the streamed controls can never re-wrap the title row. */}
				{toolbar && (
					<div className="flex min-h-12 w-full gap-2 sm:w-auto">
						<Suspense
							fallback={<div className="h-12 w-[11rem] animate-pulse rounded-full bg-contrast-100" />}
						>
							{toolbar}
						</Suspense>
					</div>
				)}
			</div>
			<div className="flex items-stretch gap-8 lg:gap-10">
				{sidebar && (
					<div className="hidden w-52 shrink-0 lg:block xl:w-60">
						<Suspense>
							<div className="sticky top-24">{sidebar}</div>
						</Suspense>
					</div>
				)}
				<div className="min-h-svh min-w-0 flex-1">
					<Suspense fallback={<ProductGridSkeleton count={12} />}>{children}</Suspense>
				</div>
			</div>
		</div>
	);
}
