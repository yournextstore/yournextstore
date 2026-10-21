"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const INTERVAL = 5000;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Drives the server-rendered slides of `Hero`: flips `data-active` on them (CSS fades), keeps
 * the inactive ones out of the accessibility tree and tab order, and autoplays with a progress
 * bar per slide. Starts paused for visitors who prefer reduced motion.
 */
export function SlideshowControls({ count }: { count: number }) {
	const [index, setIndex] = useState(0);
	const [playing, setPlaying] = useState(false);
	// Bumped on every manual jump so the running progress bar restarts with the timer.
	const [cycle, setCycle] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	}, []);

	useEffect(() => {
		const section = rootRef.current?.closest("section");
		if (!section) return;
		for (const slide of section.querySelectorAll<HTMLElement>("[data-slide]")) {
			const active = Number(slide.dataset.slide) === index;
			slide.dataset.active = String(active);
			if (active) {
				slide.removeAttribute("aria-hidden");
			} else {
				slide.setAttribute("aria-hidden", "true");
			}
			for (const link of slide.querySelectorAll<HTMLElement>("a")) {
				link.tabIndex = active ? 0 : -1;
			}
		}
	}, [index]);

	useEffect(() => {
		if (!playing) return;
		const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL);
		return () => window.clearTimeout(timer);
	}, [playing, count]);

	return (
		<div
			ref={rootRef}
			className="absolute bottom-4 left-1/2 z-20 flex w-full max-w-[96rem] -translate-x-1/2 flex-wrap items-center px-4 sm:bottom-6 sm:px-6 lg:px-8"
		>
			{Array.from({ length: count }, (_, i) => (
				<button
					key={i}
					type="button"
					aria-label={`View slide ${i + 1}`}
					aria-current={i === index ? "true" : undefined}
					onClick={() => {
						setIndex(i);
						setCycle((c) => c + 1);
					}}
					className="rounded-lg px-1.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
				>
					<span className="relative block h-0.5 overflow-hidden" style={{ width: `${150 / count}px` }}>
						<span className="absolute inset-0 bg-background opacity-30" />
						{i === index && (
							<span
								key={`${index}-${cycle}-${playing}`}
								className="absolute inset-0 origin-left bg-background"
								style={playing ? { animation: `slide-progress ${INTERVAL}ms linear forwards` } : undefined}
							/>
						)}
					</span>
				</button>
			))}
			<span className="mt-px mr-3 ml-auto font-mono text-sm text-background" aria-hidden="true">
				{pad(index + 1)}/{pad(count)}
			</span>
			<button
				type="button"
				aria-label={playing ? "Pause slideshow" : "Play slideshow"}
				onClick={() => {
					setPlaying((p) => !p);
					setCycle((c) => c + 1);
				}}
				className="flex size-7 items-center justify-center rounded-lg border border-contrast-300/50 text-background transition-colors hover:border-contrast-300/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
			>
				{playing ? (
					<Pause className="size-4" strokeWidth={1.5} />
				) : (
					<Play className="size-4" strokeWidth={1.5} />
				)}
			</button>
		</div>
	);
}
