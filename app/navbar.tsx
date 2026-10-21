"use client";

import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
	children?: NavLink[];
};

/**
 * The original's "Pages ≡" side panel: one slide-in menu from the left, opened by a text
 * trigger beside the logo on desktop and by a bordered hamburger on phones.
 */
export function Navbar({
	links,
	storeName,
	variant,
}: {
	links: NavLink[];
	storeName: string;
	variant: "desktop" | "mobile";
}) {
	const [open, setOpen] = useState(false);
	const [expanded, setExpanded] = useState<string | null>(null);
	// Read on open instead of usePathname(): the header stays in the prerendered shell.
	const [path, setPath] = useState("");

	const onOpenChange = (next: boolean) => {
		if (next) {
			setPath(window.location.pathname);
			setExpanded(null);
		}
		setOpen(next);
	};

	const linkClass = (href: string) =>
		cn(
			"block py-2.5 text-2xl font-bold transition-colors hover:text-ink",
			path === href ? "text-ink" : "text-soft-text",
		);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			{variant === "desktop" ? (
				<SheetTrigger
					aria-label="Open menu"
					className="hidden items-center gap-2 font-medium text-ink md:flex"
				>
					Pages
					<MenuIcon aria-hidden className="size-4" strokeWidth={2.5} />
				</SheetTrigger>
			) : (
				<SheetTrigger
					aria-label="Open menu"
					className="flex size-9 items-center justify-center rounded-md border border-border text-ink md:hidden"
				>
					<MenuIcon aria-hidden className="size-5" strokeWidth={2.25} />
				</SheetTrigger>
			)}
			<SheetContent
				side="left"
				showCloseButton={false}
				className="block gap-0 overflow-y-auto bg-background p-9 data-[side=left]:w-full data-[side=left]:border-r-0 data-[side=left]:sm:max-w-none data-[side=left]:md:w-96"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="mb-14 flex items-center justify-between gap-4">
					<Logo name={storeName} />
					<SheetClose className="p-2 text-ink" aria-label="Close menu">
						<XIcon aria-hidden className="size-6" />
					</SheetClose>
				</div>
				<ul className="space-y-2">
					{links.map((link) =>
						link.children ? (
							<li key={link.label}>
								<button
									type="button"
									onClick={() => setExpanded(expanded === link.label ? null : link.label)}
									aria-expanded={expanded === link.label}
									className={cn(
										"flex items-center gap-2 py-2.5 text-2xl font-bold transition-colors hover:text-ink",
										link.children.some((child) => child.href === path) ? "text-ink" : "text-soft-text",
									)}
								>
									{link.label}
									<ChevronDownIcon
										aria-hidden
										className={cn("size-6 transition-transform", expanded === link.label && "rotate-180")}
									/>
								</button>
								{expanded === link.label ? (
									<ul className="mt-1 mb-2 rounded-md bg-background p-4 shadow-md">
										{link.children.map((child) => (
											<li key={child.href} className="mb-2 last:mb-0">
												<Link
													href={child.href}
													onClick={() => setOpen(false)}
													className={cn(
														"block py-1 text-xl font-medium transition-colors hover:text-ink",
														path === child.href ? "text-ink" : "text-soft-text",
													)}
												>
													{child.label}
												</Link>
											</li>
										))}
									</ul>
								) : null}
							</li>
						) : (
							<li key={link.href}>
								<Link href={link.href} onClick={() => setOpen(false)} className={linkClass(link.href)}>
									{link.label}
								</Link>
							</li>
						),
					)}
				</ul>
			</SheetContent>
		</Sheet>
	);
}
