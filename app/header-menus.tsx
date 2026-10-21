"use client";

import { ChevronDownIcon, ChevronRightIcon, MenuIcon, SearchIcon, XIcon } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useRef, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CatalogEntry, NavLink } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

const trigger =
	"flex h-[60px] items-center gap-[5px] px-[15px] text-uk-sm uppercase text-muted-foreground transition-colors hover:text-foreground group-hover/menu:text-foreground";
const panel =
	"invisible absolute inset-x-0 top-full z-50 border-t border-border bg-card opacity-0 shadow-[0_14px_25px_rgba(0,0,0,0.16)] transition-[opacity,visibility] duration-75 group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100";

function useDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const close = () => {
		setOpen(false);
		const active = document.activeElement;
		if (active instanceof HTMLElement && ref.current?.contains(active)) active.blur();
	};
	return { open, setOpen, ref, close };
}

/** UIkit navbar dropdown, "bottom-justify": spans the header container, opens on hover or click. */
export function CatalogMenu({ entries }: { entries: CatalogEntry[] }) {
	const { open, setOpen, ref, close } = useDropdown();
	return (
		<div ref={ref} className="group/menu">
			<button
				type="button"
				aria-expanded={open}
				onClick={() => setOpen((value) => !value)}
				className={trigger}
			>
				Catalog
				<ChevronDownIcon aria-hidden className="size-3" strokeWidth={1.5} />
			</button>
			<div className={cn(panel, open && "visible opacity-100")}>
				<div className="px-10 py-5">
					<ul className="flex flex-wrap justify-center gap-x-10">
						{entries.map((entry) => (
							<li key={entry.href} className="my-5 w-[180px]">
								<Link href={entry.href} onClick={close} className="group/entry block text-center">
									<span className="relative mx-auto mb-5 block size-20 overflow-hidden rounded-full bg-muted">
										{entry.image && (
											<YNSMedia src={entry.image} alt="" fill sizes="80px" className="object-cover" />
										)}
									</span>
									<span className="block font-medium text-foreground group-hover/entry:text-primary">
										{entry.name}
									</span>
									{entry.note && (
										<span className="mt-[2px] line-clamp-2 block text-uk-xs text-muted-foreground">
											{entry.note}
										</span>
									)}
								</Link>
							</li>
						))}
						<li className="my-5 w-[180px]">
							<Link href="/products" onClick={close} className="group/entry block text-center">
								<span className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full border border-border text-uk-h2 font-light text-foreground">
									All
								</span>
								<span className="block font-medium text-foreground group-hover/entry:text-primary">
									Every product
								</span>
								<span className="mt-[2px] block text-uk-xs text-muted-foreground">The full catalog</span>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export function PagesMenu({ pages }: { pages: NavLink[] }) {
	const { open, setOpen, ref, close } = useDropdown();
	return (
		<div ref={ref} className="group/menu">
			<button
				type="button"
				aria-expanded={open}
				onClick={() => setOpen((value) => !value)}
				className={trigger}
			>
				Pages
				<ChevronDownIcon aria-hidden className="size-3" strokeWidth={1.5} />
			</button>
			<div className={cn(panel, open && "visible opacity-100")}>
				<ul className="mx-auto max-w-[900px] columns-3 gap-10 px-10 py-[30px]">
					{pages.map((page) => (
						<li key={page.href}>
							<Link
								href={page.href}
								onClick={close}
								className="block py-[5px] text-uk-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{page.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

/** UIkit search drop: a full-width bar under the navbar with one input and a close button. */
export function SearchToggle() {
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<button
				type="button"
				aria-label="Search"
				aria-expanded={open}
				onClick={() => {
					setOpen((value) => !value);
					requestAnimationFrame(() => inputRef.current?.focus());
				}}
				className="flex h-[60px] w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground lg:w-[50px]"
			>
				<SearchIcon aria-hidden className="size-5" strokeWidth={1.25} />
			</button>
			<div
				className={cn(
					"absolute inset-x-0 top-full z-50 border-t border-border bg-card p-[15px] shadow-[0_14px_25px_rgba(0,0,0,0.16)]",
					!open && "hidden",
				)}
			>
				<div className="flex items-center gap-[15px]">
					<Form action="/search" className="flex-1" onSubmit={() => setOpen(false)}>
						<label htmlFor="header-search" className="sr-only">
							Search products
						</label>
						<input
							ref={inputRef}
							id="header-search"
							type="search"
							name="q"
							placeholder="Search…"
							className="h-10 w-full bg-transparent text-uk-lg text-foreground outline-none placeholder:text-muted-foreground"
						/>
					</Form>
					<button
						type="button"
						aria-label="Close search"
						onClick={() => setOpen(false)}
						className="flex size-10 items-center justify-center text-muted-foreground hover:text-foreground"
					>
						<XIcon aria-hidden className="size-4" strokeWidth={1.5} />
					</button>
				</div>
			</div>
		</>
	);
}

const offcanvasRow =
	"flex items-center justify-between border-b border-border px-5 py-[15px] text-muted-foreground transition-colors hover:text-foreground";

export function MobileMenu({
	storeName,
	entries,
	pages,
	accountHref,
	freeShipping,
	socials,
}: {
	storeName: string;
	entries: CatalogEntry[];
	pages: NavLink[];
	accountHref: string;
	freeShipping: string | null;
	socials: NavLink[];
}) {
	const [open, setOpen] = useState(false);
	const [catalogOpen, setCatalogOpen] = useState(false);
	const close = () => setOpen(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Open menu"
				className="-ml-[10px] flex h-[60px] w-10 items-center justify-center text-muted-foreground hover:text-foreground lg:hidden"
			>
				<MenuIcon aria-hidden className="size-5" strokeWidth={1.25} />
			</SheetTrigger>
			<SheetContent
				side="left"
				className="block gap-0 overflow-y-auto bg-card p-0 shadow-none data-[side=left]:w-[270px]"
			>
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">Site navigation</SheetDescription>
				<div className="border-b border-border px-5 py-[15px] pr-12">
					<p className="text-uk-md font-medium text-foreground">{storeName}</p>
					{freeShipping && (
						<p className="text-uk-xs text-muted-foreground">Free shipping on orders over {freeShipping}</p>
					)}
				</div>
				<nav aria-label="Mobile">
					<ul>
						<li>
							<button
								type="button"
								aria-expanded={catalogOpen}
								onClick={() => setCatalogOpen((value) => !value)}
								className={cn(offcanvasRow, "w-full text-left")}
							>
								Catalog
								<ChevronRightIcon
									aria-hidden
									className={cn("size-4 transition-transform", catalogOpen && "rotate-90")}
									strokeWidth={1.25}
								/>
							</button>
							{catalogOpen && (
								<ul className="border-b border-border bg-muted py-[5px]">
									{entries.map((entry) => (
										<li key={entry.href}>
											<Link
												href={entry.href}
												onClick={close}
												className="block px-[30px] py-[8px] text-uk-sm text-muted-foreground hover:text-foreground"
											>
												{entry.name}
											</Link>
										</li>
									))}
								</ul>
							)}
						</li>
						<li>
							<Link href="/products" onClick={close} className={offcanvasRow}>
								Products
							</Link>
						</li>
						{pages.slice(0, 4).map((page) => (
							<li key={page.href}>
								<Link href={page.href} onClick={close} className={offcanvasRow}>
									{page.label}
								</Link>
							</li>
						))}
					</ul>
					<ul className="border-b border-border px-5 py-[15px]">
						<li>
							<a
								href={accountHref}
								className="block py-[5px] text-uk-sm text-muted-foreground hover:text-foreground"
							>
								Account &amp; orders
							</a>
						</li>
						{pages.slice(4).map((page) => (
							<li key={page.href}>
								<Link
									href={page.href}
									onClick={close}
									className="block py-[5px] text-uk-sm text-muted-foreground hover:text-foreground"
								>
									{page.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				{socials.length > 0 && (
					<ul className="flex flex-wrap justify-center gap-5 px-5 py-5">
						{socials.map((social) => (
							<li key={social.href}>
								<a
									href={social.href}
									target="_blank"
									rel="noreferrer"
									className="text-uk-sm text-muted-foreground hover:text-foreground"
								>
									{social.label}
								</a>
							</li>
						))}
					</ul>
				)}
			</SheetContent>
		</Sheet>
	);
}
