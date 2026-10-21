import type { ReactNode } from "react";

/** GoCart's listing title: a muted lead word, then the strong one ("All Products"). */
export function ListingHeading({
	muted,
	strong,
	children,
}: {
	muted?: string;
	strong: string;
	children?: ReactNode;
}) {
	return (
		<div className="my-6">
			<h1 className="text-2xl text-slate-500">
				{muted && <>{muted} </>}
				<span className="font-medium text-slate-700">{strong}</span>
			</h1>
			{children}
		</div>
	);
}
