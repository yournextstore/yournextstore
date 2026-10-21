import { cn } from "@/lib/utils";

/**
 * The strip between the header and a full-bleed listing: the page name on the left in the nav's
 * size, controls on the right. Fixed heights on both rows keep the controls (which stream in
 * behind Suspense) from moving anything when they land.
 */
export function ListingBar({
	title,
	note,
	children,
	className,
}: {
	title: string;
	note?: string;
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-wrap items-end justify-between gap-x-8 gap-y-3 px-4 pb-5 pt-6 md:px-[2vw] md:pt-[3vw]",
				className,
			)}
		>
			<div className="min-w-0">
				<h1 className="text-nav wrap-break-word">{title}</h1>
				{note ? <p className="mt-1 text-foot leading-normal text-muted-foreground">{note}</p> : null}
			</div>
			{children ? <div className="flex h-8 w-full items-center gap-6 sm:w-auto">{children}</div> : null}
		</div>
	);
}

/** Static stand-in for the controls row: the real ones read useSearchParams and cannot prerender. */
export function ListingControlsFallback() {
	return <div aria-hidden="true" className="h-8 w-40" />;
}
