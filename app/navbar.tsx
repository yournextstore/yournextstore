"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FamilyDot } from "@/components/brand/family-dot";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { cn } from "@/lib/utils";

export type NavChild = { href: string; label: string; tone?: number };
export type NavLink = { href: string; label: string; children?: NavChild[] };

const linkClass =
	"relative inline-flex items-center gap-1.5 py-2 text-ink/80 transition-colors hover:text-ink data-[current=true]:text-ink";

/** The gold dot under the current item. */
function ActiveDot() {
	return (
		<span
			aria-hidden="true"
			className="absolute -bottom-1 left-1/2 hidden size-1 -translate-x-1/2 rounded-full bg-gold group-data-[current=true]/nav:block"
		/>
	);
}

function ChildLink({
	item,
	onClick,
	className,
}: {
	item: NavChild;
	onClick?: () => void;
	className?: string;
}) {
	return (
		<Link href={item.href} onClick={onClick} className={className}>
			{item.tone === undefined ? (
				<span aria-hidden="true" className="size-2 shrink-0" />
			) : (
				<FamilyDot index={item.tone} />
			)}
			{item.label}
		</Link>
	);
}

/** Hover, click and keyboard operable menu, as the original's. */
function NavDropdown({ link }: { link: NavLink }) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const openedByHover = useRef(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const panelId = useId();

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
				triggerRef.current?.focus();
			}
		};
		const onPointerDown = (e: PointerEvent) => {
			if (e.target instanceof Node && !rootRef.current?.contains(e.target)) setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onPointerDown);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [open]);

	useEffect(() => () => clearTimeout(closeTimer.current), []);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover opens the menu for mouse users; the button is the keyboard control
		<div
			ref={rootRef}
			className="relative"
			onMouseEnter={() => {
				clearTimeout(closeTimer.current);
				openedByHover.current = true;
				setOpen(true);
			}}
			onMouseLeave={() => {
				closeTimer.current = setTimeout(() => setOpen(false), 140);
			}}
			onBlur={(e) => {
				if (!(e.relatedTarget instanceof Node && rootRef.current?.contains(e.relatedTarget))) setOpen(false);
			}}
		>
			<button
				ref={triggerRef}
				type="button"
				aria-expanded={open}
				aria-controls={panelId}
				data-nav-match={link.children?.map((child) => child.href).join(" ")}
				onClick={() => {
					if (openedByHover.current) {
						openedByHover.current = false;
						setOpen(true);
						return;
					}
					setOpen((v) => !v);
				}}
				className={cn("group/nav cursor-pointer", linkClass)}
			>
				{link.label}
				<ChevronDownIcon className={cn("transition-transform duration-200", open && "rotate-180")} />
				<ActiveDot />
			</button>
			{open && (
				<ul
					id={panelId}
					className="absolute left-1/2 top-full z-10 mt-3 w-60 -translate-x-1/2 rounded-lg border border-line bg-page/85 p-2 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.7)] backdrop-blur-[10px]"
				>
					{link.children?.map((item) => (
						<li key={item.href}>
							<ChildLink
								item={item}
								onClick={() => {
									openedByHover.current = false;
									setOpen(false);
								}}
								className="flex h-11 items-center gap-3 rounded-md px-3 text-sm text-ink/90 transition-colors hover:bg-raised hover:text-ink"
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav aria-label="Primary" className="hidden lg:block">
			<ul className="flex items-center gap-7 text-[0.9375rem] xl:gap-10">
				{links.map((link) => (
					<li key={link.href}>
						{link.children?.length ? (
							<NavDropdown link={link} />
						) : (
							<Link href={link.href} data-nav-match={link.href} className={cn("group/nav", linkClass)}>
								{link.label}
								<ActiveDot />
							</Link>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

const matches = (pathname: string, href: string) => {
	const path = href.split(/[?#]/)[0] ?? href;
	return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
};

/**
 * Marks the current nav item. Reads the pathname in its own Suspense boundary and writes
 * aria-current onto the links, so the header itself stays in the prerendered shell.
 */
export function NavActive() {
	const pathname = usePathname();
	useEffect(() => {
		const items = document.querySelectorAll<HTMLElement>("[data-nav-match]");
		items.forEach((item) => {
			// A dropdown trigger lists its entries' paths and is current when one of them is.
			const hrefs = (item.dataset.navMatch ?? "").split(" ").filter(Boolean);
			const active = hrefs.some((href) => matches(pathname, href));
			item.dataset.current = String(active);
			if (active && item.tagName === "A") item.setAttribute("aria-current", "page");
			else item.removeAttribute("aria-current");
		});
	}, [pathname]);
	return null;
}

/** Full-screen menu for small screens. Locks page scroll while open. */
export function MobileMenu({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
		document.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	return (
		<>
			<button
				type="button"
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				aria-controls="mobile-menu"
				onClick={() => setOpen((v) => !v)}
				className="relative z-50 inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-ink/85 transition-colors hover:text-gold lg:hidden"
			>
				{open ? <CloseIcon /> : <MenuIcon />}
			</button>
			{open &&
				createPortal(
					<div
						id="mobile-menu"
						role="dialog"
						aria-modal="true"
						aria-label="Menu"
						className="fixed inset-0 z-30 overflow-y-auto bg-page px-6 pb-12 pt-28"
					>
						<MobileSearchInput onNavigate={close} />
						<nav aria-label="Mobile" className="mt-8">
							<ul className="divide-y divide-line border-y border-line">
								{links.map((link) => (
									<li key={link.href} className="py-4">
										<Link href={link.href} onClick={close} className="block font-display text-2xl text-ink">
											{link.label}
										</Link>
										{link.children?.length ? (
											<ul className="mt-3 grid grid-cols-2 gap-x-4">
												{link.children.map((child) => (
													<li key={child.href}>
														<ChildLink
															item={child}
															onClick={close}
															className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-ink"
														/>
													</li>
												))}
											</ul>
										) : null}
									</li>
								))}
							</ul>
						</nav>
					</div>,
					document.body,
				)}
		</>
	);
}
