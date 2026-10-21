import type { Notes } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const ROWS = [
	["Top", "top"],
	["Heart", "heart"],
	["Base", "base"],
] as const;

/** The notes pyramid as label/value rows (hero card) or three columns (bento, product page). */
export function NotesList({
	notes,
	layout = "rows",
	className,
}: {
	notes: Notes;
	layout?: "rows" | "columns";
	className?: string;
}) {
	return (
		<dl
			className={cn(layout === "rows" ? "space-y-3.5 text-sm" : "grid grid-cols-3 gap-4 text-sm", className)}
		>
			{ROWS.map(([label, key]) => (
				<div
					key={key}
					className={layout === "rows" ? "grid grid-cols-[3.5rem_1fr] items-baseline gap-3" : undefined}
				>
					<dt className={layout === "rows" ? "text-xs text-ink/65" : "eyebrow"}>{label}</dt>
					<dd className={cn("text-ink/90", layout === "columns" && "mt-2")}>{notes[key]}</dd>
				</div>
			))}
		</dl>
	);
}
