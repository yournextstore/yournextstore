/**
 * The original gave every product page its own button colour. Products here have no such
 * field, so each one is assigned one of the five original accents from its slug: stable
 * across renders, and varied across a catalogue.
 */
const ACCENTS = ["bg-clementine", "bg-tumbleweed", "bg-hawkes-blue", "bg-asparagus", "bg-goldenrod"] as const;

export function accentFor(slug: string): string {
	const hash = [...slug].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
	return ACCENTS[hash % ACCENTS.length] ?? "bg-white-rock";
}
