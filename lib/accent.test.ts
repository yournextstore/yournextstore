import { expect, test } from "bun:test";
import { accentFor } from "@/lib/accent";

test("accentFor is stable and picks one of the original accents", () => {
	expect(accentFor("halo-floor-lamp")).toBe(accentFor("halo-floor-lamp"));
	const accents = new Set(
		["nova-bulb", "zen-stone", "glow-cube", "orbit-desk", "lumen-strip"].map(accentFor),
	);
	expect([...accents].every((a) => a.startsWith("bg-"))).toBe(true);
	expect(accents.size).toBeGreaterThan(1);
});
