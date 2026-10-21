"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
	/** Hidden below xl so the pill fits at 1024. */
	wide?: boolean;
};

const linkClass =
	"flex h-11 items-center whitespace-nowrap rounded-full px-4 text-sm transition-colors hover:bg-wash aria-[current=page]:bg-foreground aria-[current=page]:text-background";

/** The pill's section links; the current one is ink-filled. */
export function ActiveNavLinks({ links }: { links: NavLink[] }) {
	const pathname = usePathname();
	return <NavLinkList links={links} current={pathname} />;
}

/** Same links without the current-page state: the prerendered fallback. */
export function NavLinkList({ links, current }: { links: NavLink[]; current?: string }) {
	return (
		<>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					aria-current={current === link.href ? "page" : undefined}
					className={cn(linkClass, link.wide && "hidden xl:flex")}
				>
					{link.label}
				</Link>
			))}
		</>
	);
}
