"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, Suspense, useState } from "react";
import { useCart } from "@/app/cart/cart-context";

export type NavLink = {
	href: string;
	label: string;
};

/** "page" on the link's own page, "true" on the pages below it. */
const currentFor = (pathname: string, href: string) =>
	pathname === href ? ("page" as const) : pathname.startsWith(`${href}/`) ? ("true" as const) : undefined;

function NavList({
	links,
	pathname,
	onNavigate,
}: {
	links: NavLink[];
	pathname?: string;
	onNavigate?: () => void;
}) {
	return links.map((link, index) => (
		<Fragment key={link.href}>
			<Link
				href={link.href}
				onClick={onNavigate}
				aria-current={pathname ? currentFor(pathname, link.href) : undefined}
				className="tap hover:underline aria-[current]:italic"
			>
				{link.label}
			</Link>
			{index < links.length - 1 && ", "}
		</Fragment>
	));
}

// Reads the pathname, so it sits in its own Suspense with an identical, unmarked fallback:
// the header stays in the prerendered shell and nothing shifts when the italics arrive.
function ActiveNavList({ links, onNavigate }: { links: NavLink[]; onNavigate?: () => void }) {
	const pathname = usePathname();
	return <NavList links={links} pathname={pathname} onNavigate={onNavigate} />;
}

/** The comma-separated links on the site grid, column 4 onwards, from 1024px. */
export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Main" className="max-lg:hidden lg:col-span-6 lg:col-start-4">
			<Suspense fallback={<NavList links={links} />}>
				<ActiveNavList links={links} />
			</Suspense>
		</nav>
	);
}

/** Below 1024px: a black screen with the navigation, opened by the header's "Menu". */
export function MobileMenu({
	storeName,
	links,
	accountHref,
}: {
	storeName: string;
	links: NavLink[];
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const { itemCount, openCart } = useCart();
	const close = () => setOpen(false);
	const allLinks = [...links, { href: "/search", label: "Search" }];

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button type="button" className="tap lg:hidden">
					Menu
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Content
					aria-describedby={undefined}
					className="fixed inset-0 z-50 flex flex-col bg-black p-3 text-white focus:outline-none lg:hidden"
				>
					<Dialog.Title className="sr-only">Menu</Dialog.Title>
					<div className="grid-site items-center">
						<Link href="/" onClick={close} className="tap truncate">
							{storeName}
						</Link>
						<div className="flex justify-between">
							<Dialog.Close asChild>
								<button type="button" className="tap italic" aria-label="Close menu">
									Menu
								</button>
							</Dialog.Close>
							<button
								type="button"
								className="tap"
								onClick={() => {
									close();
									openCart();
								}}
							>
								Cart ({itemCount})
							</button>
						</div>
					</div>
					<nav aria-label="Menu" className="my-auto text-title">
						<Suspense fallback={<NavList links={allLinks} onNavigate={close} />}>
							<ActiveNavList links={allLinks} onNavigate={close} />
						</Suspense>
					</nav>
					{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
					<a href={accountHref} className="tap self-start">
						Account
					</a>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
