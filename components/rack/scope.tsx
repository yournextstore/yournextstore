"use client";

import { useEffect, useRef } from "react";

const AMBER = "#ffb020";
const GRID = "rgba(223, 226, 230, 0.07)";
const GRID_MID = "rgba(223, 226, 230, 0.14)";

/** A saw through a resonant lowpass, harmonic by harmonic, with the cutoff drifting like a hand on the knob. */
function sample(phase: number, t: number) {
	const cutoff = 3.2 + 1.8 * Math.sin(t * 0.23);
	let y = 0;
	for (let n = 1; n <= 6; n++) {
		const roll = 1 / (1 + (n / cutoff) ** 4);
		const reso = 1 + 0.9 * Math.exp(-((n - cutoff) ** 2));
		y += (Math.sin(n * (phase + t * 1.6)) / n) * roll * reso;
	}
	return y;
}

/**
 * The hero module's screen. DPR capped at 1.5, ~30 fps, paused off-screen;
 * under prefers-reduced-motion it renders exactly one frame.
 */
export function ScopeCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = ref.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
			canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
			canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
		};

		const draw = (t: number) => {
			const { width: w, height: h } = canvas;
			ctx.clearRect(0, 0, w, h);
			ctx.lineWidth = 1;
			const step = h / 6;
			for (let i = 1; i < 6; i++) {
				ctx.strokeStyle = i === 3 ? GRID_MID : GRID;
				ctx.beginPath();
				ctx.moveTo(0, i * step);
				ctx.lineTo(w, i * step);
				ctx.stroke();
			}
			for (let i = 1; i < 10; i++) {
				ctx.strokeStyle = GRID;
				ctx.beginPath();
				ctx.moveTo((i * w) / 10, 0);
				ctx.lineTo((i * w) / 10, h);
				ctx.stroke();
			}
			ctx.strokeStyle = AMBER;
			ctx.lineWidth = Math.max(1.5, h / 90);
			ctx.shadowColor = "rgba(255, 176, 32, 0.55)";
			ctx.shadowBlur = 9;
			ctx.beginPath();
			const mid = h / 2;
			const amp = h * 0.3;
			for (let x = 0; x <= w; x += 2) {
				const y = mid - sample((x / w) * Math.PI * 5, t) * amp;
				if (x === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();
			ctx.shadowBlur = 0;
		};

		resize();
		let running = !reduce;
		let visible = true;
		let last = 0;
		let frame = 0;
		const t0 = performance.now();
		const loop = (t: number) => {
			if (!running || !visible) return;
			if (t - last >= 33) {
				draw((t - t0) / 1000);
				last = t;
			}
			frame = requestAnimationFrame(loop);
		};

		const ro = new ResizeObserver(() => {
			resize();
			if (reduce) draw(1.7);
		});
		ro.observe(canvas);
		const io = new IntersectionObserver(
			(entries) => {
				const now = entries[0]?.isIntersecting ?? false;
				if (now && !visible && running) {
					visible = true;
					frame = requestAnimationFrame(loop);
				}
				visible = now;
			},
			{ threshold: 0 },
		);
		io.observe(canvas);

		if (reduce) draw(1.7);
		else frame = requestAnimationFrame(loop);

		return () => {
			running = false;
			cancelAnimationFrame(frame);
			ro.disconnect();
			io.disconnect();
		};
	}, []);

	return <canvas ref={ref} className="absolute inset-0 block h-full w-full" />;
}
