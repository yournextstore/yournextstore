"use client";

import { useEffect, useRef } from "react";

const MAXBAR = 9;
const START = Math.PI * 0.75; // 135°, down-left
const SWEEP = Math.PI * 1.5; // 270° clockwise
const RAMP = 2.4;
const HOLD = 20;
const DROP = 1.3;
const REST = 2;
const SHOT_END = RAMP + HOLD + DROP;
const CYCLE = SHOT_END + REST;
const YIELD_MAX = 100;

const easeOut = (p: number) => 1 - (1 - p) ** 3;
const easeIn = (p: number) => p * p;

function stateAt(t: number) {
	const bar =
		t < RAMP
			? easeOut(t / RAMP) * MAXBAR
			: t < RAMP + HOLD
				? MAXBAR
				: t < SHOT_END
					? MAXBAR * (1 - easeIn((t - RAMP - HOLD) / DROP))
					: 0;
	const timer = t < SHOT_END ? t : SHOT_END;
	const y0 = RAMP * 0.4;
	const yld = t <= y0 ? 0 : t < SHOT_END ? easeOut((t - y0) / (SHOT_END - y0)) * YIELD_MAX : YIELD_MAX;
	return { bar, timer, yld };
}

function draw(ctx: CanvasRenderingContext2D, size: number, bar: number, font: string) {
	const c = size / 2;
	const R = size * 0.4;
	const k = size / 360;
	ctx.clearRect(0, 0, size, size);
	// machined tick marks: major every 1.0 bar, minor every 0.2
	for (let i = 0; i <= 45; i++) {
		const major = i % 5 === 0;
		const ang = START + (i / 45) * SWEEP;
		const r2 = R - (major ? 14 : 8) * k;
		ctx.beginPath();
		ctx.moveTo(c + Math.cos(ang) * R, c + Math.sin(ang) * R);
		ctx.lineTo(c + Math.cos(ang) * r2, c + Math.sin(ang) * r2);
		ctx.strokeStyle = major ? "rgba(169,158,144,.85)" : "rgba(110,100,88,.6)";
		ctx.lineWidth = major ? 1.4 : 1;
		ctx.stroke();
		if (major) {
			const rl = R - 27 * k;
			ctx.fillStyle = "rgba(169,158,144,.9)";
			ctx.font = `${Math.round(11 * k)}px ${font}`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(String(i / 5), c + Math.cos(ang) * rl, c + Math.sin(ang) * rl);
		}
	}
	// background track
	const tr = R + 7 * k;
	ctx.beginPath();
	ctx.arc(c, c, tr, START, START + SWEEP);
	ctx.strokeStyle = "rgba(244,237,228,.10)";
	ctx.lineWidth = 2 * k;
	ctx.stroke();
	// copper progress arc up to the needle
	const frac = bar / MAXBAR;
	const nAng = START + frac * SWEEP;
	if (frac > 0.001) {
		ctx.beginPath();
		ctx.arc(c, c, tr, START, nAng);
		ctx.strokeStyle = "#C8622C";
		ctx.lineWidth = 3 * k;
		ctx.lineCap = "round";
		ctx.stroke();
	}
	// copper needle
	ctx.save();
	ctx.translate(c, c);
	ctx.rotate(nAng);
	ctx.beginPath();
	ctx.moveTo(-R * 0.16, 0);
	ctx.lineTo(R * 0.9, 0);
	ctx.strokeStyle = "#E98A4B";
	ctx.lineWidth = 2.4 * k;
	ctx.lineCap = "round";
	ctx.shadowColor = "rgba(233,138,75,.55)";
	ctx.shadowBlur = 8 * k;
	ctx.stroke();
	ctx.restore();
	// hub
	ctx.beginPath();
	ctx.arc(c, c, size * 0.045, 0, Math.PI * 2);
	ctx.fillStyle = "#1B1512";
	ctx.fill();
	ctx.lineWidth = 1.5 * k;
	ctx.strokeStyle = "#C8622C";
	ctx.stroke();
}

/**
 * The original's signature: a live canvas pressure gauge looping a test cycle (ramp to nine
 * bars, hold, drop, rest) with a timer and output counting up below. One 2D canvas, paused
 * off-screen, a single static frame under reduced motion.
 */
export function PressureGauge() {
	const canvas = useRef<HTMLCanvasElement>(null);
	const timer = useRef<HTMLSpanElement>(null);
	const pressure = useRef<HTMLSpanElement>(null);
	const yieldRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const el = canvas.current;
		const ctx = el?.getContext("2d");
		if (!el || !ctx) return;
		const font = `${getComputedStyle(el).getPropertyValue("--font-plex-mono") || "monospace"}, monospace`;
		const dpr = Math.min(devicePixelRatio || 1, 2);
		let size = 360;
		let current = { bar: 0, timer: 0, yld: 0 };
		const setText = (ref: React.RefObject<HTMLSpanElement | null>, v: string) => {
			if (ref.current) ref.current.textContent = v;
		};
		const paint = () => {
			draw(ctx, size, current.bar, font);
			setText(timer, current.timer.toFixed(1));
			setText(pressure, current.bar.toFixed(1));
			setText(yieldRef, String(Math.round(current.yld)));
		};
		const resize = () => {
			size = el.clientWidth || 360;
			el.width = Math.round(size * dpr);
			el.height = Math.round(size * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			paint();
		};
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(el);

		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			current = { bar: 9, timer: 27, yld: 100 };
			paint();
			return () => ro.disconnect();
		}

		let t = 0;
		let last = performance.now();
		let raf = 0;
		const frame = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			t = (t + dt) % CYCLE;
			current = stateAt(t);
			paint();
			raf = requestAnimationFrame(frame);
		};
		const io = new IntersectionObserver(
			(entries) => {
				const visible = entries.some((e) => e.isIntersecting);
				cancelAnimationFrame(raf);
				if (visible) {
					last = performance.now();
					raf = requestAnimationFrame(frame);
				}
			},
			{ threshold: 0.05 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			ro.disconnect();
			cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<figure
			role="img"
			aria-label="Live pressure gauge running a test cycle: pressure ramps to nine bars and holds while the timer and output count up."
			className="relative m-0 w-full max-w-[420px] justify-self-start rounded-[4px] border border-line bg-[linear-gradient(180deg,rgba(27,21,18,.86),rgba(21,17,16,.9))] p-[22px] shadow-[0_40px_80px_-50px_rgba(0,0,0,.9)] backdrop-blur-[8px] lg:max-w-[360px] lg:justify-self-end"
		>
			<div className="relative mx-auto aspect-square w-full">
				<canvas ref={canvas} width={360} height={360} className="block h-full w-full" />
				<span
					aria-hidden="true"
					className="font-readout absolute bottom-[20%] left-1/2 -translate-x-1/2 text-[0.62rem] tracking-[0.28em] text-faint"
				>
					BAR
				</span>
			</div>
			<div aria-hidden="true" className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
				{(
					[
						["TIMER", timer, "0.0", "s"],
						["PRESSURE", pressure, "0.0", "bar"],
						["OUTPUT", yieldRef, "0", "%"],
					] as const
				).map(([label, ref, initial, unit]) => (
					<div key={label} className="flex flex-col gap-[5px]">
						<span className="font-readout text-[0.58rem] tracking-[0.16em] text-faint">{label}</span>
						<span className="font-readout tabular text-[1.02rem] leading-none font-medium text-ink">
							<span ref={ref}>{initial}</span>
							<span className="ml-0.5 text-[0.62rem] text-dim">{unit}</span>
						</span>
					</div>
				))}
			</div>
		</figure>
	);
}
