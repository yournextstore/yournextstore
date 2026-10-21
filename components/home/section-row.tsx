"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Edge = "top" | "bottom";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const POUR_IN_MS = 450;
const POUR_OUT_MS = 350;

const gathered = (edge: Edge) => (edge === "top" ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)");

const edgeOf = (event: React.PointerEvent<HTMLElement>): Edge => {
	const box = event.currentTarget.getBoundingClientRect();
	return event.clientY < box.top + box.height / 2 ? "top" : "bottom";
};

const reducedMotion = () =>
	typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * An edge-to-edge section row in giant type whose ink follows the pointer: it pours in from
 * the edge the pointer crossed and drains through the edge it leaves by. The inked row is a
 * clipped second copy of the content, driven with WAAPI so a change of direction carries on
 * from where the ink is. Keyboard focus inks the row with a plain transition.
 */
export function SectionRow({
	href,
	label,
	count,
	size,
}: {
	href: string;
	label: string;
	count: number;
	/** One size for every row, so the longest label fits its line. */
	size: { mobile: string; desktop: string };
}) {
	const inkRef = useRef<HTMLSpanElement>(null);
	const pourRef = useRef<Animation | null>(null);

	const pour = (row: HTMLElement, to: string, from: string | null, ms: number) => {
		const ink = inkRef.current;
		if (!ink) return;
		const start = pourRef.current ? getComputedStyle(ink).clipPath : from;
		pourRef.current?.cancel();
		const animation = ink.animate(
			{ clipPath: start ? [start, to] : [to] },
			{ duration: reducedMotion() ? 0 : ms, easing: EASE_OUT, fill: "forwards" },
		);
		pourRef.current = animation;
		row.dataset.inked = String(to === "inset(0)");
		return animation;
	};

	const content = (inked: boolean) => (
		<span className="flex items-center justify-between gap-4 px-4 py-2 lg:px-8">
			<span
				style={{ "--row-m": size.mobile, "--row-d": size.desktop } as React.CSSProperties}
				className="min-w-0 whitespace-nowrap font-display text-[length:var(--row-m)] leading-[0.92] transition-transform duration-[450ms] ease-out group-data-[inked=true]:translate-x-3 sm:text-[length:var(--row-d)] motion-reduce:transition-none"
			>
				{label}
			</span>
			<span className="flex shrink-0 items-center gap-3 whitespace-nowrap text-sm lg:gap-4 lg:text-[15px]">
				<span className="max-sm:sr-only">{String(count).padStart(2, "0")} styles</span>
				<span
					className={cn(
						"relative grid size-11 place-items-center overflow-hidden rounded-full border lg:size-16",
						inked ? "border-background" : "border-foreground",
					)}
				>
					<ArrowUpRight
						aria-hidden="true"
						className="size-[18px] transition-transform duration-[350ms] ease-out group-data-[inked=true]:-translate-y-[220%] group-data-[inked=true]:translate-x-[220%] motion-reduce:transition-none"
					/>
					<ArrowUpRight
						aria-hidden="true"
						className="absolute size-[18px] -translate-x-[220%] translate-y-[220%] transition-transform duration-[350ms] ease-out group-data-[inked=true]:translate-x-0 group-data-[inked=true]:translate-y-0 motion-reduce:transition-none"
					/>
				</span>
			</span>
		</span>
	);

	return (
		<Link
			href={href}
			onPointerEnter={(event) => {
				if (event.pointerType !== "mouse") return;
				pour(event.currentTarget, "inset(0)", gathered(edgeOf(event)), POUR_IN_MS);
			}}
			onPointerLeave={(event) => {
				if (event.pointerType !== "mouse") return;
				const drained = pour(event.currentTarget, gathered(edgeOf(event)), null, POUR_OUT_MS);
				drained?.finished.then(
					() => {
						if (pourRef.current !== drained) return;
						drained.cancel();
						pourRef.current = null;
					},
					() => {},
				);
			}}
			className="group relative block overflow-hidden border-b border-line focus-visible:outline-offset-[-2px]"
		>
			{content(false)}
			<span
				ref={inkRef}
				aria-hidden="true"
				className="absolute inset-0 bg-foreground text-background transition-[clip-path] duration-[350ms] ease-out [clip-path:inset(100%_0_0_0)] group-focus-visible:[clip-path:inset(0)] motion-reduce:transition-none"
			>
				{content(true)}
			</span>
		</Link>
	);
}
