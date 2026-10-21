import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Scramble } from "./scramble";

export function Eyebrow({
	gridRef,
	label,
	className,
}: {
	gridRef?: string;
	label: string;
	className?: string;
}) {
	return (
		<p className={cn("eyebrow", className)}>
			{gridRef && (
				<span className="grid-ref" aria-hidden="true">
					[ {gridRef} ]
				</span>
			)}
			<Scramble text={label} />
		</p>
	);
}

export function SectionHead({
	gridRef,
	eyebrow,
	title,
	lead,
	as: Heading = "h2",
	className,
	children,
}: {
	gridRef?: string;
	eyebrow: string;
	title: ReactNode;
	lead?: ReactNode;
	as?: "h1" | "h2";
	className?: string;
	children?: ReactNode;
}) {
	return (
		<div className={cn("frame mb-12", className)}>
			<Eyebrow gridRef={gridRef} label={eyebrow} className="mb-[1.4rem]" />
			<div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
				<div className="min-w-0">
					<Heading className="title-section mt-1.5 text-ink [overflow-wrap:anywhere]">{title}</Heading>
					{lead && <p className="lead mt-[1.4rem]">{lead}</p>}
				</div>
				{children}
			</div>
		</div>
	);
}
