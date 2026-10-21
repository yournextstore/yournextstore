import type { ReactNode } from "react";

/** The original's listing head: a big light title on the left, here with the sort/filter tools beside it. */
export function ListingHeader({
	title,
	subtitle,
	tools,
}: {
	title: string;
	subtitle?: string | null;
	tools?: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-4 pt-4 pb-8 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
			<div className="min-w-0">
				<h1 className="text-5xl leading-tight font-light wrap-break-word text-foreground">{title}</h1>
				{subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>}
			</div>
			{tools && <div className="flex w-full items-center gap-3 sm:w-auto sm:shrink-0">{tools}</div>}
		</div>
	);
}

/** Same box as the real sort/filter tools, for Suspense fallbacks (they read useSearchParams). */
export function ToolsSkeleton({ filters = true }: { filters?: boolean }) {
	return (
		<>
			{filters && <div aria-hidden className="h-9 w-24 border border-[#111]/30" />}
			<div aria-hidden className="h-9 w-44 border border-[#111]/30" />
		</>
	);
}
