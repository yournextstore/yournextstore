import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { href: string; label: string };

/**
 * The original's page toolbar: a round back button to the parent page, a light "Home / Shop / …"
 * trail ending in the orange current page, and an optional action (Filter) at the inline end.
 */
export function ShopCrumbs({
	trail,
	current,
	children,
	className,
}: {
	trail: Crumb[];
	current: string;
	children?: ReactNode;
	className?: string;
}) {
	const parent = trail.at(-1) ?? { href: "/", label: "Home" };
	return (
		<div className={cn("frame flex min-h-[50px] items-center gap-5 py-5 md:py-2", className)}>
			<Link
				href={parent.href}
				aria-label={`Back to ${parent.label}`}
				className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/60 text-ink transition-colors hover:border-tangerine hover:text-tangerine md:size-[50px]"
			>
				<ArrowLeft aria-hidden className="size-5 md:size-6" strokeWidth={2} />
			</Link>
			<nav aria-label="Breadcrumb" className="min-w-0 flex-1">
				<ol className="flex min-w-0 items-center gap-1 text-base">
					{trail.map((crumb) => (
						<li key={crumb.href} className="flex shrink-0 items-center gap-1 text-hush">
							<Link href={crumb.href} className="transition-colors hover:text-tangerine">
								{crumb.label}
							</Link>
							<span aria-hidden>/</span>
						</li>
					))}
					<li aria-current="page" className="min-w-0 truncate text-tangerine">
						{current}
					</li>
				</ol>
			</nav>
			{children}
		</div>
	);
}
