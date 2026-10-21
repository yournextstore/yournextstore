"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
	{
		name: "Browse",
		detail: "Every machine and tool on one list, filtered by shelf, collection and price.",
		caption: "every machine and tool on one list, filtered your way.",
		image: "/images/pexels/shop-shelves.jpg",
		alt: "Espresso machines and grinders lined up along a dark showroom counter under warm spotlights.",
	},
	{
		name: "Read",
		detail: "Each page carries its photos, options, price and live stock.",
		caption: "photos, options, price and stock on one page.",
		image: "/images/pexels/brass-rings.jpg",
		alt: "A round espresso pressure gauge with a copper needle catching warm light.",
	},
	{
		name: "Choose",
		detail: "Pick a finish or a size; price and stock follow the choice.",
		caption: "price and stock follow the option you pick.",
		image: "/images/pexels/leather-jacket-watch.jpg",
		alt: "A brushed steel and a matte black espresso machine side by side on a dark counter.",
	},
	{
		name: "Basket",
		detail: "Codes apply in the drawer; the total updates before you leave.",
		caption: "codes apply in the drawer, the total updates.",
		image: "/images/pexels/leather-purse.jpg",
		alt: "A glass of espresso with thick crema on a dark stone counter.",
	},
	{
		name: "Checkout",
		detail: "One secure page: cards and wallets, delivery rates shown before you pay.",
		caption: "one secure page, delivery shown before you pay.",
		image: "/images/pexels/watch-banknote.jpg",
		alt: "Espresso pouring from a portafilter into a glass cup on a small black scale.",
	},
	{
		name: "Confirm",
		detail: "An order page with everything you bought, and your history in your account.",
		caption: "an order page, and your history in your account.",
		image: "/images/pexels/boxes-in-hand.jpg",
		alt: "A hand holding a plain kraft box beside an espresso machine.",
	},
] as const;

const STEP_MS = 6000;

/** Numbered stepper with a sticky photo panel; auto-advances with a copper progress bar, pauses on hover/focus. */
export function ProcessStepper() {
	const [index, setIndex] = useState(0);
	const rig = useRef<HTMLDivElement>(null);
	const bar = useRef<HTMLSpanElement>(null);
	const elapsed = useRef(0);
	const paused = useRef({ hover: false, focus: false, offscreen: true });

	const go = (i: number) => {
		elapsed.current = 0;
		if (bar.current) bar.current.style.transform = "scaleX(0)";
		setIndex(i);
	};

	useEffect(() => {
		const el = rig.current;
		if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const io = new IntersectionObserver(
			([entry]) => {
				paused.current.offscreen = !(entry?.isIntersecting ?? false);
			},
			{ threshold: 0.2 },
		);
		io.observe(el);
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
				if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, elapsed.current / STEP_MS)})`;
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
		<div ref={rig} className="frame grid items-start gap-5 md:grid-cols-2 md:gap-[clamp(24px,4vw,56px)]">
			<ol
				aria-label="Process steps"
				className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:block md:overflow-visible md:px-0"
			>
				{STEPS.map((s, i) => (
					<li key={s.name} className="flex-none snap-start">
						<button
							type="button"
							aria-current={i === index ? "step" : undefined}
							onClick={() => go(i)}
							className={cn(
								"relative flex w-full min-w-[120px] cursor-pointer flex-col gap-2 rounded-[4px] border border-line px-3.5 py-3 text-left transition-colors md:flex-row md:gap-[18px] md:rounded-[4px] md:border-0 md:border-t md:border-line-2 md:px-4 md:py-[18px]",
								i === 0 && "md:border-t-0",
								i === index &&
									"bg-[linear-gradient(90deg,rgba(200,98,44,.06),transparent)] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-copper md:before:inset-x-auto md:before:-top-px md:before:bottom-0 md:before:left-0 md:before:h-auto md:before:w-0.5",
							)}
						>
							<span
								className={cn(
									"font-readout flex-none pt-[.1em] text-[0.9rem] font-medium transition-colors",
									i === index ? "text-copper" : "text-faint",
								)}
							>
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="block">
								<span
									className={cn(
										"font-display block text-[1.05rem] leading-[1.1] transition-colors md:text-[1.5rem]",
										i === index ? "text-ink" : i < index ? "text-faint" : "text-dim",
									)}
								>
									{s.name}
								</span>
								<span
									className={cn(
										"mt-1 hidden text-[0.9rem] leading-[1.45] md:block",
										i === index ? "text-dim" : "text-faint",
									)}
								>
									{s.detail}
								</span>
							</span>
						</button>
					</li>
				))}
			</ol>

			<div className="md:sticky md:top-24">
				<div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-panel">
					{STEPS.map((s, i) => (
						<Image
							key={s.name}
							src={s.image}
							alt={i === index ? s.alt : ""}
							aria-hidden={i !== index}
							fill
							sizes="(max-width: 768px) 100vw, 600px"
							className={cn(
								"object-cover transition-opacity duration-400 motion-reduce:transition-none",
								i === index ? "opacity-100" : "opacity-0",
							)}
						/>
					))}
					<span aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[2] h-0.5">
						<span
							ref={bar}
							className="block h-full w-full origin-left scale-x-0 bg-copper shadow-[0_0_8px_rgba(200,98,44,.6)]"
						/>
					</span>
				</div>
				<p aria-live="polite" className="font-readout mt-3.5 text-[0.78rem] tracking-[0.03em] text-dim">
					Step {String(index + 1).padStart(2, "0")} — {step.name} · {step.caption}
				</p>
			</div>
		</div>
	);
}
