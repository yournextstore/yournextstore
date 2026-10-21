"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Tab = { name: string; href: string; key: string };

/** Phone version of the department tabs: one label that drops a printed list. */
export function DepartmentMenu({ tabs }: { tabs: Tab[] }) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const close = (event: PointerEvent) => {
			if (!ref.current?.contains(event.target as Node)) setOpen(false);
		};
		const onEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
		document.addEventListener("pointerdown", close);
		document.addEventListener("keydown", onEscape);
		return () => {
			document.removeEventListener("pointerdown", close);
			document.removeEventListener("keydown", onEscape);
		};
	}, [open]);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				aria-expanded={open}
				onClick={() => setOpen((value) => !value)}
				className="flex min-h-6 cursor-pointer items-center gap-1.5 text-ink"
			>
				<span className="tab-on">Departments</span>
				<ChevronDown aria-hidden className="size-3 text-faint" />
			</button>
			{open ? (
				<ul className="absolute left-0 top-[calc(100%+7px)] z-40 flex min-w-[220px] flex-col gap-1 border border-line bg-card p-3 shadow-[0_18px_32px_-24px_oklch(0.22_0.006_0/0.35)]">
					{tabs.map((tab) => (
						<li key={tab.key}>
							<Link
								href={tab.href}
								data-tab={tab.key}
								data-menu-item
								onClick={() => setOpen(false)}
								className="block py-1.5 normal-case tracking-[0.08em] text-dim transition hover:text-ink"
							>
								{tab.name}
							</Link>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
