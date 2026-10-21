"use client";

import { useEffect, useRef, useState } from "react";
import type { PatchAudio } from "./patch-audio";
import type { PatchbayApi } from "./patch-engine";

/**
 * The signature toy: a draggable patch-cable rack. The SVG engine loads only when the panel nears
 * the viewport, and sound stays off until the shopper switches it on.
 */
export function PatchPanel({ brand }: { brand: string }) {
	const hostRef = useRef<HTMLDivElement>(null);
	const apiRef = useRef<PatchbayApi | null>(null);
	const audioRef = useRef<PatchAudio | null>(null);
	const [status, setStatus] = useState("The beacon is dark. Grab a cable — start at a jack marked OUT.");
	const [sound, setSound] = useState(false);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		let cancelled = false;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries[0]?.isIntersecting) return;
				io.disconnect();
				void Promise.all([import("./patch-engine"), import("./patch-audio")]).then(([engine, voice]) => {
					if (cancelled) return;
					const audio = new voice.PatchAudio();
					audioRef.current = audio;
					apiRef.current = engine.initPatchbay(host, audio, setStatus, brand);
					setReady(true);
				});
			},
			{ rootMargin: "400px 0px" },
		);
		io.observe(host);
		return () => {
			cancelled = true;
			io.disconnect();
			apiRef.current?.destroy();
			audioRef.current?.dispose();
			apiRef.current = null;
			audioRef.current = null;
		};
	}, [brand]);

	const toggleSound = async () => {
		const audio = audioRef.current;
		if (!audio) return;
		const on = await audio.toggle();
		setSound(on);
		setStatus(
			on
				? "Sound on. Patch SOURCE → LEVEL → TONE → OUTPUT and the rack will hum at you."
				: "Sound off. The cables still work; they just glow silently.",
		);
	};

	return (
		<>
			<div className="mb-[1.1rem] flex flex-wrap items-center gap-2">
				<button type="button" className="chip" aria-pressed={sound} onClick={toggleSound} disabled={!ready}>
					Sound: {sound ? "on" : "off"}
				</button>
				<span className="font-plate text-[0.7rem] text-faint">starts silent · your neighbours thank you</span>
				<span className="hidden flex-1 md:block" />
				<button
					type="button"
					className="chip"
					onClick={() => apiRef.current?.patchClassic()}
					disabled={!ready}
				>
					Patch the classic circuit
				</button>
				<button type="button" className="chip" onClick={() => apiRef.current?.surprise()} disabled={!ready}>
					Surprise me
				</button>
				<button type="button" className="chip" onClick={() => apiRef.current?.clearAll()} disabled={!ready}>
					Pull all cables
				</button>
			</div>

			{/* biome-ignore lint/a11y/noNoninteractiveTabindex: the scroll region must be reachable by keyboard on phones */}
			<section className="overflow-x-auto rounded-2xl" aria-label="Patch panel, scrollable" tabIndex={0}>
				<div
					ref={hostRef}
					className="relative aspect-[960/300] min-w-[780px] overflow-hidden rounded-2xl bg-face-2 shadow-[var(--rk-shadow)]"
				/>
			</section>

			<p aria-live="polite" className="font-plate mt-4 min-h-[1.6em] text-[0.8rem] text-ink">
				<span aria-hidden="true" className="text-signal">
					▸{" "}
				</span>
				{status}
			</p>
			<p className="font-plate mt-2 text-[0.72rem] text-faint">
				Keyboard: <Kbd>Tab</Kbd> to a jack, <Kbd>Enter</Kbd> picks up a cable, <Kbd>Enter</Kbd> on another
				jack plugs it in, <Kbd>Esc</Kbd> drops it. <Kbd>Enter</Kbd> on a patched input pulls its cable. The
				preset buttons above do the wiring for you.
			</p>
		</>
	);
}

function Kbd({ children }: { children: string }) {
	return (
		<kbd className="rounded-[4px] border border-b-2 border-line px-[0.3em] font-[inherit]">{children}</kbd>
	);
}
