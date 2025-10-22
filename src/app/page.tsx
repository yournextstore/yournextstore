import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ynsClient } from "@/yns-client";

export default async function Home() {
	return (
		<Suspense>
			<ProductList />
		</Suspense>
	);
}

const ProductList = async () => {
	"use cache";
	cacheLife("seconds");

	console.log("Fetching products...");
	const products = await ynsClient.productBrowse({ active: true, limit: 2 });
	console.log({ products: products.meta });
	return (
		<ul>
			{products.data.map((product) => (
				<li key={product.id}>
					<h2>{product.name}</h2>
					<p>{product.summary}</p>
				</li>
			))}
		</ul>
	);
};
