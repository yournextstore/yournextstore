import Link from "next/link";
import { cn } from "@/lib/utils";

/** The script logo: the store's name in Pacifico with the original's trailing full stop. */
export function Wordmark({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			className={cn(
				"min-w-0 truncate rounded-md font-brand text-heading-2xl text-brand ring-brand-hover ring-offset-2 ring-offset-background hover:text-brand-hover focus-visible:outline-none focus-visible:ring-3 lg:text-heading-4xl",
				className,
			)}
		>
			{name}.
		</Link>
	);
}
