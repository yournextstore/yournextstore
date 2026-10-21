import { PackageSearchIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Product Not Found",
	robots: { index: false, follow: true },
};

export default function ProductNotFound() {
	return (
		<div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 py-24 text-center">
			<PackageSearchIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
			<h1 className="mt-6 font-display text-4xl tracking-tight">Product not found</h1>
			<p className="mt-2 max-w-md text-sm text-muted-foreground">
				This product doesn't exist or is no longer available. It may have sold out or been removed.
			</p>
			<div className="mt-8 flex items-center gap-4">
				<Link
					href="/products"
					className="inline-flex items-center rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Browse All Products
				</Link>
				<Link
					href="/"
					className="inline-flex items-center rounded-md border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
				>
					Back to Home
				</Link>
			</div>
		</div>
	);
}
