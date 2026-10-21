import type { ReactNode } from "react";

/**
 * The original's marqy track: two identical runs sliding left forever. The second run is `inert`
 * so keyboard and screen-reader users meet each item once.
 */
export function HullMarquee({
	children,
	duration = 60,
	className,
}: {
	children: ReactNode;
	duration?: number;
	className?: string;
}) {
	return (
		<div
			className={`hull-marquee ${className ?? ""}`}
			style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
		>
			<div className="hull-marquee-track">
				<div className="flex shrink-0">{children}</div>
				<div className="flex shrink-0" inert aria-hidden>
					{children}
				</div>
			</div>
		</div>
	);
}
