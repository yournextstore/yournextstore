"use client";

import { useEffect, useRef, useState } from "react";
import { PaperToggle, usePaper } from "@/components/paper-toggle";
import { PAPER_NOTES } from "@/lib/paper";

type Point = { x: number; y: number; w: number };
type Stroke = { tool: "ink" | "hl"; pts: Point[] };

const HL_W = 16;
const HL_COLOR = "rgba(242, 193, 78, .45)";
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * The original's desk: the ruling radios that re-rule the whole site, and a scratch pad where
 * pointer speed is the pressure proxy (slow strokes run wet, fast ones go lean). Strokes are kept
 * as points so the drawing survives resizes and redraws in the right ink when the theme flips.
 */
export function Desk() {
	const [paper] = usePaper();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const toolRef = useRef<Stroke["tool"]>("ink");
	const clearRef = useRef<() => void>(() => {});
	const [tool, setTool] = useState<Stroke["tool"]>("ink");
	const [marked, setMarked] = useState(false);

	useEffect(() => {
		const pad = canvasRef.current;
		const ctx = pad?.getContext("2d");
		if (!pad || !ctx) return;
		const root = document.documentElement;
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		const strokes: Stroke[] = [];
		let cur: Stroke | null = null;
		let lastPt: Point | null = null;
		let lastT = 0;
		let lastW: number | null = null;

		const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
		const inkColor = () => getComputedStyle(root).getPropertyValue("--pen").trim() || "#14171f";

		const nibWidth = (v: number) => {
			const t = 1 + (6.5 - 1) * Math.exp(-v / 0.55);
			if (reduce || lastW === null) {
				lastW = reduce ? 2.6 : t;
				return lastW;
			}
			lastW += (t - lastW) * 0.3;
			return lastW;
		};

		const segment = (p0: Point | undefined, a: Point, b: Point) => {
			ctx.beginPath();
			ctx.lineWidth = (a.w + b.w) / 2;
			const mx = (a.x + b.x) / 2;
			const my = (a.y + b.y) / 2;
			if (!p0) {
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(mx, my);
			} else {
				ctx.moveTo((p0.x + a.x) / 2, (p0.y + a.y) / 2);
				ctx.quadraticCurveTo(a.x, a.y, mx, my);
			}
			ctx.stroke();
		};

		const setPen = (s: Stroke) => {
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.strokeStyle = s.tool === "hl" ? HL_COLOR : inkColor();
			ctx.fillStyle = ctx.strokeStyle;
		};

		const drawStroke = (s: Stroke) => {
			const first = s.pts[0];
			if (!first) return;
			setPen(s);
			if (s.pts.length === 1) {
				ctx.beginPath();
				ctx.arc(first.x, first.y, first.w / 2, 0, 7);
				ctx.fill();
				return;
			}
			s.pts.slice(1).forEach((pt, i) => {
				const prev = s.pts[i];
				if (prev) segment(s.pts[i - 1], prev, pt);
			});
		};

		const redraw = () => {
			ctx.clearRect(0, 0, pad.width, pad.height);
			for (const s of strokes) drawStroke(s);
		};

		const size = () => {
			const r = pad.getBoundingClientRect();
			pad.width = Math.max(1, Math.round(r.width * dpr()));
			pad.height = Math.max(1, Math.round(r.height * dpr()));
			ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
			redraw();
		};
		const ro = new ResizeObserver(size);
		ro.observe(pad);
		size();

		// The ink follows the theme: next-themes flips the class on <html>.
		const mo = new MutationObserver(redraw);
		mo.observe(root, { attributes: true, attributeFilter: ["class"] });

		const pos = (e: PointerEvent) => {
			const r = pad.getBoundingClientRect();
			return { x: e.clientX - r.left, y: e.clientY - r.top };
		};

		const onDown = (e: PointerEvent) => {
			if (e.button > 0) return;
			pad.setPointerCapture(e.pointerId);
			setMarked(true);
			const p = pos(e);
			lastW = null;
			lastT = e.timeStamp;
			const w = toolRef.current === "hl" ? HL_W : reduce ? 2.6 : 3.4;
			const start = { x: p.x, y: p.y, w };
			cur = { tool: toolRef.current, pts: [start] };
			strokes.push(cur);
			lastPt = start;
			setPen(cur);
			ctx.beginPath();
			ctx.arc(p.x, p.y, w / 2, 0, 7);
			ctx.fill();
			e.preventDefault();
		};
		const onMove = (e: PointerEvent) => {
			if (!cur || !lastPt) return;
			const p = pos(e);
			const dist = Math.hypot(p.x - lastPt.x, p.y - lastPt.y);
			if (dist < 1.4) return;
			const v = dist / Math.max(1, e.timeStamp - lastT);
			const pt = { x: p.x, y: p.y, w: cur.tool === "hl" ? HL_W : nibWidth(v) };
			cur.pts.push(pt);
			const n = cur.pts.length;
			const b = cur.pts[n - 2];
			setPen(cur);
			if (b) segment(cur.pts[n - 3], b, pt);
			lastPt = pt;
			lastT = e.timeStamp;
		};
		const onUp = () => {
			cur = null;
			lastW = null;
		};
		pad.addEventListener("pointerdown", onDown);
		pad.addEventListener("pointermove", onMove);
		pad.addEventListener("pointerup", onUp);
		pad.addEventListener("pointercancel", onUp);

		clearRef.current = () => {
			strokes.length = 0;
			redraw();
			setMarked(false);
		};

		// The sample flourish: uneven spacing between points gives the nib model real thick-and-thin.
		const runSample = () => {
			const r = pad.getBoundingClientRect();
			const n = 110;
			const pts = Array.from({ length: n }, (_, i) => {
				const t = i / (n - 1);
				const xt = t - 0.11 * Math.sin(t * Math.PI * 3);
				return {
					x: (0.1 + 0.8 * xt) * r.width,
					y:
						(0.5 + 0.17 * Math.sin(t * Math.PI * 2.2) - 0.05 * Math.sin(t * Math.PI * 9) * (1 - t)) *
						r.height,
				};
			});
			const widths: number[] = [];
			for (const [i, p] of pts.entries()) {
				const prevPt = pts[i - 1];
				const d = prevPt ? Math.hypot(p.x - prevPt.x, p.y - prevPt.y) : 2;
				const t = 1 + 5.5 * Math.exp(-(d / 14) / 0.55);
				const prevW = widths.at(-1);
				widths.push(prevW === undefined ? t : prevW + (t - prevW) * 0.3);
			}
			const s: Stroke = { tool: "ink", pts: [] };
			strokes.unshift(s);
			if (reduce) {
				s.pts.push(...pts.map((p) => ({ ...p, w: 2.6 })));
				redraw();
				return;
			}
			let i = 0;
			const t0 = performance.now();
			const step = () => {
				const target = Math.ceil(clamp((performance.now() - t0) / 900, 0, 1) * pts.length);
				while (i < target) {
					const p = pts[i];
					if (p) s.pts.push({ x: p.x, y: p.y, w: widths[i] ?? 2.6 });
					const n2 = s.pts.length;
					const a = s.pts[n2 - 2];
					const b = s.pts[n2 - 1];
					if (a && b) {
						setPen(s);
						segment(s.pts[n2 - 3], a, b);
					}
					i++;
				}
				if (i < pts.length) requestAnimationFrame(step);
			};
			step();
		};
		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					runSample();
					io.disconnect();
				}
			},
			{ threshold: 0.5 },
		);
		io.observe(pad);

		return () => {
			ro.disconnect();
			mo.disconnect();
			io.disconnect();
			pad.removeEventListener("pointerdown", onDown);
			pad.removeEventListener("pointermove", onMove);
			pad.removeEventListener("pointerup", onUp);
			pad.removeEventListener("pointercancel", onUp);
		};
	}, []);

	const pick = (next: Stroke["tool"]) => {
		toolRef.current = next;
		setTool(next);
	};

	return (
		<div className="grid items-start gap-[clamp(1.6rem,4vw,3.2rem)] min-[880px]:grid-cols-[0.9fr_1.1fr]">
			<div className="reveal">
				<PaperToggle label="The ruling" />
				<p aria-live="polite" className="mt-5 min-h-[4.6em] max-w-[40ch] text-dim">
					<strong className="font-bold text-ink">{PAPER_NOTES[paper].head}</strong> {PAPER_NOTES[paper].body}
					<span className="mono mt-1.5 block text-[0.72rem] text-faint">{PAPER_NOTES[paper].spec}</span>
				</p>
				<div className="mt-6 flex flex-wrap gap-2">
					<button
						type="button"
						className="tool-btn"
						aria-pressed={tool === "ink"}
						onClick={() => pick("ink")}
					>
						Fine nib
					</button>
					<button
						type="button"
						className="tool-btn tool-btn--hl"
						aria-pressed={tool === "hl"}
						onClick={() => pick("hl")}
					>
						Highlighter
					</button>
					<button type="button" className="tool-btn" onClick={() => clearRef.current()}>
						Tear off the page
					</button>
				</div>
				<p className="mono mt-4 max-w-[38ch] text-[0.72rem] text-faint">
					Line weight follows your hand — the slower the stroke, the wetter the line. Same as a real nib on
					good paper.
				</p>
			</div>
			<div className="reveal [--d:.1s]">
				<div className="sheet-panel">
					<span className="margin-line" aria-hidden="true" />
					<canvas
						ref={canvasRef}
						aria-label="Scratch pad — draw here with your mouse, finger or stylus"
						className="block h-[clamp(300px,42vw,440px)] w-full cursor-crosshair touch-none"
					>
						A scratch pad for doodling. Your browser can’t show it — picture a fresh sheet.
					</canvas>
					<span
						aria-hidden="true"
						className={`label-mono pointer-events-none absolute bottom-[0.9rem] left-[1.1rem] tracking-[0.1em] transition-opacity duration-500 ${marked ? "opacity-0" : ""}`}
					>
						draw here — slow for wet, quick for lean
					</span>
				</div>
				<p className="mono mt-3.5 flex flex-wrap justify-between gap-x-4 gap-y-1 text-[0.7rem] text-faint">
					<span>the scratch pad — honest tooth</span>
					<span>nothing you draw leaves this page</span>
				</p>
			</div>
		</div>
	);
}
