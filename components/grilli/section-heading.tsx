import type { ElementType } from "react";
import { cn } from "@/lib/utils";

/** Gold kicker with the separator ornament, then a Forum headline: every section opens this way. */
export function SectionHeading({
	kicker,
	title,
	as: Heading = "h2",
	align = "center",
	id,
	className,
	titleClassName,
}: {
	kicker: string;
	title: string;
	as?: ElementType;
	align?: "center" | "start";
	id?: string;
	className?: string;
	titleClassName?: string;
}) {
	return (
		<div className={cn(align === "center" ? "text-center" : "text-center lg:text-left", className)}>
			<p className="section-subtitle" data-align={align === "start" ? "start" : undefined}>
				{kicker}
			</p>
			<Heading id={id} className={cn("font-display text-headline-1 text-white", titleClassName)}>
				{title}
			</Heading>
		</div>
	);
}
