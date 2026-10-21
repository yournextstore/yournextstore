import { monogramLetter } from "@/lib/display";
import { cn } from "@/lib/utils";

/**
 * The original's square "D" mark, drawn from the store's own initial: a sky letter inside a
 * frame whose sides break at the middle. Decorative; the link around it carries the name.
 */
export function Monogram({ storeName, className }: { storeName: string; className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"relative flex size-11 shrink-0 items-center justify-center text-[1.6rem] font-extrabold leading-none text-sky",
				className,
			)}
		>
			<span className="absolute inset-0 border-[3px] border-sky [clip-path:polygon(0_0,100%_0,100%_38%,85%_38%,85%_62%,100%_62%,100%_100%,0_100%)]" />
			{monogramLetter(storeName)}
		</span>
	);
}
