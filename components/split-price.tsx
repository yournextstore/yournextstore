import { cn } from "@/lib/utils";

/** The original's price: currency sign and cents set small and raised ("€3⁹⁹"). */
export function SplitPrice({ value, className }: { value: string; className?: string }) {
	const match = value.match(/^(\D*?)(\d[\d\s.,  ]*?)([.,]\d{1,3})?(\D*)$/);
	if (!match) {
		return <span className={className}>{value}</span>;
	}
	const [, prefix = "", whole = "", cents = "", suffix = ""] = match;
	return (
		<span className={cn("font-semibold whitespace-nowrap text-foreground", className)}>
			<span className="sr-only">{value}</span>
			<span aria-hidden="true">
				{prefix.trim() && <span className="align-super text-[0.6em]">{prefix.trim()}</span>}
				{whole}
				{cents && <span className="align-super text-[0.6em]">{cents}</span>}
				{suffix.trim() && <span className="ml-0.5 align-super text-[0.6em]">{suffix.trim()}</span>}
			</span>
		</span>
	);
}
