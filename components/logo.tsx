import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** The wordmark: a green cart glyph and the store's name, set like the original logotype. */
export function Logo({
	name,
	className,
	onClick,
}: {
	name: string;
	className?: string;
	onClick?: () => void;
}) {
	return (
		<Link
			href="/"
			onClick={onClick}
			className={cn(
				"flex min-w-0 items-center gap-1.5 text-[1.125rem] leading-none font-bold tracking-[-0.02em] text-gray-800 min-[360px]:text-[1.375rem] sm:text-[1.625rem]",
				className,
			)}
		>
			<ShoppingCartIcon
				className="size-6 shrink-0 text-green-500 min-[360px]:size-7 sm:size-8"
				strokeWidth={1.75}
				aria-hidden
			/>
			<span className="truncate">{name}</span>
		</Link>
	);
}
