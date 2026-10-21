"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "#/\\<>-_0123456789";

/** Weather-radio static: the text resolves left to right the first time it scrolls into view, and on every change. */
export function Scramble({
	text,
	className,
	duration = 600,
}: {
	text: string;
	className?: string;
	duration?: number;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const seen = useRef(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let raf = 0;
		const run = () => {
			const startAt = performance.now();
			const step = (now: number) => {
				const p = Math.min(1, (now - startAt) / duration);
				const shown = p * text.length;
				el.textContent = Array.from(text)
					.map((c, i) => (c === " " || i < shown ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
					.join("");
				if (p < 1) raf = requestAnimationFrame(step);
				else el.textContent = text;
			};
			raf = requestAnimationFrame(step);
		};
		if (seen.current) {
			run();
			return () => cancelAnimationFrame(raf);
		}
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					seen.current = true;
					io.disconnect();
					run();
				}
			},
			{ threshold: 0.6 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
	}, [text, duration]);

	return (
		<span ref={ref} className={className} style={{ whiteSpace: "nowrap" }}>
			{text}
		</span>
	);
}
