import { Commerce, type JSONContent } from "commerce-kit";

export const commerce = Commerce({
	endpoint: process.env.NEXT_PUBLIC_YNS_API_TENANT,
	token: process.env.YNS_API_TOKEN,
});

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
