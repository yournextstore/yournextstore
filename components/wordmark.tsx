import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The original's centred logotype: the store's name in Jost capitals with a quarter-em of
 * tracking, in royal violet. Its size follows the name's length so a long store name still
 * fits between the menu and the icons (see `.wordmark` in globals.css).
 */
export function Wordmark({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			className={cn("wordmark absolute left-1/2 -translate-x-1/2 whitespace-nowrap", className)}
			style={{ "--wm-n": Math.max(name.length, 5) } as React.CSSProperties}
		>
			{name}
		</Link>
	);
}
