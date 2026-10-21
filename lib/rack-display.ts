// Pure display helpers: safe to import from client components (no commerce client).

/** Faceplate legend from a product name: "Azure Drift" → "AZURE". Upper-case, short, like a module name. */
export function plateName(name: string) {
	const first = name.split(/[\s-]+/).find(Boolean) ?? name;
	return first.toUpperCase().slice(0, 9);
}

/** Model code for the spec line: "Blaze Torch" → "BT-03". */
export function modelCode(name: string, index?: number) {
	const letters =
		name
			.split(/[\s-]+/)
			.filter(Boolean)
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.replace(/[^A-Z0-9ĄĆĘŁŃÓŚŹŻ]/g, "")
			.slice(0, 3) || "PB";
	return index === undefined ? letters : `${letters}-${String(index + 1).padStart(2, "0")}`;
}
