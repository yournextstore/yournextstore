"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { pad2 } from "@/lib/pad";
import { YNSMedia } from "@/lib/yns-media";

export type NavLink = {
	href: string;
	label: string;
};

type Featured = { name: string; href: string; image: string; price: string | null } | null;

const isCurrent = (href: string, pathname: string) =>
	href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Marks the active nav link with `aria-current`. Reading `usePathname()` in the header would
 * stream it out of the prerendered shell, so this renders nothing and patches the DOM: once
 * on mount, then whenever the page content is swapped by a client navigation.
 */
export function NavCurrent() {
	useEffect(() => {
		let frame = 0;
		const update = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const { pathname } = window.location;
				for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")) {
					const href = link.getAttribute("href") ?? "";
					if (isCurrent(href, pathname)) {
						link.setAttribute("aria-current", "page");
					} else {
						link.removeAttribute("aria-current");
					}
				}
			});
		};
		update();
		const main = document.getElementById("main-content");
		const observer = new MutationObserver(update);
		if (main) observer.observe(main, { childList: true, subtree: true });
		window.addEventListener("popstate", update);
		return () => {
			observer.disconnect();
			window.removeEventListener("popstate", update);
			cancelAnimationFrame(frame);
		};
	}, []);
	return null;
}

export function MobileMenu({
	links,
	featured,
	accountHref,
}: {
	links: NavLink[];
	featured: Featured;
	accountHref: string;
}) {
	const [open, setOpen] = useState(false);
	const [pathname, setPathname] = useState("");
	const { itemCount, openCart } = useCart();

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(next) => {
				if (next) setPathname(window.location.pathname);
				setOpen(next);
			}}
		>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="-mr-2 inline-flex size-10 items-center justify-center transition-colors hover:text-walnut lg:hidden"
				>
					<span className="sr-only">Open menu</span>
					<span className="flex w-[1.125rem] flex-col gap-[5px]" aria-hidden="true">
						<span className="h-px w-full bg-current" />
						<span className="h-px w-full bg-current" />
					</span>
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Content
					className="menu-panel fixed inset-0 z-[60] h-dvh overflow-y-auto bg-background lg:hidden"
					aria-describedby={undefined}
				>
					<div className="flex min-h-full flex-col px-6 pb-8">
						<div className="flex h-[4.5rem] shrink-0 items-center justify-between">
							<Dialog.Title className="wordmark">Menu</Dialog.Title>
							<Dialog.Close className="relative z-10 -mr-2 inline-flex size-10 items-center justify-center transition-colors hover:text-walnut">
								<span className="sr-only">Close menu</span>
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.25"
									aria-hidden="true"
								>
									<path d="M5 5l14 14" />
									<path d="M19 5L5 19" />
								</svg>
							</Dialog.Close>
						</div>

						<ul className="mt-6 border-t border-border">
							{links.map((link, index) => {
								const current = isCurrent(link.href, pathname);
								return (
									<li
										key={link.href}
										className="menu-item border-b border-border"
										style={{ "--i": index } as React.CSSProperties}
									>
										<Link
											href={link.href}
											onClick={() => setOpen(false)}
											aria-current={current ? "page" : undefined}
											className={`flex items-baseline gap-4 py-5 transition-colors hover:text-walnut ${current ? "" : "text-muted-foreground"}`}
										>
											<span className="mono text-[0.6875rem] text-walnut">{pad2(index + 1)}</span>
											<span className="type-h3">{link.label}</span>
										</Link>
									</li>
								);
							})}
							<li
								className="menu-item border-b border-border"
								style={{ "--i": links.length } as React.CSSProperties}
							>
								<button
									type="button"
									onClick={() => {
										setOpen(false);
										openCart();
									}}
									className="flex w-full items-baseline gap-4 py-5 text-left text-muted-foreground transition-colors hover:text-walnut"
								>
									<span className="mono text-[0.6875rem] text-walnut">{pad2(links.length + 1)}</span>
									<span className="type-h3">Cart</span>
									<span className="mono ml-auto self-center text-[0.6875rem]">
										{pad2(itemCount)}
										<span className="sr-only"> items</span>
									</span>
								</button>
							</li>
						</ul>

						<div
							className="menu-item mt-6 flex gap-6"
							style={{ "--i": links.length + 1 } as React.CSSProperties}
						>
							<Link
								href="/search"
								onClick={() => setOpen(false)}
								className="link link-mono text-muted-foreground"
							>
								Search
							</Link>
							<a href={accountHref} className="link link-mono text-muted-foreground">
								Account
							</a>
						</div>

						{featured && (
							<Link
								href={featured.href}
								onClick={() => setOpen(false)}
								className="menu-item group mt-auto block pt-8"
								style={{ "--i": links.length + 2 } as React.CSSProperties}
							>
								<div className="relative aspect-[16/10] max-h-[28dvh] w-full overflow-hidden bg-surface">
									<YNSMedia
										src={featured.image}
										alt=""
										fill
										sizes="100vw"
										className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
									/>
								</div>
								<div className="mt-3 flex items-baseline justify-between gap-4">
									<p className="label min-w-0 truncate">Featured — {featured.name}</p>
									{featured.price && <p className="mono shrink-0 text-[0.6875rem]">{featured.price}</p>}
								</div>
							</Link>
						)}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
