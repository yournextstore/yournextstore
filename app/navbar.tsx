"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { LogoMark } from "@/components/logo-mark";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavItem = {
	title: string;
	href: string;
	description?: string;
};

export type NavGroup = {
	title: string;
	items: NavItem[];
	/** The first group ("Lobby") gets the original's feature tile beside its links. */
	featured?: boolean;
};

export type NavLink = { href: string; label: string };

type NavbarProps = {
	groups: NavGroup[];
	storeName: string;
	storeDescription: string;
	accountHref: string;
};

function MenuLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
	return (
		<li>
			<Link
				href={item.href}
				onClick={onNavigate}
				className="block select-none space-y-1 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
			>
				<span className="block text-sm font-medium leading-none">{item.title}</span>
				{item.description ? (
					<span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
						{item.description}
					</span>
				) : null}
			</Link>
		</li>
	);
}

function NavMenu({
	group,
	storeName,
	storeDescription,
}: {
	group: NavGroup;
	storeName: string;
	storeDescription: string;
}) {
	const [open, setOpen] = useState(false);
	// A hover opens the panel; the click that follows it on touch/mouse must not close it again.
	const openedByHover = useRef(false);
	const close = () => setOpen(false);

	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				if (!next || !openedByHover.current) {
					setOpen(next);
				}
				openedByHover.current = false;
			}}
		>
			<PopoverTrigger
				onPointerEnter={(event) => {
					if (event.pointerType === "mouse" && !open) {
						openedByHover.current = true;
						setOpen(true);
					}
				}}
				className="group inline-flex h-9 items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none data-[state=open]:bg-accent/50"
			>
				{group.title}
				<ChevronDown
					className="relative top-px size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
					aria-hidden="true"
				/>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={10}
				collisionPadding={16}
				onOpenAutoFocus={(event) => event.preventDefault()}
				className="w-auto max-w-[calc(100vw-2rem)] rounded-md p-0 shadow-lg"
			>
				{group.featured ? (
					<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
						<li className="row-span-3">
							<Link
								href="/"
								onClick={close}
								className="flex size-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<LogoMark className="size-6" />
								<span className="mt-4 mb-2 block text-lg font-medium">{storeName}</span>
								<span className="line-clamp-4 block text-sm leading-tight text-muted-foreground">
									{storeDescription}
								</span>
							</Link>
						</li>
						{group.items.map((item) => (
							<MenuLink key={item.href} item={item} onNavigate={close} />
						))}
					</ul>
				) : (
					<ul
						className={cn(
							"grid gap-3 p-4",
							group.items.length > 3 ? "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]" : "w-[320px]",
						)}
					>
						{group.items.map((item) => (
							<MenuLink key={item.href} item={item} onNavigate={close} />
						))}
					</ul>
				)}
			</PopoverContent>
		</Popover>
	);
}

export function Navbar({ groups, storeName, storeDescription, accountHref }: NavbarProps) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<>
			{/* Desktop: logo + dropdown menus, as the original's MainNav. */}
			<div className="hidden gap-6 lg:flex">
				<Link href="/" className="flex min-w-0 items-center gap-2">
					<LogoMark className="size-7 shrink-0" />
					<span className="max-w-52 truncate font-bold">{storeName}</span>
				</Link>
				<nav aria-label="Main" className="flex items-center gap-1">
					{groups.map((group) => (
						<NavMenu
							key={group.title}
							group={group}
							storeName={storeName}
							storeDescription={storeDescription}
						/>
					))}
				</nav>
			</div>

			{/* Below lg: hamburger + the original's left sheet with accordion groups. */}
			<Sheet open={open} onOpenChange={setOpen}>
				<div className="flex min-w-0 items-center gap-3 lg:hidden">
					<SheetTrigger asChild>
						<button
							type="button"
							aria-label="Open menu"
							className="-ml-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-accent"
						>
							<svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="size-5" aria-hidden="true">
								<path d="M3 5H11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M3 12H16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M3 19H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
					</SheetTrigger>
					<Link href="/" className="flex min-w-0 items-center gap-2">
						<LogoMark className="size-6 shrink-0" />
						<span className="truncate font-bold">{storeName}</span>
					</Link>
				</div>
				<SheetContent side="left" className="block w-[85vw] max-w-sm overflow-y-auto px-0 pt-9 pb-10">
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="px-7">
						<Link href="/" onClick={close} className="flex items-center gap-2">
							<LogoMark className="size-4" />
							<span className="font-bold">{storeName}</span>
						</Link>
						<div className="mt-6">
							<MobileSearchInput onNavigate={close} />
						</div>
					</div>
					<Accordion
						type="multiple"
						defaultValue={groups.slice(0, 1).map((g) => g.title)}
						className="mt-2 px-7"
					>
						{groups.map((group) => (
							<AccordionItem key={group.title} value={group.title}>
								<AccordionTrigger className="text-sm">{group.title}</AccordionTrigger>
								<AccordionContent>
									<ul className="flex flex-col gap-1">
										{group.items.map((item) => (
											<li key={item.href}>
												<Link
													href={item.href}
													onClick={close}
													className="block py-1.5 text-foreground/70 transition-colors hover:text-foreground"
												>
													{item.title}
												</Link>
											</li>
										))}
									</ul>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
					<div className="mt-6 px-7">
						{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
						<a
							href={accountHref}
							className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow"
						>
							Account
						</a>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
