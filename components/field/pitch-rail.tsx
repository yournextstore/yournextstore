"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
	{
		name: "First light",
		time: "06:40",
		image: "/images/pexels/day-1-coffee.jpg",
		alt: "A titanium mug of coffee steaming beside a small stove at first light, a tent door and misty peaks behind.",
		body: "Stove lit at the tent door and a look at the sky. Five quiet minutes decide the route and what goes on top of the pack.",
	},
	{
		name: "Pack up",
		time: "08:05",
		image: "/images/pexels/day-2-commute.jpg",
		alt: "A large expedition pack and trekking poles beside a tent on a mountain ledge at dawn.",
		body: "Tent struck, bag stuffed, bottles filled. Breaking camp goes faster when everything has its place in the pack.",
	},
	{
		name: "Route check",
		time: "10:30",
		image: "/images/pexels/day-3-desk.jpg",
		alt: "A paper map, a compass and a pencil spread on a flat rock beside a tent.",
		body: "Map on a flat rock, compass on the map. The next col, the water source and where tonight's camp will be.",
	},
	{
		name: "On the ridge",
		time: "13:15",
		image: "/images/pexels/day-4-tracks.jpg",
		alt: "A hiker in a hooded shell with a backpack walking along a snowy ridge under grey cloud, seen from behind.",
		body: "The long middle of the day. Layers on and off with the wind, snacks from the hip belt, the pack settled into its stride.",
	},
	{
		name: "Pitch",
		time: "18:20",
		image: "/images/pexels/day-5-city-lights.jpg",
		alt: "An orange tent pitched on a high meadow at sunset, a pack lying beside it.",
		body: "Flat ground found, back to the wind. Fly up, guylines out, pad inflated before the light goes.",
	},
	{
		name: "Last light",
		time: "22:10",
		image: "/images/pexels/day-6-night-alley.jpg",
		alt: "A single tent glowing orange under the Milky Way on a dark mountain plateau.",
		body: "Headlamp on red, the stove packed away, the bag zipped to the chin. Tomorrow starts from here.",
	},
] as const;

const STEP_MS = 6000;

export function PitchRail() {
	const [index, setIndex] = useState(0);
	const rig = useRef<HTMLDivElement>(null);
	const fill = useRef<HTMLSpanElement>(null);
	const buttons = useRef<(HTMLButtonElement | null)[]>([]);
	const elapsed = useRef(0);
	const paused = useRef({ hover: false, focus: false, offscreen: true });

	const go = (i: number, focus = false) => {
		const next = (i + STEPS.length) % STEPS.length;
		elapsed.current = 0;
		if (fill.current) fill.current.style.transform = "scaleX(0)";
		setIndex(next);
		if (focus) buttons.current[next]?.focus();
	};

	useEffect(() => {
		const el = rig.current;
		if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const io = new IntersectionObserver(
			([entry]) => {
				paused.current.offscreen = !(entry?.isIntersecting ?? false);
			},
			{ threshold: 0.25 },
		);
		io.observe(el);
		// Pause while the shopper is pointing at or tabbing through the rig.
		const set = (key: "hover" | "focus", value: boolean) => () => {
			paused.current[key] = value;
		};
		const listeners: [string, () => void][] = [
			["pointerenter", set("hover", true)],
			["pointerleave", set("hover", false)],
			["focusin", set("focus", true)],
			["focusout", set("focus", false)],
		];
		for (const [type, fn] of listeners) el.addEventListener(type, fn);
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = now - last;
			last = now;
			const p = paused.current;
			if (!p.hover && !p.focus && !p.offscreen && !document.hidden) {
				elapsed.current += dt;
				if (fill.current) fill.current.style.transform = `scaleX(${Math.min(1, elapsed.current / STEP_MS)})`;
				if (elapsed.current >= STEP_MS) {
					elapsed.current = 0;
					setIndex((i) => (i + 1) % STEPS.length);
				}
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
			for (const [type, fn] of listeners) el.removeEventListener(type, fn);
		};
	}, []);

	const step = STEPS[index] ?? STEPS[0];

	return (
		<div ref={rig} className="frame">
			<div className="relative mb-[clamp(24px,4vw,40px)] grid grid-cols-6 gap-0.5 border-y border-line">
				{STEPS.map((s, i) => (
					<button
						key={s.name}
						ref={(el) => {
							buttons.current[i] = el;
						}}
						type="button"
						aria-current={i === index ? "step" : undefined}
						tabIndex={i === index ? 0 : -1}
						onClick={() => go(i)}
						onKeyDown={(e) => {
							const next =
								e.key === "ArrowRight" || e.key === "ArrowDown"
									? index + 1
									: e.key === "ArrowLeft" || e.key === "ArrowUp"
										? index - 1
										: e.key === "Home"
											? 0
											: e.key === "End"
												? STEPS.length - 1
												: null;
							if (next === null) return;
							e.preventDefault();
							go(next, true);
						}}
						className="relative flex cursor-pointer flex-col items-center gap-0 px-1 pt-3.5 pb-4 text-left transition-colors hover:bg-white/[.02] sm:items-start sm:gap-2 sm:px-3 sm:pt-[18px] sm:pb-5"
					>
						<span
							className={cn(
								"font-display text-[clamp(1.7rem,3.6vw,2.6rem)] leading-none transition-colors",
								i === index ? "text-signal" : i < index ? "text-dim" : "text-faint",
							)}
						>
							{String(i + 1).padStart(2, "0")}
						</span>{" "}
						<span
							className={cn(
								"font-field sr-only text-[0.72rem] tracking-[0.04em] uppercase sm:not-sr-only sm:block",
								i === index ? "text-ink" : "text-dim",
							)}
						>
							{s.name}
						</span>
						{i === index && (
							<span
								aria-hidden="true"
								className="hatch absolute right-1.5 bottom-2 left-1.5 h-1 opacity-90 sm:right-3 sm:bottom-3 sm:left-3"
							/>
						)}
					</button>
				))}
				<span aria-hidden="true" className="absolute right-0 -bottom-px left-0 h-0.5 overflow-hidden">
					<span ref={fill} className="block h-full w-full origin-left scale-x-0 bg-signal" />
				</span>
			</div>

			<div className="grid items-center gap-[22px] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-[clamp(20px,4vw,44px)]">
				<div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-line bg-panel">
					<Image
						key={step.image}
						src={step.image}
						alt={step.alt}
						fill
						sizes="(max-width: 768px) 100vw, 640px"
						className="animate-in fade-in object-cover duration-500"
					/>
				</div>
				<div aria-live="polite">
					<p className="font-field mb-4 flex items-center gap-3.5 text-[0.8rem] tracking-[0.08em] text-dim">
						<span className="font-bold text-signal">{String(index + 1).padStart(2, "0")}</span>
						<span className="rounded-[2px] border border-line px-[9px] py-0.5 text-faint">{step.time}</span>
					</p>
					<h3 className="mb-4 text-[clamp(1.8rem,4.4vw,2.9rem)] text-ink">{step.name}</h3>
					<p className="max-w-[44ch] text-[1.02rem] text-dim">{step.body}</p>
				</div>
			</div>
		</div>
	);
}
