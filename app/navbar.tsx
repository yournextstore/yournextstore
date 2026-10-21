"use client";

import { ChevronDownIcon, CommandIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavGroup } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

const triggerClass =
	"inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 text-sm text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/** One "Categories"/"Collections" trigger with the shadcn navigation-menu panel under it. */
function GroupMenu({ group }: { group: NavGroup }) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const [featured, ...rest] = group.entries;
	const list = rest.length > 0 ? rest : group.entries;

	// Hover opens the panel through CSS; a click pins it until the next outside click or Escape.
	useEffect(() => {
		if (!open) return;
		const onPointer = (e: PointerEvent) => {
			if (!(e.target instanceof Node && rootRef.current?.contains(e.target))) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("pointerdown", onPointer);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onPointer);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	return (
		<div ref={rootRef} className="group/menu relative">
			<button
				type="button"
				className={cn(triggerClass, "group-hover/menu:bg-accent", open && "bg-accent text-accent-foreground")}
				aria-expanded={open}
				onClick={() => setOpen((value) => !value)}
			>
				{group.label}
				<ChevronDownIcon
					className={cn(
						"h-3 w-3 transition-transform duration-200 group-hover/menu:rotate-180",
						open && "rotate-180",
					)}
					aria-hidden
				/>
			</button>
			<div
				className={cn(
					"absolute left-0 top-full z-50 pt-1.5 transition-[opacity,transform] duration-150",
					open
						? "visible translate-y-0 opacity-100"
						: "invisible -translate-y-1 opacity-0 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100",
				)}
			>
				<ul className="grid w-[400px] gap-3 rounded-md border bg-popover p-4 text-popover-foreground shadow-md lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
					{featured && (
						<li className="row-span-3">
							<Link
								href={featured.href}
								onClick={() => setOpen(false)}
								className="flex h-full min-h-40 w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
							>
								<span className="mb-2 mt-4 text-lg font-medium">{featured.label}</span>
								<span className="line-clamp-3 text-sm leading-tight text-muted-foreground">
									{featured.description ?? `Browse ${featured.label}.`}
								</span>
							</Link>
						</li>
					)}
					{list.map((entry) => (
						<li key={entry.href}>
							<Link
								href={entry.href}
								onClick={() => setOpen(false)}
								className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
							>
								<span className="block text-sm font-medium leading-none">{entry.label}</span>
								<span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
									{entry.description ?? `Shop ${entry.label}`}
								</span>
							</Link>
						</li>
					))}
					<li>
						<Link
							href={group.href}
							onClick={() => setOpen(false)}
							className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
						>
							<span className="block text-sm font-medium leading-none">All products</span>
							<span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
								Everything in the shop, in one list.
							</span>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}

export function MainNav({ storeName, groups }: { storeName: string; groups: NavGroup[] }) {
	return (
		<div className="hidden min-w-0 items-center gap-4 md:flex">
			<Link href="/" className="flex items-center truncate font-medium">
				{storeName}
			</Link>
			<nav aria-label="Main" className="flex items-center gap-1">
				<Link href="/products" className={triggerClass}>
					Products
				</Link>
				{groups.map((group) => (
					<GroupMenu key={group.label} group={group} />
				))}
			</nav>
		</div>
	);
}

export function MobileNav({
	storeName,
	groups,
	links,
}: {
	storeName: string;
	groups: NavGroup[];
	links: NavLink[];
}) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-ml-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent md:hidden"
			>
				<MenuIcon className="h-5 w-5" aria-hidden />
			</SheetTrigger>
			<SheetContent side="left" className="gap-0 pr-0">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<Link
					href="/"
					onClick={() => setOpen(false)}
					className="mx-6 mt-6 flex items-center gap-2 text-lg font-medium"
				>
					<CommandIcon className="h-6 w-6" aria-hidden />
					{storeName}
				</Link>
				<div className="mt-5 mr-6 ml-6">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
				<ScrollArea className="my-4 h-[calc(100svh-10rem)] pb-10 pl-6">
					<nav aria-label="Mobile" className="flex flex-col space-y-3 pr-6">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="text-foreground transition-colors hover:text-foreground/70"
							>
								{link.label}
							</Link>
						))}
						{groups.map((group) => (
							<div key={group.label} className="flex flex-col space-y-3 pt-6">
								<h2 className="font-medium">{group.label}</h2>
								{group.entries.map((entry) => (
									<Link
										key={entry.href}
										href={entry.href}
										onClick={() => setOpen(false)}
										className="text-muted-foreground transition-colors hover:text-foreground"
									>
										{entry.label}
									</Link>
								))}
							</div>
						))}
					</nav>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
