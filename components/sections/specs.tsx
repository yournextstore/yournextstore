import { SectionHead } from "@/components/rack/section-head";
import { getRackCatalog } from "@/lib/rack";

/** The original's spec table, filled only with what the storefront itself does. */
export async function Specs() {
	const { productCount, priceFrom, priceTo, freeShipping, currency } = await getRackCatalog();

	const rows: { label: string; value: React.ReactNode }[] = [
		{
			label: "The line",
			value: (
				<>
					<strong>
						{productCount} {productCount === 1 ? "product" : "products"}
					</strong>{" "}
					— every one with its own page, photos and stock count
				</>
			),
		},
		...(priceFrom && priceTo
			? [
					{
						label: "Price range",
						value: (
							<>
								<strong>
									{priceFrom}
									{priceFrom !== priceTo ? ` – ${priceTo}` : ""}
								</strong>{" "}
								in {currency}, taxes shown at checkout
							</>
						),
					},
				]
			: []),
		{
			label: "Shipping",
			value: freeShipping ? (
				<>
					<strong>Free over {freeShipping}</strong> — rates for everything else at checkout
				</>
			) : (
				<>Rates calculated at checkout, before you pay</>
			),
		},
		{ label: "Checkout", value: <>Card and wallet payments on a secure hosted checkout</> },
		{ label: "Discounts", value: <>Codes apply in the cart drawer — the total updates before you leave</> },
		{ label: "Stock", value: <>Live counts on every product page; low stock is printed, not hidden</> },
		{ label: "Account", value: <>Order history in one place — sign in with your email</> },
	];

	return (
		<section id="specs" className="band section-x section-y">
			<SectionHead
				kicker="Specs"
				title="Numbers for the planners."
				lead="Shared across the whole line, so the boring part stays boring — the way the boring part should be."
			/>
			<div className="frame">
				<table className="w-full max-w-[60rem] border-collapse">
					<caption className="sr-only">What every order from this shop includes</caption>
					<tbody>
						{rows.map((row) => (
							<tr key={row.label}>
								<th
									scope="row"
									className="font-plate w-[32%] border-b border-line-2 px-[0.4rem] py-[0.85rem] text-left align-top text-[0.72rem] font-normal tracking-[0.12em] text-faint uppercase"
								>
									{row.label}
								</th>
								<td className="border-b border-line-2 px-[0.4rem] py-[0.85rem] align-top text-[0.92rem] text-dim [&_strong]:font-semibold [&_strong]:text-ink">
									{row.value}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
