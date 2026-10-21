import type { ReactNode } from "react";

/** The original's listing band: royal violet, a small-caps kicker, a large serif title and a quiet line under it. */
export function ListingHeader({
	eyebrow,
	title,
	children,
}: {
	eyebrow: ReactNode;
	title: string;
	children?: ReactNode;
}) {
	return (
		<div className="bg-royal py-16 text-cream lg:py-20">
			<div className="mx-auto max-w-screen-xl px-6 lg:px-12">
				<div className="mb-3 font-body text-xs uppercase tracking-widest text-cream/80">{eyebrow}</div>
				<h1 className="font-display text-5xl text-cream wrap-break-word lg:text-7xl">{title}</h1>
				{children && <div className="mt-4 max-w-2xl font-body text-sm text-cream/80">{children}</div>}
			</div>
		</div>
	);
}

/** Skeleton of the band, the same height as the real one so the page does not shift when it lands. */
export function ListingHeaderSkeleton() {
	return (
		<div className="bg-royal py-16 lg:py-20">
			<div className="mx-auto max-w-screen-xl px-6 lg:px-12">
				<div className="mb-3 h-4 w-32 rounded bg-cream/10" />
				<div className="h-12 w-64 rounded bg-cream/10 lg:h-[4.5rem]" />
				<div className="mt-4 h-5 w-48 rounded bg-cream/10" />
			</div>
		</div>
	);
}
