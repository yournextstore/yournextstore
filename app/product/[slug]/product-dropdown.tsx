import { ChevronDown } from "lucide-react";

/** The original's "Description / Product Details / Delivery Details" rows: a hairline and a chevron. */
export function ProductDropdown({
	title,
	defaultOpen = false,
	children,
}: {
	title: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	return (
		<details className="group" open={defaultOpen}>
			<summary className="flex h-14 cursor-pointer list-none items-center justify-between border-b border-black/30 text-base text-black/95 [&::-webkit-details-marker]:hidden">
				{title}
				<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
			</summary>
			<div className="mt-4 mb-2 text-sm leading-relaxed">{children}</div>
		</details>
	);
}
