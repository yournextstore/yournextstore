import Link from "next/link";
import type { ReactNode } from "react";

export type NavLink = {
	href: string;
	label: string;
};

const item = "inline-flex h-6 items-center whitespace-nowrap";

/**
 * Photon's one-line menu: the same row at every width, items pushed to the edges with
 * `justify-between`. Search and Account join it from `sm`; phones reach them in the footer.
 */
export function Navbar({
	links,
	accountHref,
	children,
}: {
	links: NavLink[];
	accountHref: string;
	children: ReactNode;
}) {
	return (
		<nav aria-label="Main">
			<ul className="photon-inset flex items-center justify-between gap-x-3">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className={item}>
							{link.label}
						</Link>
					</li>
				))}
				<li className="hidden sm:block">
					<Link href="/search" className={item}>
						Search
					</Link>
				</li>
				<li className="hidden sm:block">
					{/* Plain <a>: /account is a proxied zone, a soft navigation 500s. */}
					<a href={accountHref} className={item}>
						Account
					</a>
				</li>
				<li className="min-w-[50px] text-right">{children}</li>
			</ul>
		</nav>
	);
}
