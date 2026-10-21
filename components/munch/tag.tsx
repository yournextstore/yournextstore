import { cn } from "@/lib/utils";

/** The original's product-type tag: Climate Crisis capitals on a blush strip. */
export function Tag({ text, className }: { text: string; className?: string }) {
	return (
		<span
			className={cn(
				"font-display-d bg-blush px-1 py-px text-end text-l-2xs leading-[1.1] tracking-[0.4px] text-foreground lg:text-l-sm",
				className,
			)}
		>
			{text}
		</span>
	);
}
