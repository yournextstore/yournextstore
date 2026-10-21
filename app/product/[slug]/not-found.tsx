import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Product Not Found",
	robots: { index: false, follow: true },
};

export default function ProductNotFound() {
	return (
		<div className="container grid min-h-svh content-start justify-center py-44 text-center">
			<p className="text-6xl font-bold text-emerald-900">404</p>
			<h1 className="mt-4 text-xl">Product not found</h1>
			<Link href="/products" className="mt-6 font-semibold text-emerald-900 hover:text-emerald-700">
				Browse all products
				<span aria-hidden> &rarr;</span>
			</Link>
		</div>
	);
}
