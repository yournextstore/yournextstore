import type { APIProductGetByIdResult } from "commerce-kit";
import Link from "next/link";
import type { ReactNode } from "react";
import { TiptapRenderer } from "@/components/tiptap-renderer";

type Product = NonNullable<APIProductGetByIdResult>;

/**
 * The product page's info panels, as in the original's bottom bar: <details> sharing one
 * `name`, so the browser opens one at a time without JavaScript. Each opens above the bar and
 * scrolls inside itself when long.
 */
export function ProductPanels({ product }: { product: Product }) {
	const options = [
		...new Set(product.variants.flatMap((variant) => variant.combinations.map((c) => c.variantValue.value))),
	];

	const panels: { label: string; content: ReactNode }[] = [
		...(product.content
			? [{ label: "Description", content: <TiptapRenderer content={product.content} /> }]
			: product.summary
				? [{ label: "Description", content: <p>{product.summary}</p> }]
				: []),
		...(product.category || options.length > 0
			? [
					{
						label: "Details",
						content: (
							<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
								{product.category && (
									<>
										<dt>Category</dt>
										<dd>
											<Link href={`/category/${product.category.slug}`} className="underline">
												{product.category.name}
											</Link>
										</dd>
									</>
								)}
								{options.length > 0 && (
									<>
										<dt>Available in</dt>
										<dd>{options.join(", ")}</dd>
									</>
								)}
							</dl>
						),
					},
				]
			: []),
		{
			label: "Shipping",
			content: (
				<p>
					Shipping options and costs for your address are shown at checkout, before you pay. Questions about
					delivery or returns? See the{" "}
					<Link href="/faq" className="underline">
						FAQ
					</Link>
					.
				</p>
			),
		},
	];

	return panels.map(({ label, content }) => (
		<details key={label} name="product-info" className="group lg:flex-1">
			<summary className="flex h-8 items-center justify-center rounded-sm bg-white group-open:bg-black group-open:text-white">
				{label}
			</summary>
			<div className="card absolute inset-x-0 bottom-full mb-1 max-h-[50svh] overflow-y-auto overscroll-contain bg-white text-copy font-normal">
				<div className="max-w-[58rem] [&_p+p]:mt-3">{content}</div>
			</div>
		</details>
	));
}
