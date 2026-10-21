import Link from "next/link";
import { cn } from "@/lib/utils";

/** The store's name set as the original's navbar logo: brass Playfair caps, tracked out. */
export function BrandMark({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			className={cn(
				"serif min-w-0 truncate text-[1.0625rem] font-bold uppercase leading-none tracking-[0.06em] text-gold sm:text-[1.25rem] sm:tracking-[0.1em] transition-colors duration-150 hover:text-cream",
				className,
			)}
		>
			{name}
		</Link>
	);
}
