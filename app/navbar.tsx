import { Suspense } from "react";
import { ActiveLink } from "@/components/active-link";

export type NavLink = {
	href: string;
	label: string;
};

// Desktop navigation. The mobile sheet lives in components/mobile-nav.tsx.
export function Navbar({ links }: { links: NavLink[] }) {
	return (
		<nav className="hidden md:flex space-x-12 text-sm font-medium items-center tracking-wide text-muted-foreground">
			<Suspense>
				{links.map((link) => (
					<ActiveLink
						key={link.href}
						href={link.href}
						className="hover:text-primary transition-colors"
						activeClassName="text-foreground border-b-2 border-primary pb-1"
					>
						{link.label}
					</ActiveLink>
				))}
			</Suspense>
		</nav>
	);
}
