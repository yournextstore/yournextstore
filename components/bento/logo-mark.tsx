import { cn } from "@/lib/utils";

/**
 * The reference wordmark: a glowing amber "grow light" dot in a tinted square, then the store
 * name with its last word picked out in amber (the original's "Aqua|lux" split).
 */
export function LogoMark({ name, className }: { name: string; className?: string }) {
	const words = name.trim().split(/\s+/);
	const last = words.length > 1 ? words.pop() : null;
	return (
		<span className={cn("flex min-w-0 items-center gap-2.5", className)}>
			<span
				aria-hidden="true"
				className="relative flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-amber/40 bg-amber/10"
			>
				<span className="h-2.5 w-2.5 rounded-full bg-amber shadow-[0_0_12px_2px_rgba(242,169,59,.55)]" />
			</span>
			<span className="truncate text-[17px] leading-none font-semibold tracking-tight text-bone">
				{words.join(" ")}
				{last ? <span className="text-amber"> {last}</span> : null}
			</span>
		</span>
	);
}
