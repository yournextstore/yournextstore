"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * The original's signature: one word set so large it spans the column edge to edge and sinks
 * a third of its height below the photograph. It is sized to the measured column, then shown
 * (hidden until then, as in the original), and refitted when fonts load or the column resizes.
 * The hero box has a fixed height, so refitting never moves anything else.
 */
export function HeroHeadline({
	children,
	className = "text-white",
}: {
	children: string;
	className?: string;
}) {
	const boxRef = useRef<HTMLDivElement>(null);
	// A descender cut by the photograph's edge turns "y" into "u": words with one sink less.
	const sink = /[gjpqy]/.test(children) ? "translate-y-[0.1em]" : "translate-y-[0.33em]";
	const textRef = useRef<HTMLHeadingElement>(null);

	useLayoutEffect(() => {
		const box = boxRef.current;
		const text = textRef.current;
		if (!box || !text) return;

		const fit = () => {
			const style = getComputedStyle(box);
			const available =
				box.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
			text.style.fontSize = "100px";
			const width = text.getBoundingClientRect().width;
			if (width > 0 && available > 0) {
				// Negative tracking leaves a trailing gap after the last glyph; give it back.
				text.style.fontSize = `${Math.floor((100 * available) / (width + 11))}px`;
				text.dataset.fitted = "";
			}
		};

		fit();
		document.fonts?.ready.then(fit);
		const observer = new ResizeObserver(fit);
		observer.observe(box);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={boxRef} className="page-container overflow-hidden">
			<h1
				ref={textRef}
				className={`hero-headline inline-block ${sink} whitespace-nowrap font-semibold leading-[1.33] tracking-hero ${className}`}
				style={{ fontSize: "100px" }}
			>
				{children}
			</h1>
		</div>
	);
}
