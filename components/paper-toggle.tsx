"use client";

import { useId, useSyncExternalStore } from "react";
import {
	DEFAULT_PAPER,
	isPaperMode,
	PAPER_EVENT,
	PAPER_MODES,
	PAPER_STORAGE_KEY,
	type PaperMode,
} from "@/lib/paper";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
	window.addEventListener(PAPER_EVENT, onChange);
	window.addEventListener("storage", onChange);
	return () => {
		window.removeEventListener(PAPER_EVENT, onChange);
		window.removeEventListener("storage", onChange);
	};
}

const read = (): PaperMode => {
	const value = document.documentElement.dataset.paper;
	return isPaperMode(value) ? value : DEFAULT_PAPER;
};

/** The page-wide ruling: `data-paper` on <html> is the state, so CSS re-rules everything at once. */
export function usePaper() {
	const paper = useSyncExternalStore(subscribe, read, () => DEFAULT_PAPER);
	const setPaper = (mode: PaperMode) => {
		document.documentElement.dataset.paper = mode;
		try {
			localStorage.setItem(PAPER_STORAGE_KEY, mode);
		} catch {}
		window.dispatchEvent(new Event(PAPER_EVENT));
	};
	return [paper, setPaper] as const;
}

/** A tiny swatch of each ruling, drawn for the compact header switch. */
function Glyph({ mode }: { mode: PaperMode }) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="none" stroke="currentColor">
			<rect x="2" y="2" width="12" height="12" rx="1.5" strokeWidth="1.3" />
			{mode === "dot" && (
				<g fill="currentColor" stroke="none">
					{[5.5, 8, 10.5].flatMap((x) =>
						[5.5, 8, 10.5].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.8" />),
					)}
				</g>
			)}
			{mode === "ruled" && <path d="M4 6h8M4 8.5h8M4 11h8" strokeWidth="1" />}
			{mode === "graph" && <path d="M6 2v12M10 2v12M2 6h12M2 10h12" strokeWidth="0.9" />}
		</svg>
	);
}

/**
 * The original's ruling radios. `chips` is the desk's full-size set; `compact` is the four glyphs
 * in the header, so the sheet can be re-ruled from any page.
 */
export function PaperToggle({
	variant = "chips",
	className,
	label = "Paper ruling",
}: {
	variant?: "chips" | "compact";
	className?: string;
	label?: string;
}) {
	const [paper, setPaper] = usePaper();
	const name = useId();

	if (variant === "compact") {
		return (
			<fieldset
				className={cn("m-0 inline-flex items-center rounded-[9px] border border-line p-0.5", className)}
			>
				<legend className="sr-only">{label}</legend>
				{PAPER_MODES.map((mode) => (
					<label key={mode.value} title={mode.label} className="relative cursor-pointer">
						<input
							type="radio"
							name={name}
							value={mode.value}
							checked={paper === mode.value}
							onChange={() => setPaper(mode.value)}
							className="peer sr-only"
						/>
						<span className="inline-grid size-[28px] place-items-center rounded-[7px] text-dim transition-colors hover:text-ink peer-checked:bg-ink peer-checked:text-kraft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ochre">
							<Glyph mode={mode.value} />
							<span className="sr-only">{mode.label}</span>
						</span>
					</label>
				))}
			</fieldset>
		);
	}

	return (
		<fieldset className={cn("m-0 border-0 p-0", className)}>
			<legend className="label-mono mb-3 p-0">{label}</legend>
			<div className="flex flex-wrap gap-2">
				{PAPER_MODES.map((mode) => (
					<label key={mode.value} className="relative">
						<input
							type="radio"
							name={name}
							value={mode.value}
							checked={paper === mode.value}
							onChange={() => setPaper(mode.value)}
							className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
						/>
						<span className="chip peer-checked:-translate-y-px peer-checked:border-ink peer-checked:bg-ink peer-checked:text-kraft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ochre">
							{mode.label}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}
