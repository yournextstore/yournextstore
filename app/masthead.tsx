"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CartButton } from "@/app/cart-button";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import type { HeaderData } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Panel = "mega" | "search" | null;

function SearchIcon() {
	return (
		<svg
			aria-hidden
			width="17"
			height="17"
			viewBox="0 0 17 17"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.1"
		>
			<circle cx="7.2" cy="7.2" r="5.4" />
			<line x1="11.2" y1="11.2" x2="16" y2="16" />
		</svg>
	);
}

function AccountIcon() {
	return (
		<svg
			aria-hidden
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.1"
		>
			<circle cx="8" cy="5" r="3.6" />
			<path d="M1.2 16.2c.6-3.4 3.4-5.6 6.8-5.6s6.2 2.2 6.8 5.6" />
		</svg>
	);
}

/**
 * The fixed-feel masthead of the original, kept in the prerendered shell: it never reads the
 * pathname. Transparency over a hero is CSS (`[data-hero]` in globals.css); this component only
 * flips `data-solid` once the hero has scrolled under it and owns the mega menu and search panels.
 */
export function Masthead({ data, accountHref }: { data: HeaderData; accountHref: string }) {
	const { storeName, tagline, categories, lastChance } = data;
	const headerRef = useRef<HTMLElement>(null);
	const [panel, setPanel] = useState<Panel>(null);
	const close = () => setPanel(null);
	// Hover opens the mega menu; the click that usually follows that hover must not close it again.
	const openedByHover = useRef(false);

	useEffect(() => {
		const header = headerRef.current;
		const main = document.getElementById("main");
		if (!header) return;
		const update = () => {
			const hero = document.querySelector<HTMLElement>("[data-hero]");
			const solid = !hero || hero.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom + 1;
			header.dataset.solid = solid ? "true" : "false";
		};
		update();
		// Leaving the masthead closes a hover-opened mega menu (search stays until dismissed).
		const onLeave = () => setPanel((p) => (p === "mega" ? null : p));
		header.addEventListener("mouseleave", onLeave);
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update, { passive: true });
		const observer = new MutationObserver(update);
		if (main) observer.observe(main, { childList: true, subtree: true });
		return () => {
			header.removeEventListener("mouseleave", onLeave);
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!panel) {
			openedByHover.current = false;
			return;
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setPanel(null);
		};
		const onPointer = (e: PointerEvent) => {
			if (headerRef.current && !headerRef.current.contains(e.target as Node)) setPanel(null);
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onPointer);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onPointer);
		};
	}, [panel]);

	const openMegaOnHover = () => {
		if (panel !== "mega") openedByHover.current = true;
		setPanel("mega");
	};
	const toggleMega = () => {
		if (openedByHover.current) {
			openedByHover.current = false;
			return;
		}
		setPanel((p) => (p === "mega" ? null : "mega"));
	};
	const hoverOff = () => {
		openedByHover.current = false;
		setPanel((p) => (p === "mega" ? null : p));
	};

	const navItems = (
		<>
			<Link href="/products" onMouseEnter={hoverOff} onClick={close} className="shrink-0">
				New In
			</Link>
			<button
				type="button"
				onClick={toggleMega}
				onMouseEnter={openMegaOnHover}
				aria-expanded={panel === "mega"}
				aria-controls="masthead-mega"
				className={cn("cap shrink-0 cursor-pointer", panel === "mega" && "link-u")}
			>
				Shop
			</button>
			{lastChance && (
				<Link
					href={lastChance.href}
					onMouseEnter={hoverOff}
					onClick={close}
					className="shrink-0 decoration-acc"
				>
					Last Chance
				</Link>
			)}
			<Link href="/#looks" onMouseEnter={hoverOff} onClick={close} className="shrink-0 sm:max-md:hidden">
				Shop the Look
			</Link>
		</>
	);

	return (
		<header ref={headerRef} id="site-header" className="site-header sticky top-0 z-40" data-solid="true">
			<div className="mx-auto flex h-[60px] max-w-[1640px] items-center justify-between gap-4 px-4 sm:grid sm:h-[86px] sm:grid-cols-[1fr_auto_1fr] sm:px-5 lg:px-9">
				<nav aria-label="Main" className="cap hidden items-center gap-4 whitespace-nowrap sm:flex lg:gap-7">
					{navItems}
				</nav>
				<Link
					href="/"
					onMouseEnter={hoverOff}
					onClick={close}
					className="flex min-w-0 flex-col items-end gap-1.5 sm:items-center"
				>
					<span className="max-w-full truncate text-[11px] font-normal uppercase leading-none tracking-[0.26em] min-[400px]:text-[12px] min-[400px]:tracking-[0.3em] sm:text-[clamp(14px,1.5vw,24px)] sm:tracking-[0.42em] sm:[text-indent:0.42em]">
						{storeName}
					</span>
					{tagline && (
						<span
							className="max-w-full truncate text-[7px] uppercase leading-none tracking-[0.44em] opacity-80"
							style={{ textIndent: "0.44em" }}
						>
							{tagline}
						</span>
					)}
				</Link>
				<div className="order-first flex shrink-0 items-center justify-end gap-1 sm:order-none lg:gap-3">
					<button
						type="button"
						aria-label="Search"
						aria-expanded={panel === "search"}
						aria-controls="masthead-search"
						onClick={() => setPanel((p) => (p === "search" ? null : "search"))}
						className="flex size-9 cursor-pointer items-center justify-center"
					>
						<SearchIcon />
					</button>
					{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). */}
					<a href={accountHref} aria-label="Account" className="flex size-9 items-center justify-center">
						<AccountIcon />
					</a>
					<CartButton />
				</div>
			</div>

			{/* Mobile: every destination reachable without a burger, as in the original. */}
			<nav
				aria-label="Main mobile"
				className="nav-rule cap no-scrollbar flex h-[42px] items-center gap-6 overflow-x-auto whitespace-nowrap border-t border-current/15 px-4 sm:hidden"
			>
				{navItems}
			</nav>

			<MegaPanel open={panel === "mega"} categories={categories} lastChance={lastChance} onNavigate={close} />
			<SearchPanel open={panel === "search"} categories={categories} onClose={close} />
		</header>
	);
}

