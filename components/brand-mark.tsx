import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The original's roundel-plus-wordmark lockup, rebuilt from the store's name: a terracotta
 * disc carrying the initial, the name in the heading face with its full stop, and a small
 * line underneath.
 */
export function BrandMark({
	name,
	tagline,
	className,
}: {
	name: string;
	tagline: string;
	className?: string;
}) {
	const initial = name.trim().charAt(0).toUpperCase() || "Y";
	return (
		<Link href="/" className={cn("inline-flex min-w-0 items-center gap-3 text-ink", className)}>
			<span
				aria-hidden="true"
				className="flex size-10 shrink-0 items-center justify-center rounded-full bg-announce font-heading text-xl font-semibold text-white sm:size-11"
			>
				{initial}
			</span>
			<span className="min-w-0 text-left leading-tight">
				<span className="block truncate font-heading text-xl font-semibold sm:text-2xl">{name}.</span>
				<span className="block truncate text-[11px] tracking-wide opacity-80">{tagline}</span>
			</span>
		</Link>
	);
}
