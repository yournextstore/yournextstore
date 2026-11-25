// `filter` wire encoding, as the API takes it: `<field>:<match>` joined by `;`, where `<field>` is
// `<product|variant>.<namespace>.<key>` and a match lists option keys joined by `,`.
const FIELDS_SEPARATOR = ";";
const FIELD_AND_MATCH_SEPARATOR = ":";
const OPTIONS_SEPARATOR = ",";

export function parseCustomFieldFilter(filter: string | null | undefined): Record<string, string[]> {
	if (!filter) {
		return {};
	}
	const pairs = filter
		.split(FIELDS_SEPARATOR)
		.map((segment): [string, string[]] | null => {
			const at = segment.indexOf(FIELD_AND_MATCH_SEPARATOR);
			if (at <= 0) return null;
			const options = segment
				.slice(at + 1)
				.split(OPTIONS_SEPARATOR)
				.filter(Boolean);
			return options.length > 0 ? [segment.slice(0, at), options] : null;
		})
		.filter((pair): pair is [string, string[]] => pair !== null);
	return Object.fromEntries(pairs);
}

export function encodeCustomFieldFilter(record: Record<string, string[]>): string {
	return Object.entries(record)
		.filter(([, options]) => options.length > 0)
		.map(([field, options]) => `${field}${FIELD_AND_MATCH_SEPARATOR}${options.join(OPTIONS_SEPARATOR)}`)
		.join(FIELDS_SEPARATOR);
}
