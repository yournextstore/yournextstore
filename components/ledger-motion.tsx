"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const reducedMotion = () =>
	typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Solidifies the fixed header once the page scrolls (the original's gradient alone over cards reads thin). */
export function HeaderScrollState() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>("[data-site-header]");
		if (!header) return;
		const update = () => {
			header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);
	return null;
}

/**
 * The original's scroll reveals. Only blocks still below the fold when the page arms are hidden, so the
 * first paint never blinks and the page reads fully without JS. Watches <main> for route changes.
 */
export function RevealObserver() {
	useEffect(() => {
		if (reducedMotion()) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					(entry.target as HTMLElement).dataset.reveal = "in";
					io.unobserve(entry.target);
				}
			},
			{ threshold: 0.12, rootMargin: "4000px 0px -8% 0px" },
		);
		const arm = () => {
			for (const el of document.querySelectorAll<HTMLElement>(".reveal:not([data-reveal])")) {
				if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
					el.dataset.reveal = "seen";
					continue;
				}
				el.dataset.reveal = "pending";
				io.observe(el);
			}
		};
		arm();
		const main = document.querySelector("main");
		const mo = new MutationObserver(arm);
		if (main) mo.observe(main, { childList: true, subtree: true });
		return () => {
			io.disconnect();
			mo.disconnect();
		};
	}, []);
	return null;
}

/** Six-layer landscape parallax: each layer scrubbed at its own rate while the hero scrolls away. */
export function HeroParallax() {
	useEffect(() => {
		if (reducedMotion()) return;
		const hero = document.querySelector<HTMLElement>("[data-hero]");
		if (!hero) return;
		const layers = [...hero.querySelectorAll<HTMLElement>("[data-depth]")];
		let frame = 0;
		const update = () => {
			frame = 0;
			const height = hero.offsetHeight || 1;
			const progress = Math.min(1, Math.max(0, window.scrollY / height));
			for (const layer of layers) {
				const depth = Number(layer.dataset.depth) || 0;
				const fade = layer.dataset.fade === "true";
				const axis = layer.dataset.axis === "x" ? "x" : "y";
				const shift = progress * depth;
				layer.style.transform = axis === "x" ? `translate3d(${shift}%,0,0)` : `translate3d(0,${shift}%,0)`;
				if (fade) layer.style.opacity = String(1 - progress * 1.25);
			}
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, []);
	return null;
}

/** Counts up from zero when scrolled into view; the server renders the final figure. */
export function Counter({ value }: { value: number }) {
	const ref = useRef<HTMLSpanElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el || reducedMotion()) return;
		const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
		if (el.getBoundingClientRect().top < window.innerHeight) return;
		el.textContent = fmt(0);
		let frame = 0;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				io.disconnect();
				const start = performance.now();
				const tick = (now: number) => {
					const p = Math.min(1, (now - start) / 1600);
					el.textContent = fmt(value * (1 - (1 - p) ** 4));
					if (p < 1) frame = requestAnimationFrame(tick);
				};
				frame = requestAnimationFrame(tick);
			},
			{ threshold: 0.5 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			if (frame) cancelAnimationFrame(frame);
		};
	}, [value]);
	return (
		<span ref={ref} className="tabular-nums">
			{value.toLocaleString("en-US")}
		</span>
	);
}

/**
 * A price shelf whose vessel fills itself on scroll-in and re-pours on hover or focus. Server-rendered
 * filled; the browser drains it before the first pour only when it is still below the fold.
 */
export function PourCard({
	fill,
	order,
	className,
	children,
}: {
	fill: number;
	order: number;
	className?: string;
	children: React.ReactNode;
}) {
	const ref = useRef<HTMLElement>(null);
	const [state, setState] = useState<"full" | "empty">("full");
	const [pouring, setPouring] = useState(false);
	const busy = useRef(false);

	const pour = useCallback(() => {
		setState("full");
		setPouring(true);
		window.setTimeout(() => setPouring(false), 1500);
	}, []);

	useEffect(() => {
		const el = ref.current;
		if (!el || reducedMotion()) return;
		if (el.getBoundingClientRect().top < window.innerHeight) return;
		setState("empty");
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				io.disconnect();
				window.setTimeout(pour, order * 260);
			},
			{ threshold: 0.35 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [order, pour]);

	const repour = () => {
		if (reducedMotion() || busy.current || state !== "full") return;
		busy.current = true;
		setState("empty");
		window.setTimeout(() => {
			pour();
			window.setTimeout(() => {
				busy.current = false;
			}, 1800);
		}, 700);
	};

	return (
		<article
			ref={ref}
			className={className}
			style={{ "--fill": fill } as React.CSSProperties}
			data-pour={state}
			data-pouring={pouring}
			onMouseEnter={repour}
			onFocus={repour}
		>
			{children}
		</article>
	);
}
