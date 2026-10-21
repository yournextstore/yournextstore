"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { CartButton } from "@/app/cart-button";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./search-overlay";
import { VaultButton } from "./vault";

/**
 * The sticky serif masthead: store name, the "Collections" mega menu, archive, vault, bag,
 * account and the ⌘K search box. The mega panel's content is server-rendered and passed in.
 */
export function Masthead({
	storeName,
	accountHref,
	suggestions,
	mega,
}: {
	storeName: string;
	accountHref: string;
	suggestions: string[];
	mega: ReactNode;
}) {
	const [megaOpen, setMegaOpen] = useState(false);
	const headerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!megaOpen) return;
		const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMegaOpen(false);
		const onPointer = (event: PointerEvent) => {
			if (!headerRef.current?.contains(event.target as Node)) setMegaOpen(false);
		};
		// A link inside the panel navigates: fold the panel away with it.
		const onClick = (event: MouseEvent) => {
			if ((event.target as HTMLElement | null)?.closest("#maison-mega a")) setMegaOpen(false);
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onPointer);
		document.addEventListener("click", onClick);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onPointer);
			document.removeEventListener("click", onClick);
		};
	}, [megaOpen]);

	return (
		<header ref={headerRef} className="sticky top-0 z-30 border-b border-rule bg-card">
			<div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:gap-x-[26px] sm:gap-y-3.5 sm:px-6 sm:py-3.5">
				<Link
					href="/"
					className="font-sf order-1 min-w-0 flex-1 basis-auto truncate text-[18px] tracking-[0.01em] text-ink sm:order-none sm:text-[20px]"
				>
					{storeName}
				</Link>
				<nav
					aria-label="Main"
					className="order-3 flex basis-full flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13.5px] tracking-[0.02em] sm:order-none sm:basis-auto sm:justify-start sm:gap-[22px]"
				>
					<button
						type="button"
						aria-expanded={megaOpen}
						aria-controls="maison-mega"
						onClick={() => setMegaOpen((open) => !open)}
						className={cn(
							"min-h-6 cursor-pointer pb-0.5 text-soft transition hover:text-acc",
							megaOpen && "border-b border-acc text-acc",
						)}
					>
						Collections
					</button>
					<Link
						href="/products"
						className="min-h-6 py-0.5 text-soft transition hover:text-acc max-[359px]:hidden"
					>
						Archive
					</Link>
					<VaultButton />
					<CartButton />
					{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). */}
					<a href={accountHref} className="btn-keeper px-2.5 py-[7px] sm:px-3.5">
						Account
					</a>
				</nav>
				<SearchOverlay suggestions={suggestions} />
			</div>

			<div
				id="maison-mega"
				hidden={!megaOpen}
				className="relative max-h-[calc(100svh-110px)] overflow-y-auto overscroll-contain border-t border-line bg-card shadow-[0_18px_32px_-24px_oklch(0.22_0.006_0/0.35)]"
			>
				<button
					type="button"
					onClick={() => setMegaOpen(false)}
					className="absolute right-4 top-3 z-10 flex min-h-6 cursor-pointer items-center gap-1.5 font-mono text-[12px] text-soft transition hover:text-acc sm:right-6"
				>
					Close <X aria-hidden className="size-3.5" strokeWidth={1.5} />
				</button>
				{mega}
			</div>
		</header>
	);
}
