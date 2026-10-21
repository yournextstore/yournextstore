import { cn } from "@/lib/utils";

/** A plain shopping-bag mark in place of the original's logo artwork. */
export function BagMark({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 32 32"
			className={cn("h-8 w-8 shrink-0", className)}
			fill="none"
			stroke="currentColor"
		>
			<path d="M11 11V8a5 5 0 0 1 10 0v3" strokeWidth="2.6" />
			<rect x="4.5" y="11" width="23" height="18.5" fill="currentColor" stroke="none" />
		</svg>
	);
}

/** Store-name wordmark: bag mark + name, with a small tracked caption under it. */
export function Wordmark({ name, className }: { name: string; className?: string }) {
	const [first, ...rest] = name.split(" ");
	const caption = rest.length > 0 ? rest.join(" ") : "Store";
	return (
		<span className={cn("flex items-center gap-2 text-foreground", className)}>
			<BagMark />
			<span className="flex flex-col leading-none">
				<span className="font-serif text-[1.0625rem] font-normal uppercase tracking-[0.02em]">{first}</span>{" "}
				<span className="mt-1 self-end text-[0.5rem] font-bold uppercase tracking-[0.35em]">{caption}</span>
			</span>
		</span>
	);
}
