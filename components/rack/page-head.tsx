import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Kicker } from "./section-head";

/** Page opener for listings and info pages: a tinted band between hairlines with a faded watermark. */
export function PageHead({
	kicker,
	title,
	lead,
	watermark,
	children,
}: {
	kicker: ReactNode;
	title: ReactNode;
	lead?: ReactNode;
	watermark?: string;
	children?: ReactNode;
}) {
	return (
		<section className="band section-x relative mt-[clamp(1.6rem,4vw,2.6rem)] overflow-hidden pt-[clamp(2.6rem,6vw,4.2rem)] pb-[clamp(2.2rem,5vw,3.4rem)]">
			{watermark && (
				<span aria-hidden="true" className="watermark top-[8%]">
					{watermark}
				</span>
			)}
			<div
				className={cn(
					"frame relative z-[1]",
					children && "grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12",
				)}
			>
				<div className="max-w-[64ch] min-w-0">
					<Kicker className="mb-4">{kicker}</Kicker>
					<h1 className="title-section text-ink [overflow-wrap:anywhere]">{title}</h1>
					{lead && <p className="lead mt-4">{lead}</p>}
				</div>
				{children}
			</div>
		</section>
	);
}
