import { CollectionHeading } from "@/components/isle";
import { ProductCard } from "@/components/product-card";
import { getCollectionRows, getLatestProducts, pieces } from "@/lib/catalog";

const ROWS = 4;

/**
 * Each collection as a paper card: its heading row, then a row of photos that scrolls
 * sideways (583px photos at 1440px, five grid columns; 300px on phones). The spacing is padding
 * inside each slide, as in the original, so the last photo keeps its gap.
 */
export async function CollectionRows() {
	const rows = await getCollectionRows(ROWS);
	// No collections yet: one row of the newest products, so the home page is never empty.
	const fallback =
		rows.length === 0
			? [
					{
						id: "latest",
						name: "Latest",
						href: "/products",
						description: "",
						products: await getLatestProducts(8),
					},
				]
			: rows;

	return fallback.map((row, index) => (
		<section key={row.id} className="card mx-1 mt-1 bg-paper" aria-labelledby={`row-${row.id}`}>
			<CollectionHeading
				id={`row-${row.id}`}
				number={index + 1}
				name={row.name}
				href={row.href}
				count={pieces(row.products.length)}
				description={row.description}
			/>
			<div className="scroll-row mt-12 lg:mt-16">
				<ul className="flex">
					{row.products.map((product) => (
						<li key={product.id} className="w-[312px] flex-none pr-3 lg:w-[calc((100%-132px)*5/12+60px)]">
							<ProductCard product={product} caption={false} sizes="(width >= 64rem) 40vw, 300px" />
						</li>
					))}
				</ul>
			</div>
		</section>
	));
}
