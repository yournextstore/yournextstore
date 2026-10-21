import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** "View All →": the original's small link with a long arrow; the underline draws in on hover. */
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
			<ArrowRight aria-hidden="true" className="h-4 w-5" strokeWidth={1.25} />
		</Link>
	);
}

/** The original's section heading: Belleza, a short line of copy, an optional link on the right. */
export function SectionHeader({
	title,
	subtitle,
	action,
	centered = false,
	className,
	as: Heading = "h2",
	size = "h4",
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
				centered ? "items-center text-center" : "sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			<div className="min-w-0">
				<Heading
					className={cn(
						"wrap-break-word text-foreground",
						size === "h2" && "text-h2",
						size === "h3" && "text-h3",
						size === "h4" && "text-h4",
					)}
				>
					{title}
				</Heading>
				{subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
				{centered && action && <div className="mt-4">{action}</div>}
			</div>
			{!centered && action && <div className="shrink-0">{action}</div>}
		</div>
	);
}
