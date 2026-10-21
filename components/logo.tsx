import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** The original's bag-and-wordmark logo, with the store's own name as the wordmark. */
export function Logo({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			className={cn("flex min-w-0 items-center gap-1.5 text-xl font-bold tracking-tight text-ink", className)}
		>
			<ShoppingBag aria-hidden className="size-6 shrink-0 fill-current" strokeWidth={2} />
			<span className="truncate">{name}</span>
		</Link>
	);
}
