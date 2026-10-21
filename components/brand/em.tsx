import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** The gold italic phrase inside a headline. One per heading at most. */
export function Em({ className, ...props }: HTMLAttributes<HTMLElement>) {
	return <em className={cn("font-accent font-normal italic text-gold", className)} {...props} />;
}

/** A name set as a headline: the last word takes the accent when there is more than one. */
export function AccentName({ name }: { name: string }) {
	const words = name.trim().split(/\s+/);
	if (words.length < 2) return <Em>{name}</Em>;
	return (
		<>
			{words.slice(0, -1).join(" ")} <Em>{words.at(-1)}</Em>
		</>
	);
}
