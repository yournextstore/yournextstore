import { cn } from "@/lib/utils";

/** The original's rounded-square logo mark, drawn from the store name instead of a brand logo. */
export function BrandMark({ letter, className }: { letter: string; className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink font-display text-[18px] font-extrabold leading-none text-paper",
				className,
			)}
		>
			{letter}
		</span>
	);
}
