import { cn } from "@/lib/utils";

/** The original's full-bleed hairline between sections. */
export function Separator({ className }: { className?: string }) {
	return <hr className={cn("my-4 h-px border-0 bg-border", className)} />;
}
