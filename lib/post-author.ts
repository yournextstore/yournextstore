const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const textOf = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

/** The person named as a post's author: their public name, and what the store chose to say about them. */
export type PostAuthor = { name: string; jobTitle?: string; bio?: string };

/**
 * A blog post's author, or `null` when the store itself is the author. The Store API returns `author` on a post
 * only while the merchant has "Show authors on posts" switched on, and it is one of the store's own team; the
 * pinned commerce-kit types don't know the field yet, so it is read by shape. The post's structured data, which
 * the API also sends, already names the same author.
 */
export function postAuthorOf(post: unknown): PostAuthor | null {
	const author = isRecord(post) ? post.author : undefined;
	const name = isRecord(author) ? textOf(author.name) : undefined;
	if (!isRecord(author) || !name) {
		return null;
	}
	const jobTitle = textOf(author.jobTitle);
	const bio = textOf(author.bio);
	return { name, ...(jobTitle ? { jobTitle } : {}), ...(bio ? { bio } : {}) };
}

/** "Anna Berg, Perfumer", or the name alone. */
export const postAuthorLine = (author: PostAuthor) =>
	[author.name, author.jobTitle].filter(Boolean).join(", ");
