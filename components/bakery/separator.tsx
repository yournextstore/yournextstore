import { cn } from "@/lib/utils";

/**
 * The original's torn-paper edge between the cream page and a sand band. `flip` turns it the
 * other way (sand above, cream below).
 */
export function Separator({ flip = false, className }: { flip?: boolean; className?: string }) {
	return (
		<div
			aria-hidden="true"
			className={cn("relative h-2 w-full overflow-hidden", flip ? "bg-background" : "bg-surface", className)}
		>
			<div
				className={cn("zigzag-edge absolute inset-x-0 -top-px h-full", flip ? "bg-surface" : "bg-background")}
			/>
		</div>
	);
}
