"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type NavLink = {
	href: string;
	label: string;
};

/**
 * Merchant navigation: an inline row from xl, and below that a small disclosure panel
 * pinned to the far right of the header (minshop's `<details>` menu).
 */
export function Navbar({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	const [open, setOpen] = useState(false);
	const panelId = useId();
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onPointer = (event: PointerEvent) => {
			if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		document.addEventListener("pointerdown", onPointer);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onPointer);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	const close = () => setOpen(false);

	return (
		<>
			<div className="hidden min-w-0 items-center gap-6 xl:flex">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						title={link.label}
						className="min-w-0 max-w-[18ch] truncate transition-colors hover:text-foreground"
					>
						{link.label}
					</Link>
				))}
			</div>
			<div ref={rootRef} className="relative order-last flex xl:hidden">
				<button
					type="button"
					aria-label="Menu"
					aria-expanded={open}
					aria-controls={panelId}
					onClick={() => setOpen((value) => !value)}
					className="-m-2 flex h-9 w-9 items-center justify-center transition-colors hover:text-foreground"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						aria-hidden="true"
					>
						<path d="M2 4.5h14M2 9h14M2 13.5h14" />
					</svg>
				</button>
				<div
					id={panelId}
					hidden={!open}
					className="absolute right-0 top-full z-50 mt-3 min-w-48 max-w-[calc(100vw-3rem)] border border-line bg-card p-4 shadow-lg"
				>
					<div className="flex flex-col gap-3">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={close}
								className="truncate py-0.5 transition-colors hover:text-foreground"
							>
								{link.label}
							</Link>
						))}
						<Link
							href="/search"
							onClick={close}
							className="py-0.5 transition-colors hover:text-foreground min-[360px]:hidden"
						>
							Search
						</Link>
						<a href={accountHref} className="py-0.5 transition-colors hover:text-foreground sm:hidden">
							Account
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
