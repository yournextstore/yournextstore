import { type JSONContent, YnsProvider } from "commerce-kit";
import { invariant } from "./invariant";

invariant(process.env.YNS_API_TENANT, "Missing env.YNS_API_TENANT");
invariant(process.env.YNS_API_TOKEN, "Missing env.YNS_API_TOKEN");

export const ynsClient = new YnsProvider({
	endpoint: process.env.YNS_API_TENANT,
	token: process.env.YNS_API_TOKEN,
	version: "v1",
});

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
