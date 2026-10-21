import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** "VIEW ALL →": small uppercase tracked link used beside section titles. */
export function ViewAllLink({ href, children = "View all" }: { href: string; children?: ReactNode }) {
	return (
		<Link
			href={href}
			className="group/view inline-flex h-6 items-center gap-2 text-xs font-medium tracking-wider whitespace-nowrap text-foreground uppercase hover:underline sm:text-sm"
		>
			{children}
			<ArrowRight
				aria-hidden="true"
				className="h-4 w-4 transition-transform group-hover/view:translate-x-1"
				strokeWidth={1.5}
			/>
		</Link>
	);
}

/** The original's SectionHeader: serif title, muted subtitle, optional action (end-aligned or centred). */
export function SectionHeader({
	title,
	subtitle,
	action,
	centered = false,
	overline,
	className,
	as: Heading = "h2",
}: {
	title: ReactNode;
	subtitle?: ReactNode;
	action?: ReactNode;
	centered?: boolean;
	overline?: ReactNode;
	className?: string;
	as?: "h1" | "h2";
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2",
				centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
				className,
			)}
		>
			<div>
				{overline && <p className="overline mb-3 text-muted-foreground">{overline}</p>}
				<Heading className="text-3xl leading-tight text-foreground md:text-4xl">{title}</Heading>
				{subtitle && <p className="mt-2 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
			</div>
			{action && <div className="mt-2 md:mt-0">{action}</div>}
		</div>
	);
}
