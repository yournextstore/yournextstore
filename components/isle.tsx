import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A number in a black circle: the collection numbers, 24px beside labels and 32px beside headings. */
export function Badge({
	children,
	size = 24,
	className,
}: {
	children: ReactNode;
	size?: 24 | 32;
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full bg-black text-white",
				size === 24 ? "size-6" : "size-8",
				className,
			)}
		>
			{children}
		</span>
	);
}

/** The round arrow at the end of "All Products" and on the product photos. Decorative. */
export function ArrowCircle({
	tone = "dark",
	direction = "right",
	className,
}: {
	tone?: "light" | "dark";
	direction?: "left" | "right";
	className?: string;
}) {
	return (
		<svg
			viewBox="0 0 32 32"
			width="32"
			height="32"
			aria-hidden="true"
			className={cn(
				"shrink-0",
				tone === "light" ? "text-white" : "text-black",
				direction === "left" && "rotate-180",
				className,
			)}
		>
			<circle cx="16" cy="16" r="16" fill="currentColor" />
			<path
				d="M10.667 16h10.666m-3.2-3.2 3.2 3.2-3.2 3.2"
				fill="none"
				strokeWidth="1.5"
				strokeLinecap="square"
				className={tone === "light" ? "stroke-black" : "stroke-white"}
			/>
		</svg>
	);
}

/**
 * A collection's heading row at the top of its card: number, name, piece count and (from
 * 1024px) its description, on the site grid so the counts line up with the header's links.
 */
export function CollectionHeading({
	id,
	number,
	name,
	count,
	description,
	href,
	as: Heading = "h2",
}: {
	id: string;
	number: number;
	name: string;
	count?: string;
	description?: string;
	href?: string;
	as?: "h1" | "h2";
}) {
	return (
		<div className="flex items-center justify-between gap-3 lg:grid-site">
			<Heading id={id} className="flex min-w-0 items-center gap-2 lg:col-span-3">
				<Badge>{number}</Badge>
				{href ? (
					<Link href={href} className="tap truncate hover:underline">
						{name}
					</Link>
				) : (
					<span className="truncate">{name}</span>
				)}
			</Heading>
			{count && <p className="shrink-0 lg:col-span-2 lg:col-start-4">{count}</p>}
			{description && <p className="truncate max-lg:hidden lg:col-span-6 lg:col-start-6">{description}</p>}
		</div>
	);
}
