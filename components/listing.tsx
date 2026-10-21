/** The original's no-results block: a sans headline and one line of help. */
export function EmptyListing({ message = "Try another collection or category, or clear the filters." }) {
	return (
		<div className="flex w-full flex-col items-start gap-xs py-2xl">
			<h2 className="text-b-2xl leading-[1.2]">No products found</h2>
			<p className="text-b-lg">{message}</p>
		</div>
	);
}
