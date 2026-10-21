import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ label, className }: { label: string; className?: string }) {
	return <p className={cn("eyebrow", className)}>{label}</p>;
}

/** Mono eyebrow with a leading copper rule, serif title (italic copper `<em>` tail), dim lead. */
export function SectionHead({
	eyebrow,
	title,
	lead,
	as: Heading = "h2",
	className,
	children,
}: {
	eyebrow: string;
	title: ReactNode;
	lead?: ReactNode;
	as?: "h1" | "h2";
	className?: string;
	children?: ReactNode;
}) {
	return (
		<div className={cn("frame mb-[clamp(36px,5vh,60px)]", className)}>
			<Eyebrow label={eyebrow} className="mb-[1.4rem]" />
			<div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
				<div className="min-w-0">
					<Heading className="title-section text-ink [overflow-wrap:anywhere]">{title}</Heading>
					{lead && <p className="lead mt-[1.3rem]">{lead}</p>}
				</div>
				{children}
			</div>
		</div>
	);
}

/** The original's machined ruler: a hairline with a tick every 80px, between sections. */
export function Ruler() {
	return (
		<div aria-hidden="true" className="section-x">
			<div className="ruler" />
		</div>
	);
}
