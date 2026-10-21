import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** "EXPLORE NOW →" / "VIEW ALL →": small uppercase link whose underline draws in on hover. */
export function ArrowLink({
	href,
	children = "View all",
	className,
}: {
	href: string;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<Link href={href} className={cn("link-reveal py-1", className)}>
			{children}
			<ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.25} />
		</Link>
	);
}

/** The original's section heading: uppercase Tenor Sans, a short line of copy, an optional link. */
export function SectionHeader({
	title,
	subtitle,
	action,
	centered = false,
	className,
	as: Heading = "h2",
	size = "h2",
}: {
	title: ReactNode;
	subtitle?: ReactNode;
	action?: ReactNode;
	centered?: boolean;
	className?: string;
	as?: "h1" | "h2";
	size?: "h2" | "h3" | "h4";
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4",
				centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
				className,
			)}
		>
			<div className="min-w-0">
				<Heading
					className={cn(
						"wrap-break-word text-foreground uppercase",
						size === "h2" && "text-h2",
						size === "h3" && "text-h3",
						size === "h4" && "text-h4",
					)}
				>
					{title}
				</Heading>
				{subtitle && <p className="mt-3 text-sm text-foreground md:text-[15px]">{subtitle}</p>}
				{centered && action && <div className="mt-4">{action}</div>}
			</div>
			{!centered && action && <div className="shrink-0">{action}</div>}
		</div>
	);
}
