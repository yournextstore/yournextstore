"use client";

import { ChevronDown, Gem, Menu } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
	description?: string;
};

export type NavData = {
	storeName: string;
	storeDescription: string | null;
	/** Categories shown as top-level links (the fourth only from xl, where the bar has room). */
	primary: NavLink[];
	/** The rest of the catalogue, under "More". */
	more: NavLink[];
	/** About, FAQ, contact, blog: the original's "About us" panel. */
	about: NavLink[];
};

const triggerClass =
	"inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm xl:px-4 font-medium tracking-tight text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring whitespace-nowrap";

function MenuItem({
	link,
	onNavigate,
	className,
}: {
	link: NavLink;
	onNavigate: () => void;
	className?: string;
}) {
	return (
		<li className={className}>
			<Link
				href={link.href}
				onClick={onNavigate}
				className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
			>
				<span className="block text-sm font-medium leading-none text-foreground">{link.label}</span>
				{link.description ? (
					<span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
						{link.description}
					</span>
				) : null}
			</Link>
		</li>
	);
}

/**
 * A hover/click panel in the manner of the original's NavigationMenu. The panel is anchored to the
 * nav (the nearest positioned box), not to its trigger, so wide panels never leave the header.
 */
function Dropdown({
	id,
	label,
	open,
	onToggle,
	onClose,
	panelClassName,
	children,
}: {
	id: string;
	label: string;
	open: boolean;
	onToggle: () => void;
	onClose: () => void;
	panelClassName?: string;
	children: ReactNode;
}) {
	return (
		<li className="group/menu">
			<button
				type="button"
				className={cn(triggerClass, open && "bg-accent text-accent-foreground")}
				aria-expanded={open}
				aria-controls={id}
				onClick={onToggle}
				onKeyDown={(event) => {
					if (event.key === "Escape") onClose();
				}}
			>
				{label}
				<ChevronDown
					aria-hidden="true"
					className={cn(
						"relative top-px size-3 transition-transform duration-200 group-hover/menu:rotate-180",
						open && "rotate-180",
					)}
				/>
			</button>
			{/* pt-1.5 bridges the gap so the pointer can travel from trigger to panel. */}
			<div
				id={id}
				className={cn(
					"invisible absolute left-0 top-full z-50 pt-1.5 opacity-0 transition-opacity duration-150 group-hover/menu:visible group-hover/menu:opacity-100",
					open && "visible opacity-100",
				)}
			>
				<div
					className={cn(
						"overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg",
						panelClassName,
					)}
				>
					{children}
				</div>
			</div>
		</li>
	);
}

function DesktopNav({ data }: { data: NavData }) {
	const [open, setOpen] = useState<string | null>(null);
	const navRef = useRef<HTMLElement>(null);
	const close = () => setOpen(null);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (navRef.current && !navRef.current.contains(event.target as Node)) setOpen(null);
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(null);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	const toggle = (key: string) => setOpen((current) => (current === key ? null : key));
	const [fourth] = data.primary.slice(3);

	return (
		<nav ref={navRef} aria-label="Main" className="relative hidden lg:block">
			<ul className="flex items-center gap-1">
				{data.primary.map((link, index) => (
					<li key={link.href} className={index === 3 ? "hidden xl:block" : undefined}>
						<Link href={link.href} className={triggerClass}>
							{link.label}
						</Link>
					</li>
				))}
				{data.more.length > 0 || fourth ? (
					<Dropdown
						id="nav-more"
						label="More"
						open={open === "more"}
						onToggle={() => toggle("more")}
						onClose={close}
					>
						<ul className="grid w-[420px] gap-1 p-3 md:grid-cols-2">
							{fourth ? <MenuItem link={fourth} onNavigate={close} className="xl:hidden" /> : null}
							{data.more.map((link) => (
								<MenuItem key={link.href} link={link} onNavigate={close} />
							))}
						</ul>
					</Dropdown>
				) : null}
				<Dropdown
					id="nav-about"
					label="About"
					open={open === "about"}
					onToggle={() => toggle("about")}
					onClose={close}
				>
					<ul className="grid w-[500px] grid-cols-[.75fr_1fr] gap-3 p-5">
						<li className="row-span-3">
							<Link
								href="/"
								onClick={close}
								className="flex size-full min-h-40 select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<Gem aria-hidden="true" className="size-5" />
								<span className="mt-4 mb-2 block text-lg font-medium">{data.storeName}</span>
								{data.storeDescription ? (
									<span className="line-clamp-4 block text-xs leading-tight text-muted-foreground">
										{data.storeDescription}
									</span>
								) : null}
							</Link>
						</li>
						{data.about.map((link) => (
							<MenuItem key={link.href} link={link} onNavigate={close} />
						))}
					</ul>
				</Dropdown>
			</ul>
		</nav>
	);
}

function MobileNav({ data }: { data: NavData }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const shop = [...data.primary, ...data.more];

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-ml-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent lg:hidden"
				>
					<Menu aria-hidden="true" className="size-5" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="block w-[85vw] max-w-sm overflow-y-auto p-0">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="px-7 pt-6">
					<Link href="/" onClick={close} className="flex items-center gap-2">
						<Gem aria-hidden="true" className="size-4" />
						<span className="font-bold">{data.storeName}</span>
					</Link>
				</div>
				<div className="px-6 pt-6">
					<MobileSearchInput onNavigate={close} />
				</div>
				<Accordion type="multiple" defaultValue={["shop"]} className="w-full px-6 pt-2 pb-10">
					<AccordionItem value="shop">
						<AccordionTrigger className="text-sm">Shop</AccordionTrigger>
						<AccordionContent>
							<ul className="flex flex-col gap-1">
								{shop.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={close}
											className="block rounded-md px-1 py-2 text-foreground/70 transition-colors hover:text-foreground"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="about">
						<AccordionTrigger className="text-sm">About</AccordionTrigger>
						<AccordionContent>
							<ul className="flex flex-col gap-1">
								{data.about.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={close}
											className="block rounded-md px-1 py-2 text-foreground/70 transition-colors hover:text-foreground"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</SheetContent>
		</Sheet>
	);
}

export function Navbar({ data }: { data: NavData }) {
	return (
		<div className="flex min-w-0 items-center gap-3 lg:gap-6 xl:gap-10">
			<MobileNav data={data} />
			<Link
				href="/"
				className="truncate text-lg font-semibold uppercase tracking-tight xs:text-xl sm:text-2xl lg:text-xl xl:text-2xl"
			>
				{data.storeName}
			</Link>
			<DesktopNav data={data} />
		</div>
	);
}
