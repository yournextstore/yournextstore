type Pictured = {
	images?: readonly string[] | null;
	variants?: readonly { images?: readonly string[] | null }[] | null;
};

export function hasPicture(product: Pictured): boolean {
	return (
		(product.images?.length ?? 0) > 0 || (product.variants?.some((v) => (v.images?.length ?? 0) > 0) ?? false)
	);
}

/** Products with a photo first (stable), so image-led rows never open on an empty tile. */
export function picturedFirst<T extends Pictured>(products: readonly T[]): T[] {
	return [...products.filter(hasPicture), ...products.filter((p) => !hasPicture(p))];
}
