"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// The active state reads the pathname, so it lives in this small client component, rendered inside
// its own <Suspense> in the nav. The link primitive itself never reads usePathname (AGENTS.md).
export function ActiveLink({
	href,
	className,
	activeClassName,
	onClick,
	children,
}: {
	href: string;
	className: string;
	activeClassName: string;
	onClick?: () => void;
	children: ReactNode;
}) {
	const pathname = usePathname();
	const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

	return (
		<Link href={href} onClick={onClick} className={active ? activeClassName : className}>
			{children}
		</Link>
	);
}
