import { cn } from "@/lib/utils";

/* The original colours each scent family; here the store's categories take the four tones in turn. */
const TONES = ["bg-woody", "bg-floral", "bg-citrus", "bg-oud"] as const;

export function toneFor(index: number) {
	return TONES[((index % TONES.length) + TONES.length) % TONES.length] ?? TONES[0];
}

export function FamilyDot({ index, className }: { index: number; className?: string }) {
	return (
		<span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", toneFor(index), className)} />
	);
}
