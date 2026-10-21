import Link from "next/link";
import { cn } from "@/lib/utils";

/** Lowercase text wordmark in the original's heavy weight; the name always comes from the store. */
export function StoreLogo({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			title="Go to homepage"
			className={cn("block truncate text-xl leading-9 font-semibold tracking-tight lowercase", className)}
		>
			{name}
		</Link>
	);
}
