import { splitWordmark } from "@/lib/display";
import { cn } from "@/lib/utils";

/** The store name set like the original's "coreX" logo: heavy italic, last letter in signal red. */
export function Wordmark({
	name,
	className,
	tone = "ink",
}: {
	name: string;
	className?: string;
	tone?: "ink" | "light";
}) {
	const { head, tail } = splitWordmark(name);
	return (
		<span
			className={cn(
				"block truncate font-montserrat font-extrabold italic leading-none tracking-[-0.04em] lowercase",
				tone === "ink" ? "text-ink" : "text-page",
				className,
			)}
		>
			{head}
			<span
				className={cn(
					"inline-block pr-[0.08em] text-[1.18em] font-black",
					tone === "ink" ? "text-alert" : "text-[#ff4a50]",
				)}
			>
				{tail}
			</span>
		</span>
	);
}

/** Inline brand name in running copy ("About CoreX", "Best of CoreX Nutrition"). */
export function BrandName({ name, className }: { name: string; className?: string }) {
	const { head, tail } = splitWordmark(name);
	return (
		<span className={className}>
			{head}
			<span className="text-alert">{tail}</span>
		</span>
	);
}
