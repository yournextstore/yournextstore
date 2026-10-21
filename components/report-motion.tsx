"use client";

import { useEffect, useRef } from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A number that counts up once it scrolls into view (cubic-out, 1.3s). The server renders the
 * real value, so without JavaScript or with reduced motion it simply reads correctly.
 */
export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || reduced()) return;
		let frame = 0;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				io.disconnect();
				const t0 = performance.now();
				const tick = (t: number) => {
					const p = Math.min(1, (t - t0) / 1300);
					el.textContent = (value * (1 - (1 - p) ** 3)).toFixed(decimals);
					if (p < 1) frame = requestAnimationFrame(tick);
				};
				frame = requestAnimationFrame(tick);
			},
			{ threshold: 0.5 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [value, decimals]);

	return (
		<span ref={ref} className="tabular-nums">
			{value.toFixed(decimals)}
		</span>
	);
}

const W = 220;
const H = 64;
const MID = 38;
const wave = (phase: number) => {
	const points = Array.from({ length: W / 4 + 1 }, (_, i) => {
		const x = i * 4;
		const t = x / W;
		const y = MID - Math.sin(t * Math.PI * 4 + phase) * 11 - Math.sin(t * Math.PI * 7.3 + phase * 1.7) * 3.5;
		return `${i === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`;
	});
	return points.join(" ");
};
const STILL = wave(0);

/** The swell meter: a small living sine, ~25fps, still under reduced motion. */
export function WaveMeter() {
	const line = useRef<SVGPathElement>(null);
	const fill = useRef<SVGPathElement>(null);

	useEffect(() => {
		if (reduced()) return;
		let phase = 0;
		let last = 0;
		let frame = 0;
		const loop = (t: number) => {
			if (t - last > 40) {
				phase += 0.055;
				const d = wave(phase);
				line.current?.setAttribute("d", d);
				fill.current?.setAttribute("d", `${d} L${W} ${H} L0 ${H} Z`);
				last = t;
			}
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frame);
	}, []);

	return (
		<svg
			viewBox={`0 0 ${W} ${H}`}
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
			className="h-16 w-full flex-1"
		>
			<path ref={fill} d={`${STILL} L${W} ${H} L0 ${H} Z`} fill="rgb(88 119 160 / 0.24)" />
			<path
				ref={line}
				d={STILL}
				fill="none"
				stroke="var(--denim-deep)"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}
