import { Commerce, type JSONContent } from "commerce-kit";

// Commerce() auto-reads YNS_API_KEY from environment
// and auto-detects endpoint based on key prefix (sk-live-* or sk-test-*)
export const commerce = Commerce();

// Fetch all active collections
export async function getCollections() {
	try {
		const response = await commerce.request<{ data: Collection[] }>("/collections", {
			query: { active: true },
		});
		return response.data;
	} catch {
		return [];
	}
}

// Collection types for use with the request() escape hatch
export type Collection = {
	id: string;
	name: string;
	slug: string;
	description: JSONContent | null;
	image: string | null;
	active: boolean;
};

export type CollectionWithProducts = Collection & {
	products: {
		data: Array<{
			id: string;
			name: string;
			slug: string;
			images: string[];
			summary: string | null;
			variants: Array<{
				id: string;
				price: string;
				images: string[];
			}>;
		}>;
	};
};
