import Link from "next/link";

export type NavLink = {
	href: string;
	label: string;
};

/** The original's nav: a plain row of links that wraps under the logo on phones, no drawer. */
export function Navbar({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="min-w-0">
			<ul className="flex flex-wrap gap-x-4 gap-y-3 sm:gap-x-8">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className="text-[0.95rem] text-foreground/90 transition-colors hover:text-foreground hover:underline hover:decoration-sky-dot hover:decoration-2 hover:underline-offset-8"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
