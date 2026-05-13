"use server";

import { commerce } from "@/lib/commerce";

export type SearchSuggestion = {
	id: string;
	name: string;
	slug: string;
	image: string | null;
	summary: string | null;
};

export async function searchSuggest(query: string): Promise<SearchSuggestion[]> {
	const trimmed = query.trim();
	if (trimmed.length < 2) return [];

	const result = await commerce.search({ query: trimmed, limit: 6 });
	return result.items.map(({ id, name, slug, image, summary }) => ({
		id,
		name,
		slug,
		image,
		summary: summary ? stripTags(summary).slice(0, 120) : null,
	}));
}

function stripTags(html: string): string {
	return html
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}