function panelClass(open: boolean) {
	return cn(
		"absolute inset-x-0 top-full border-b border-line bg-background text-foreground transition-[opacity,transform,visibility] duration-300",
		open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2.5 opacity-0",
	);
}

function MegaPanel({
	open,
	categories,
	lastChance,
	onNavigate,
}: {
	open: boolean;
	categories: HeaderData["categories"];
	lastChance: HeaderData["lastChance"];
	onNavigate: () => void;
}) {
	const highlights = [
		{ href: "/products", label: "New arrivals" },
		{ href: "/products?sort=price-desc", label: "The signature pieces" },
		{ href: "/products?sort=price-asc", label: "Little luxuries" },
		...(lastChance ? [{ href: lastChance.href, label: "Last chance" }] : []),
		{ href: "/#looks", label: "Shop the look" },
	];

	return (
		<div
			id="masthead-mega"
			data-open={open}
			className={cn(panelClass(open), "max-h-[calc(100svh-100px)] overflow-y-auto overscroll-contain")}
		>
			<div className="mx-auto grid max-w-[1640px] gap-10 px-5 py-10 sm:py-12 md:grid-cols-[1fr_1fr_1.2fr] lg:gap-16 lg:px-9">
				<div>
					<p className="cap-xs mb-6 text-faint">Categories</p>
					<ul className="flex flex-col gap-3 text-[12px] tracking-[0.05em]">
						<li>
							<Link href="/products" onClick={onNavigate} className="hover:link-u">
								View all
							</Link>
						</li>
						{categories.map((category) => (
							<li key={category.id}>
								<Link href={category.href} onClick={onNavigate} className="hover:link-u">
									{category.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<p className="cap-xs mb-6 text-faint">Highlights</p>
					<ul className="flex flex-col gap-3 text-[12px] tracking-[0.05em]">
						{highlights.map((item) => (
							<li key={item.label}>
								<Link href={item.href} onClick={onNavigate} className="hover:link-u">
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div className="hidden flex-col items-start justify-end gap-4 border-l border-line pl-10 md:flex lg:pl-16">
					<Link
						href="/products"
						onClick={onNavigate}
						tabIndex={-1}
						aria-hidden
						className="group relative block aspect-[16/10] w-full overflow-hidden bg-stage"
					>
						<Image
							src="/images/hero-2.jpg"
							alt=""
							fill
							sizes="(min-width: 1640px) 560px, 34vw"
							className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						/>
						<span className="note absolute left-3 top-2.5 text-white/85">
							campaign 02 · the gift table, candlelight
						</span>
					</Link>
					<p className="text-[26px] font-normal uppercase leading-snug tracking-[0.14em]">The new season</p>
					<p className="max-w-[34ch] text-[12px] leading-loose text-soft">
						Pieces chosen to be worn well past the season. The new edit, in store now.
					</p>
					<Link
						href="/products"
						onClick={onNavigate}
						className="link-u text-[10px] uppercase tracking-[0.2em]"
					>
						Shop the collection
					</Link>
				</div>
			</div>
		</div>
	);
}

function SearchPanel({
	open,
	categories,
	onClose,
}: {
	open: boolean;
	categories: HeaderData["categories"];
	onClose: () => void;
}) {
	const c = useSearchController("");
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, () => {
		c.setQuery("");
		onClose();
	});
	const listOpen = open && c.enoughChars;

	useEffect(() => {
		if (open) {
			const t = setTimeout(() => inputRef.current?.focus(), 60);
			return () => clearTimeout(t);
		}
	}, [open]);

	return (
		<div id="masthead-search" data-open={open} className={panelClass(open)}>
			<div className="mx-auto max-w-[1640px] px-5 py-8 sm:py-10 lg:px-9">
				<form onSubmit={handleSubmit} className="flex items-center gap-4 border-b border-foreground pb-3.5">
					<SearchIcon />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="What are you looking for?"
						aria-label="Search products"
						value={c.query}
						onChange={(e) => c.setQuery(e.target.value)}
						onKeyDown={makeKeyHandler(c, listOpen, onClose, () => goToSearch(c.query))}
						role="combobox"
						aria-expanded={listOpen}
						aria-controls={listboxId}
						aria-autocomplete="list"
						aria-activedescendant={getActiveId(listboxId, c, listOpen)}
						autoComplete="off"
						className="min-w-0 flex-1 bg-transparent p-0 text-[18px] tracking-[0.06em] outline-none placeholder:text-faint sm:text-[20px] [&::-webkit-search-cancel-button]:hidden"
					/>
					<button
						type="button"
						onClick={onClose}
						className="cursor-pointer py-2 text-[10px] uppercase tracking-[0.18em]"
					>
						Close
					</button>
				</form>
				{listOpen ? (
					<div className="mt-4">
						<Suggestions
							listboxId={listboxId}
							open={listOpen}
							c={c}
							onPick={goToProduct}
							onSeeAll={() => goToSearch(c.query)}
						/>
					</div>
				) : null}
				{categories.length > 0 && (
					<div className="no-scrollbar mt-7 flex items-center gap-3 overflow-x-auto sm:flex-wrap sm:overflow-visible">
						<span className="cap-xs flex-none text-faint">Popular</span>
						{categories.slice(0, 8).map((category) => (
							<Link
								key={category.id}
								href={category.href}
								onClick={onClose}
								className="cap-tag flex-none whitespace-nowrap border border-line px-3.5 py-2 transition-colors hover:border-foreground"
							>
								{category.name}
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
