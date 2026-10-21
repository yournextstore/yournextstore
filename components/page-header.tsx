import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// The original's page-header primitives (after shadcn's www page header).

export function PageHeader({
	className,
	withPadding = false,
	children,
}: {
	className?: string;
	withPadding?: boolean;
	children: ReactNode;
}) {
	return (
		<section
			className={cn(
				"flex max-w-[61.25rem] flex-col gap-1",
				withPadding && "py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20",
				className,
			)}
		>
			{children}
		</section>
	);
}

const HEADING_SIZES = {
	default: "text-3xl md:text-5xl",
	sm: "text-2xl md:text-3xl",
	lg: "text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl",
} as const;

export function PageHeaderHeading({
	size = "default",
	className,
	style,
	children,
}: {
	size?: keyof typeof HEADING_SIZES;
	className?: string;
	style?: React.CSSProperties;
	children: ReactNode;
}) {
	return (
		<h1
			style={style}
			className={cn(
				"font-heading leading-tight tracking-[-0.01em] [overflow-wrap:anywhere] lg:leading-[1.1]",
				HEADING_SIZES[size],
				className,
			)}
		>
			{children}
		</h1>
	);
}

export function PageHeaderDescription({
	size = "default",
	className,
	style,
	children,
}: {
	size?: "default" | "sm";
	className?: string;
	style?: React.CSSProperties;
	children: ReactNode;
}) {
	return (
		<p
			style={style}
			className={cn(
				"max-w-[46.875rem] text-balance text-muted-foreground",
				size === "sm" ? "text-sm sm:text-base" : "text-base sm:text-lg",
				className,
			)}
		>
			{children}
		</p>
	);
}

export function ContentSection({
	title,
	description,
	href,
	linkText = "View all",
	className,
	children,
	id,
}: {
	title: string;
	description?: string;
	href: string;
	linkText?: string;
	className?: string;
	children: ReactNode;
	id?: string;
}) {
	return (
		<section id={id} className={cn("scroll-mt-20 space-y-6", className)}>
			<div className="flex items-center justify-between gap-4">
				<div className="flex max-w-[61.25rem] flex-1 flex-col gap-0.5">
					<h2 className="font-heading text-2xl leading-[1.1] md:text-3xl">{title}</h2>
					{description ? (
						<p className="max-w-[46.875rem] text-balance text-sm leading-normal text-muted-foreground sm:text-base sm:leading-7">
							{description}
						</p>
					) : null}
				</div>
				<Link
					href={href}
					className="hidden h-9 shrink-0 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex"
				>
					{linkText}
					<ArrowRight className="size-4" aria-hidden="true" />
				</Link>
			</div>
			<div className="space-y-8">
				{children}
				<Link
					href={href}
					className="mx-auto flex h-9 w-fit items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent sm:hidden"
				>
					{linkText}
					<ArrowRight className="size-4" aria-hidden="true" />
				</Link>
			</div>
		</section>
	);
}
