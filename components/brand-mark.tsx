import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/** The store's name set as the original's wordmark: an ampersand in it turns gold italic. */
export function Wordmark({ name }: { name: string }) {
	const parts = name.trim().split(/\s*&\s*/);
	return (
		<>
			{parts.map((part, index) => (
				<Fragment key={`${part}-${index}`}>
					{index > 0 && (
						<>
							{" "}
							<em aria-hidden="true" className="px-[0.08em] text-gold italic">
								&amp;
							</em>
							<span className="sr-only">and</span>{" "}
						</>
					)}
					{part}
				</Fragment>
			))}
		</>
	);
}

/** "Ledger & Vine" in the header: Cormorant Garamond 600, rebuilt from the store's name. */
export function BrandMark({ name, className }: { name: string; className?: string }) {
	return (
		<Link
			href="/"
			className={cn(
				"serif min-w-0 truncate text-[1.35rem] font-semibold leading-none tracking-[0.02em] text-cream",
				className,
			)}
		>
			<Wordmark name={name} />
		</Link>
	);
}
