import { cn } from "@/lib/utils";

/** The original's ticker strip: a muted one under the header, a mustard one between sections. */
export function Marquee({ items, inverted = false }: { items: string[]; inverted?: boolean }) {
	const run = items.flatMap((item) => [item, "✦"]);
	return (
		<div
			aria-hidden
			className={cn(
				"overflow-hidden border-y py-3",
				inverted
					? "border-[#7d5612] bg-brand text-brand-foreground"
					: "border-border bg-card text-muted-foreground",
			)}
		>
			<div className="animate-marquee whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em]">
				{[0, 1].map((copy) =>
					run.map((item, i) => (
						<span key={`${copy}-${i}`} className="mx-6">
							{item}
						</span>
					)),
				)}
			</div>
		</div>
	);
}
