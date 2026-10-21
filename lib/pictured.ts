import { isVideoUrl } from "@/lib/utils";

type Pictured = {
	images?: readonly string[] | null;
	variants?: readonly { images?: readonly string[] | null }[];
};

const hasStill = (images: readonly string[] | null | undefined) =>
	Boolean(images?.some((i) => !isVideoUrl(i)));
const isPictured = (product: Pictured) =>
	hasStill(product.images) || Boolean(product.variants?.some((variant) => hasStill(variant.images)));

/** Products with a photograph (their own or a variant's) first, the rest after; order otherwise kept. */
export function picturedFirst<T extends Pictured>(products: readonly T[]): T[] {
	return [...products.filter(isPictured), ...products.filter((product) => !isPictured(product))];
}
