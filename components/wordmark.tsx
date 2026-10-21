import { cn } from "@/lib/utils";

/** The original's two-tone serif wordmark ("TEA" + gold "VIBE"), built from the store name. */
export function Wordmark({
	name,
	className,
	tone = "page",
}: {
	name: string;
	className?: string;
	tone?: "page" | "footer";
}) {
	const [first = "", ...rest] = name.trim().split(/\s+/);
	return (
		<span className={cn("font-display font-bold uppercase tracking-wide", className)}>
			<span
				className={tone === "footer" ? "text-footer-foreground" : "text-[var(--footer)] dark:text-foreground"}
			>
				{first}
			</span>
			{rest.length > 0 && (
				<span className={tone === "footer" ? "text-accent" : "text-gold-ink"}> {rest.join(" ")}</span>
			)}
		</span>
	);
}
