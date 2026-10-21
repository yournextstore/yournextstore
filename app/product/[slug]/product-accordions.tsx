import { ChevronDown, NotebookText, Truck } from "lucide-react";
import type { ComponentProps } from "react";
import { TiptapRenderer } from "@/components/tiptap-renderer";

type ProductAccordionsProps = {
	content: ComponentProps<typeof TiptapRenderer>["content"] | null;
};

/** The original's two <details> rows (icon, bold title, chevron), with the product's own copy. */
export function ProductAccordions({ content }: ProductAccordionsProps) {
	const rows = [
		...(content
			? [
					{
						title: "Details",
						icon: NotebookText,
						body: (
							<div className="prose prose-sm max-w-none text-zinc-600 tiptap-content">
								<TiptapRenderer content={content} />
							</div>
						),
					},
				]
			: []),
		{
			title: "Shipping",
			icon: Truck,
			body: <p>Delivery options and their costs for your address are shown at checkout, before you pay.</p>,
		},
	];

	return (
		<div className="mt-8 grid">
			<h2 className="sr-only">More about this product</h2>
			{rows.map((row, index) => (
				<details key={row.title} className={`group border-t ${index === rows.length - 1 ? "border-b" : ""}`}>
					<summary className="flex cursor-pointer items-center justify-between px-1 py-3 font-bold text-zinc-700">
						<span className="flex items-center gap-2">
							<row.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
							{row.title}
						</span>
						<ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden />
					</summary>
					<div className="p-4 text-sm text-zinc-600">{row.body}</div>
				</details>
			))}
		</div>
	);
}
