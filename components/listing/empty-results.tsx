import Link from "next/link";

export function EmptyResults() {
	return (
		<div className="mt-2 flex h-[400px] w-full flex-col items-center justify-center rounded-xl bg-gray-50 px-4 text-center">
			<p className="text-2xl font-medium text-gray-800">Oops! Nothing matches your search</p>
			<p className="font-medium text-muted-foreground">
				Explore our full collection to find what you're looking for
			</p>
			<Link
				href="/products"
				className="mt-3 rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-black/85"
			>
				See all products
			</Link>
		</div>
	);
}
