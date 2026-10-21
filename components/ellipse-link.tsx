import Link from "next/link";
import { EllipseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** "Shop now" ringed by the original's tilted hand-drawn oval. */
export function EllipseLink({
	href,
	children,
	className,
}: {
	href: string;
	children: string;
	className?: string;
}) {
	return (
		<Link
			href={href}
			className={cn(
				"ellipse-link relative inline-flex h-[61px] w-[148px] items-center justify-center",
				className,
			)}
		>
			<EllipseIcon className="absolute inset-0 h-[61px] w-[148px]" />
			<span className="relative text-[15px] font-medium">{children}</span>
		</Link>
	);
}
