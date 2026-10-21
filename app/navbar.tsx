"use client";

import { ArrowRight, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type NavLink = {
	href: string;
	label: string;
	/** Mega-menu columns: a heading and its links. */
	groups?: { title: string; links: { href: string; label: string }[] }[];
	/** Mega-menu image tiles (the original pictures each collection). */
	tiles?: { href: string; label: string; image: string | null }[];
};

/** The original's taupe topbar: social links on the left (desktop), one centred message. */
export function Announcements({
	message,
	socials,
}: {
	message: string;
	socials: { label: string; url: string }[];
}) {
	return (
		<section aria-label="Announcement" className="bg-topbar text-on-topbar">
			<div className="shell relative flex h-10 items-center justify-center md:h-12">
				{socials.length > 0 && (
					<ul className="absolute left-5 hidden items-center gap-2 md:left-6 md:flex xl:left-10">
						{socials.slice(0, 4).map((social) => (
							<li key={social.label}>
								<a
									href={social.url}
									target="_blank"
									rel="noreferrer"
									className="inline-flex h-8 items-center rounded-full border border-on-topbar/40 px-3 text-xs transition-opacity hover:opacity-70"
								>
									{social.label}
								</a>
							</li>
						))}
					</ul>
				)}
				<p className="min-w-0 truncate text-center text-sm">{message}</p>
			</div>
		</section>
	);
}

/** Sticky greige header; once the page scrolls it picks up the original's soft header shadow. */
export function HeaderShell({ children }: { children: ReactNode }) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 60);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 border-b border-border bg-header text-on-header transition-shadow duration-300",
				scrolled && "shadow-[0_2px_5px_#0000000f]",
			)}
		>
			{children}
		</header>
	);
}

const linkClass =
	"relative flex h-full items-center gap-1 text-sm whitespace-nowrap text-on-header after:absolute after:inset-x-0 after:bottom-[calc(50%-0.9rem)] after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100";

/** Desktop nav (lg+): centred links; "Collections" opens a full-width panel of image tiles. */
export function Navbar({ links }: { links: NavLink[] }) {
	// No usePathname here: it would take the header out of the prerendered shell. The panel
	// opens on hover/focus with CSS (biome rejects pointer handlers on a wrapper div) and on
	// click through state; links close it on click.
	const [openMenu, setOpenMenu] = useState<string | null>(null);

	return (
		<nav aria-label="Main" className="hidden h-full items-center gap-6 lg:flex xl:gap-8">
			{links.map((link) =>
				link.groups && link.groups.length > 0 ? (
					<div key={link.label} className="group/menu flex h-full items-center">
						<button
							type="button"
							aria-expanded={openMenu === link.label}
							onClick={() => setOpenMenu((open) => (open === link.label ? null : link.label))}
							className={linkClass}
						>
							{link.label}
							<ChevronDown
								aria-hidden="true"
								className="h-3.5 w-3.5 transition-transform group-hover/menu:rotate-180"
								strokeWidth={1.5}
							/>
						</button>
						{/* Anchored to the sticky <header> (its containing block), not the button: full width, no overflow. */}
						<div
							className={cn(
								"absolute inset-x-0 top-full z-50 bg-header shadow-[0_8px_16px_-8px_rgb(0_0_0/0.12)] transition-[opacity,visibility] duration-200",
								openMenu === link.label
									? "visible opacity-100"
									: "invisible opacity-0 group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100",
							)}
						>
							<div className="shell py-8">
								<ul className="grid grid-cols-5 gap-4">
									{(link.tiles ?? []).slice(0, 5).map((tile) => (
										<li key={tile.href}>
											<Link
												href={tile.href}
												onClick={() => setOpenMenu(null)}
												className="group/tile relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-stage"
											>
												{tile.image && (
													<YNSMedia
														src={tile.image}
														alt=""
														fill
														sizes="20vw"
														className="object-cover transition-transform duration-500 group-hover/tile:scale-105"
													/>
												)}
												<span className="absolute inset-0 bg-black/25" />
												<span className="relative px-2 text-center font-serif text-2xl text-white">
													{tile.label}
												</span>
											</Link>
										</li>
									))}
								</ul>
								<div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
									{link.groups
										.flatMap((group) => group.links)
										.slice(0, 10)
										.map((child) => (
											<Link
												key={child.href}
												href={child.href}
												onClick={() => setOpenMenu(null)}
												className="text-on-header/80 transition-colors hover:text-on-header"
											>
												{child.label}
											</Link>
										))}
									<Link href={link.href} onClick={() => setOpenMenu(null)} className="link-reveal ml-auto">
										View all
										<ArrowRight aria-hidden="true" className="h-4 w-5" strokeWidth={1.25} />
									</Link>
								</div>
							</div>
						</div>
					</div>
				) : (
					<Link key={link.label} href={link.href} className={linkClass}>
						{link.label}
					</Link>
				),
			)}
		</nav>
	);
}

/** Mobile menu (below lg): the original's full-width greige panel with bold uppercase rows. */
export function MobileMenu({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const rowClass = "flex w-full items-center justify-between py-3 text-sm font-semibold uppercase";

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xs lg:hidden"
			>
				<Menu className="h-[22px] w-[22px]" strokeWidth={1.25} />
			</SheetTrigger>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="block max-w-none overflow-y-auto bg-header p-0 text-on-header data-[side=left]:w-full data-[side=left]:border-0 data-[side=left]:sm:max-w-sm"
			>
				<div className="flex items-center justify-between px-5 pt-6 pb-4">
					<SheetTitle className="text-sm font-semibold uppercase">Menu</SheetTitle>
					<SheetClose className="-mr-2 inline-flex h-10 w-10 items-center justify-center">
						<X className="h-5 w-5" strokeWidth={1.25} />
						<span className="sr-only">Close menu</span>
					</SheetClose>
				</div>
				<div className="px-5 pb-3">
					<MobileSearchInput onNavigate={close} />
				</div>
				<nav aria-label="Mobile" className="flex flex-col px-5 pb-10">
					{links.map((link) =>
						link.groups && link.groups.length > 0 ? (
							<details key={link.label} className="group">
								<summary
									className={cn(rowClass, "cursor-pointer list-none [&::-webkit-details-marker]:hidden")}
								>
									{link.label}
									<ChevronRight
										aria-hidden="true"
										className="h-5 w-5 transition-transform group-open:rotate-90"
										strokeWidth={1.25}
									/>
								</summary>
								<div className="space-y-5 pb-4 pl-3 normal-case">
									{link.groups.map((group) => (
										<div key={group.title}>
											<p className="text-xs font-medium tracking-[0.04em] text-muted-foreground uppercase">
												{group.title}
											</p>
											<ul className="mt-2">
												{group.links.map((child) => (
													<li key={child.href}>
														<Link href={child.href} onClick={close} className="block py-2 text-[15px]">
															{child.label}
														</Link>
													</li>
												))}
											</ul>
										</div>
									))}
									<Link href={link.href} onClick={close} className="link-reveal">
										Shop all
									</Link>
								</div>
							</details>
						) : (
							<Link key={link.label} href={link.href} onClick={close} className={rowClass}>
								{link.label}
							</Link>
						),
					)}
					<a href={accountHref} className={rowClass}>
						Account
					</a>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
