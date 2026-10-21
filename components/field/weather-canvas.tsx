"use client";

import { useEffect, useRef } from "react";
import { getTerrain, subscribeTerrain, type Terrain } from "./terrain-store";

type Regime = {
	color: [number, number, number];
	speed: number;
	angle: number;
	streak: number;
	sMin: number;
	sMax: number;
	turb: number;
	density: number;
	shimmer: number;
	gust: number;
};

// Ported from the original's weather engine: one particle field that interpolates between regimes.
const REGIMES: Record<Terrain, Regime> = {
	alpine: {
		color: [236, 240, 236],
		speed: 46,
		angle: 1.94,
		streak: 5,
		sMin: 0.7,
		sMax: 1.9,
		turb: 1.1,
		density: 0.62,
		shimmer: 0,
		gust: 0,
	},
	desert: {
		color: [226, 178, 122],
		speed: 20,
		angle: 0.24,
		streak: 0,
		sMin: 0.7,
		sMax: 2.6,
		turb: 0.6,
		density: 0.5,
		shimmer: 1,
		gust: 0,
	},
	coastal: {
		color: [176, 206, 216],
		speed: 168,
		angle: 2.16,
		streak: 20,
		sMin: 0.7,
		sMax: 1.5,
		turb: 0.28,
		density: 0.92,
		shimmer: 0,
		gust: 1,
	},
};

const KEYS = ["speed", "angle", "streak", "sMin", "sMax", "turb", "density", "shimmer", "gust"] as const;
const TAU = Math.PI * 2;
const MAX = 200;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIO = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function mix(a: Regime, b: Regime, t: number): Regime {
	const out = { ...a, color: a.color.map((c, i) => lerp(c, b.color[i] ?? c, t)) as Regime["color"] };
	for (const k of KEYS) out[k] = lerp(a[k], b[k], t);
	return out;
}

type Particle = {
	x: number;
	y: number;
	sf: number;
	sizeF: number;
	alpha: number;
	phase: number;
	freq: number;
};

export function WeatherCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = ref.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		const finePointer = matchMedia("(pointer: fine)").matches;
		const dpr = Math.min(devicePixelRatio || 1, 2);

		let cur = REGIMES[getTerrain()];
		let from = cur;
		let to = cur;
		let tt = 1;
		let w = 0;
		let h = 0;
		let time = 0;
		const wind = { x: 0, tx: 0 };
		const parts: Particle[] = [];

		const seed = () => {
			parts.length = 0;
			Array.from({ length: MAX }).forEach(() => {
				parts.push({
					x: Math.random() * w,
					y: Math.random() * h,
					sf: 0.5 + Math.random() * 0.9,
					sizeF: Math.random(),
					alpha: 0.28 + Math.random() * 0.6,
					phase: Math.random() * TAU,
					freq: 0.6 + Math.random() * 1.6,
				});
			});
		};

		const draw = (dt: number) => {
			ctx.clearRect(0, 0, w, h);
			wind.x += (wind.tx - wind.x) * Math.min(1, dt * 3);
			const gp = (time % 3.4) / 3.4;
			const env = gp < 0.18 ? Math.sin((gp / 0.18) * Math.PI) : 0;
			const gustSpeed = 1 + env * 0.85 * cur.gust;
			const gustDensity = 1 + env * 0.4 * cur.gust;
			ctx.globalCompositeOperation = "lighter";
			if (cur.shimmer > 0.02) {
				[0, 1, 2].forEach((b) => {
					const by = (0.5 + b * 0.16) * h + Math.sin(time * 0.7 + b * 1.7) * 12;
					const grd = ctx.createLinearGradient(0, by - 26, 0, by + 26);
					grd.addColorStop(0, "rgba(255,138,80,0)");
					grd.addColorStop(0.5, `rgba(255,150,90,${0.05 * cur.shimmer})`);
					grd.addColorStop(1, "rgba(255,138,80,0)");
					ctx.fillStyle = grd;
					ctx.fillRect(0, by - 26, w, 52);
				});
			}
			const active = Math.round(MAX * clamp(cur.density * gustDensity, 0, 1));
			const [r, g, bl] = cur.color.map((c) => c | 0);
			const ang = cur.angle + wind.x * 0.5;
			const ca = Math.cos(ang);
			const sa = Math.sin(ang);
			parts.slice(0, active).forEach((p) => {
				const drift = Math.sin(time * p.freq + p.phase) * cur.turb;
				const vx = (ca * cur.speed * p.sf + drift * 24 + wind.x * 46) * gustSpeed;
				const vy =
					(sa * cur.speed * p.sf + Math.cos(time * p.freq * 0.7 + p.phase) * cur.turb * 10) * gustSpeed;
				p.x += vx * dt;
				p.y += vy * dt;
				if (p.y > h + 24) {
					p.y = -20;
					p.x = Math.random() * w;
				} else if (p.y < -24) p.y = h + 20;
				if (p.x > w + 24) p.x = -20;
				else if (p.x < -24) p.x = w + 20;
				const size = lerp(cur.sMin, cur.sMax, p.sizeF);
				if (cur.streak > 1) {
					const mag = Math.hypot(vx, vy) || 1;
					const len = cur.streak * (0.5 + p.sf * 0.7);
					ctx.strokeStyle = `rgba(${r},${g},${bl},${p.alpha})`;
					ctx.lineWidth = size;
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(p.x - (vx / mag) * len, p.y - (vy / mag) * len);
					ctx.stroke();
				} else {
					ctx.fillStyle = `rgba(${r},${g},${bl},${p.alpha})`;
					ctx.beginPath();
					ctx.arc(p.x, p.y, size, 0, TAU);
					ctx.fill();
				}
			});
			ctx.globalCompositeOperation = "source-over";
		};

		const staticFrame = () => {
			cur = to;
			time = 8;
			draw(0);
		};

		const resize = () => {
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = Math.max(1, Math.round(w * dpr));
			canvas.height = Math.max(1, Math.round(h * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (parts.length === 0) seed();
			if (reduce) staticFrame();
		};
		resize();
		addEventListener("resize", resize);

		const zone = canvas.parentElement;
		const onMove = (e: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			wind.tx = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
		};
		if (finePointer) zone?.addEventListener("pointermove", onMove, { passive: true });

		let raf = 0;
		let last = 0;
		const loop = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			time += dt;
			if (tt < 1) {
				tt = Math.min(1, tt + dt / 0.8);
				cur = mix(from, to, easeIO(tt));
			}
			draw(dt);
			raf = requestAnimationFrame(loop);
		};
		const start = () => {
			if (raf || reduce || document.hidden) return;
			last = performance.now();
			raf = requestAnimationFrame(loop);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};
		// Pause whenever the hero is off screen or the tab is hidden.
		let visible = true;
		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry?.isIntersecting ?? false;
				if (visible) start();
				else stop();
			},
			{ threshold: 0.02 },
		);
		io.observe(canvas);
		const onVisibility = () => {
			if (document.hidden) stop();
			else if (visible) start();
		};
		document.addEventListener("visibilitychange", onVisibility);

		const unsubscribe = subscribeTerrain(() => {
			const target = REGIMES[getTerrain()];
			if (reduce) {
				to = target;
				staticFrame();
				return;
			}
			from = cur;
			to = target;
			tt = 0;
		});

		return () => {
			stop();
			io.disconnect();
			unsubscribe();
			removeEventListener("resize", resize);
			document.removeEventListener("visibilitychange", onVisibility);
			zone?.removeEventListener("pointermove", onMove);
		};
	}, []);

	return <canvas ref={ref} className="absolute inset-0 z-[1] block h-full w-full" />;
}
