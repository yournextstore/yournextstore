"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

const FINISHES = [
	{
		id: "dark",
		name: "Lights off",
		note: "Obsidian",
		swatch: "border-[#2a2a2e] bg-[radial-gradient(circle_at_30%_25%,#3a3a40_0%,#141416_65%)]",
	},
	{
		id: "light",
		name: "Lights on",
		note: "Ivory & gilt",
		swatch: "border-[#c9a862]/50 bg-[linear-gradient(145deg,#faf6ef_0%,#e8dfd0_45%,#f0e8dc_100%)]",
	},
] as const;

/**
 * The original's finish picker re-themed the whole page (Obsidian ↔ Ivory Gilt) with a slow
 * view-transition cross-fade. Here it switches the storefront between its two palettes.
 */
export function FinishSwitch({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const current = mounted ? resolvedTheme : undefined;

	const choose = (id: string) => {
		const apply = () => flushSync(() => setTheme(id));
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!reduce && typeof document.startViewTransition === "function") {
			document.startViewTransition(apply);
		} else {
			apply();
		}
	};

	return (
		<div className={className}>
			<p className="text-micro font-medium uppercase tracking-[0.28em] text-warm">Finish</p>
			<div className="mt-3 flex flex-wrap items-stretch gap-2 sm:gap-3" role="radiogroup" aria-label="Finish">
				{FINISHES.map((finish) => {
					const active = current === finish.id;
					return (
						// biome-ignore lint/a11y/useSemanticElements: a styled radio card, as the original's finish picker.
						<button
							key={finish.id}
							type="button"
							role="radio"
							aria-checked={active}
							onClick={() => choose(finish.id)}
							className={cn(
								"flex min-h-11 items-center gap-3 rounded-sm border px-3 py-2 text-left transition-colors duration-300 sm:px-4",
								active
									? "border-gold/40 bg-[var(--premium-bg)] text-ink shadow-[inset_0_0_0_1px_rgba(201,168,98,0.12)]"
									: "border-hairline-strong text-muted-foreground hover:text-foreground",
							)}
						>
							<span
								aria-hidden="true"
								className={cn(
									"relative size-8 shrink-0 rounded-full border-2 shadow-inner",
									finish.swatch,
									active && "ring-2 ring-gold/40 ring-offset-2 ring-offset-background",
								)}
							/>
							<span className="min-w-0">
								<span className="block text-[13px] font-medium tracking-wide text-foreground">
									{finish.name}
								</span>
								<span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
									{finish.note}
								</span>
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
