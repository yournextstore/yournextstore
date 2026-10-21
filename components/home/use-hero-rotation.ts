"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** How long a piece stays up before the hero moves on to the next one. */
export const HERO_DWELL_MS = 6000;

/** A click this soon after an automatic change was aimed at the last piece. */
const MISCLICK_MS = 500;

/** Parts of the hero that hold the rotation while pointed at or focused. */
const HOLD = "[data-hero-hold]";
/** A piece's own controls: photo, name, option, add to bag. */
const CLAIM = "[data-hero-claim]";
/** The rotation toggle: it never holds, or it could not start it again. */
const FREE = "[data-hero-free]";

const holds = (target: EventTarget) =>
	target instanceof Element && target.closest(HOLD) !== null && target.closest(FREE) === null;

const VIEW_STEPS = Array.from({ length: 21 }, (_, step) => step / 20);

const subscribeToVisibility = (onChange: () => void) => {
	document.addEventListener("visibilitychange", onChange);
	return () => document.removeEventListener("visibilitychange", onChange);
};

const subscribeToMotion = (onChange: () => void) => {
	const query = window.matchMedia("(prefers-reduced-motion: reduce)");
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
};

const noop = () => () => {};

export const wrap = (value: number, count: number) => ((value % count) + count) % count;

/**
 * The home hero as a carousel: the piece changes by itself every HERO_DWELL_MS and the
 * visitor can always take over. It waits while the piece's details are pointed at or
 * focused, while the hero is scrolled away, the tab is hidden or a dialog is open; choosing a
 * piece or adding to the bag stops it, the toggle starts it again; never under reduced motion.
 */
export function useHeroRotation(count: number, regionRef: React.RefObject<HTMLElement | null>) {
	const [{ step, moves }, setPosition] = useState({ step: 0, moves: 0 });
	const [stopped, setStopped] = useState(false);
	const [pointed, setPointed] = useState(false);
	const [focused, setFocused] = useState(false);
	const [inView, setInView] = useState(true);
	const hydrated = useSyncExternalStore(
		noop,
		() => true,
		() => false,
	);
	const reducedMotion = useSyncExternalStore(
		subscribeToMotion,
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		() => false,
	);
	const pageVisible = useSyncExternalStore(
		subscribeToVisibility,
		() => document.visibilityState === "visible",
		() => true,
	);
	const lastAutoMove = useRef(Number.NEGATIVE_INFINITY);

	const rotates = count > 1 && !reducedMotion;
	const playing = hydrated && rotates && !stopped && !pointed && !focused && inView && pageVisible;
	const index = wrap(step, count);

	useEffect(() => {
		const region = regionRef.current;
		if (!region) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;
				const screen = entry.rootBounds?.height ?? window.innerHeight;
				setInView(entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= screen / 2);
			},
			{ threshold: VIEW_STEPS },
		);
		observer.observe(region);
		return () => observer.disconnect();
	}, [regionRef]);

	useEffect(() => {
		const region = regionRef.current;
		if (!region) return;
		const claim = (event: MouseEvent) => {
			if (!(event.target instanceof Element) || !event.target.closest(CLAIM)) return;
			setStopped(true);
			if (performance.now() - lastAutoMove.current < MISCLICK_MS) {
				event.preventDefault();
				event.stopPropagation();
			}
		};
		region.addEventListener("click", claim, true);
		return () => region.removeEventListener("click", claim, true);
	}, [regionRef]);

	useEffect(() => {
		if (!playing) return;
		const timer = window.setInterval(() => {
			// An open dialog (search, menu, bag) covers the page: keep the piece until it closes.
			if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
			lastAutoMove.current = performance.now();
			setPosition((current) => ({ step: current.step + 1, moves: current.moves + 1 }));
		}, HERO_DWELL_MS);
		return () => window.clearInterval(timer);
	}, [playing]);

	const move = (delta: number) => {
		setStopped(true);
		if (delta === 0) return;
		setPosition((current) => ({ step: current.step + delta, moves: current.moves + 1 }));
	};

	return {
		step,
		index,
		moves,
		rotates,
		playing,
		stopped,
		shift: move,
		show: (position: number) => {
			const forward = wrap(position - index, count);
			move(forward * 2 <= count ? forward : forward - count);
		},
		toggle: () => setStopped((value) => !value),
		hold: {
			onPointerOver: (event: React.PointerEvent) => {
				if (event.pointerType !== "mouse") return;
				setPointed(holds(event.target));
			},
			onPointerLeave: () => setPointed(false),
			onFocus: (event: React.FocusEvent) => setFocused(holds(event.target)),
			onBlur: (event: React.FocusEvent) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
			},
		},
	};
}
