"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** One "Shop the Look" photograph: a "+" hotspot opens the pieces worn in it. */
export function LookTile({
	image,
	note,
	span,
	children,
}: {
	image: string;
	note: string;
	span: 1 | 2;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const id = useId();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onPointer = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
		<div ref={ref} className={cn("relative overflow-hidden bg-stage", span === 2 && "row-span-2")}>
			<Image src={image} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
			<span aria-hidden className="absolute inset-0 bg-ink/15" />
			<span aria-hidden className="note absolute left-3.5 top-3 text-white/85">
				{note}
			</span>
			<button
				type="button"
				aria-label="Shop this look"
				aria-expanded={open}
				aria-controls={id}
				onClick={() => setOpen((v) => !v)}
				className={cn(
					"absolute right-3.5 bottom-3.5 size-[38px] cursor-pointer rounded-full border border-white/70 text-[15px] leading-none transition-colors duration-300",
					open ? "bg-white text-ink" : "bg-white/10 text-white",
				)}
			>
				{open ? "−" : "+"}
			</button>
			<div
				id={id}
				hidden={!open}
				className="anim-fade absolute inset-x-3 bottom-16 z-[4] flex flex-col gap-3.5 border border-line bg-background p-4 sm:inset-x-4"
			>
				<p className="cap-xs text-faint">In this look</p>
				{children}
			</div>
		</div>
	);
}
