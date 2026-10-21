"use client";

import { useEffect, useRef, useState } from "react";
import { ObjectExploded, PART_CALLOUTS, type PartId } from "@/components/halfstep/object-drawing";

/**
 * The original pins the diagram for 3.4 screens. Here it stays in the flow: the parts fly out as the
 * stage scrolls towards the middle of the screen, hold while it sits there, and bolt themselves back
 * together on the way out. Reduced motion (and no JS) keeps the assembled object with its labels.
 */

type PartDef = { id: PartId; dx: number; dy: number; rot: number; delay: number };

const PARTS: PartDef[] = [
	{ id: "loop", dx: -40, dy: -50, rot: -8, delay: 0 },
	{ id: "cap", dx: -150, dy: -20, rot: -10, delay: 0.07 },
	{ id: "seal", dx: -200, dy: 60, rot: -4, delay: 0.14 },
	{ id: "shell", dx: 100, dy: 0, rot: 5, delay: 0.21 },
	{ id: "base", dx: 100, dy: 0, rot: 0, delay: 0.28 },
	{ id: "inner", dx: -60, dy: 10, rot: -2, delay: 0.34 },
];

const STAGGER = 0.35;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const smooth = (a: number, b: number, v: number) => {
	const t = clamp((v - a) / (b - a), 0, 1);
	return t * t * (3 - 2 * t);
};

const PHASES = ["assembled", "coming apart", "exploded", "reassembling"] as const;

export function ExplodeStage({ title }: { title: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const [phase, setPhase] = useState<(typeof PHASES)[number]>("assembled");
	const bar = useRef<HTMLElement>(null);

	useEffect(() => {
		const root = ref.current;
		if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const svg = root.querySelector("svg");
		if (!svg) return;

		const wired = PARTS.map((def) => {
			const callout = svg.querySelector<SVGGElement>(`[data-for="${def.id}"]`);
			const anchor = PART_CALLOUTS.find((c) => c.part === def.id);
			return {
				def,
				anchor,
				nodes: [...svg.querySelectorAll<SVGGElement>(`[data-part="${def.id}"]`)],
				callout,
				line: callout?.querySelector<SVGLineElement>(".c-line") ?? null,
				dot: callout?.querySelector<SVGCircleElement>(".c-dot") ?? null,
			};
		});
		const fades = [...svg.querySelectorAll<SVGGElement>("[data-fade]")];
		root.dataset.armed = "true";

		let active = false;
		let lastPhase = "";
		const render = () => {
			if (!active) return;
			const rect = root.getBoundingClientRect();
			const vh = window.innerHeight;
			// 0 when the stage's top enters at the bottom, 1 when its bottom leaves at the top.
			const p = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
			const e = smooth(0.16, 0.42, p) * (1 - smooth(0.66, 0.9, p));

			for (const w of wired) {
				const local = clamp(e * (1 + STAGGER) - w.def.delay, 0, 1);
				const k = easeOut(local);
				const t = `translate(${w.def.dx * k}px, ${w.def.dy * k}px) rotate(${w.def.rot * k}deg)`;
				for (const node of w.nodes) node.style.transform = t;
				if (w.callout) w.callout.style.opacity = String(clamp((k - 0.5) / 0.35, 0, 1));
				if (w.anchor) {
					const x = (w.anchor.ax + w.def.dx * k).toFixed(1);
					const y = (w.anchor.ay + w.def.dy * k).toFixed(1);
					w.line?.setAttribute("x2", x);
					w.line?.setAttribute("y2", y);
					w.dot?.setAttribute("cx", x);
					w.dot?.setAttribute("cy", y);
				}
			}
			for (const node of fades) node.style.opacity = (1 - e).toFixed(2);

			const next = e < 0.02 ? "assembled" : e > 0.98 ? "exploded" : p < 0.5 ? "coming apart" : "reassembling";
			if (next !== lastPhase) {
				lastPhase = next;
				setPhase(next);
			}
			if (bar.current) bar.current.style.width = `${(p * 100).toFixed(1)}%`;
		};

		const io = new IntersectionObserver((entries) => {
			active = entries[0]?.isIntersecting ?? false;
			if (active) render();
		});
		io.observe(root);
		window.addEventListener("scroll", render, { passive: true });
		window.addEventListener("resize", render);
		return () => {
			io.disconnect();
			window.removeEventListener("scroll", render);
			window.removeEventListener("resize", render);
		};
	}, []);

	return (
		<div ref={ref} className="hs-wrap">
			<div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
				<p className="hs-label">[ Ride bottle — service diagram ]</p>
				<p className="hs-label">
					<span className="text-signal">{phase}</span> · 06 assemblies · 00 spare screws
				</p>
			</div>
			<figure className="m-0 grid place-items-center py-4">
				<ObjectExploded titleId="explode-title" title={title} />
			</figure>
			<div aria-hidden="true" className="h-1 overflow-hidden rounded-[3px] border border-line bg-line-soft">
				<i ref={bar} className="block h-full w-0 bg-lime" />
			</div>
		</div>
	);
}
