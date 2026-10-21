import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
	return <p className={cn("kicker", className)}>{children}</p>;
}

/** The original's `.sec-head`: bracketed kicker, display heading, dim lede, at most 64ch wide. */
export function SectionHead({
	kicker,
	title,
	lead,
	as: Heading = "h2",
	className,
	children,
}: {
	kicker: ReactNode;
	title: ReactNode;
	lead?: ReactNode;
	as?: "h1" | "h2";
	className?: string;
	children?: ReactNode;
}) {
	return (
		<div className={cn("frame relative z-[1] mb-[2.6rem]", className)}>
			<div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
				<div className="max-w-[64ch] min-w-0">
					<Kicker className="mb-4">{kicker}</Kicker>
					<Heading className="title-section text-ink [overflow-wrap:anywhere]">{title}</Heading>
					{lead && <p className="lead mt-4">{lead}</p>}
				</div>
				{children}
			</div>
		</div>
	);
}
