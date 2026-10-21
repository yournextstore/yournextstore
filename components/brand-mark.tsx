import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The original's logo is a drawn lowercase wordmark in deep sky blue; ours is the store's name,
 * set the same way: heavy, lowercase, tightly tracked.
 */
export function BrandMark({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			className={cn(
				"block min-w-0 max-w-[46vw] truncate text-center text-[1.6rem] font-black lowercase leading-none tracking-[-0.04em] text-[#075985] sm:text-[2.1rem] md:max-w-none md:text-[2.6rem]",
				className,
			)}
		>
			{name}
		</Link>
	);
}
