/**
 * The patch panel: a five-module row built as SVG from data. Drag a cable from any OUT to any
 * IN; the cable sags (quadratic bezier), settles with a damped bounce, then sways idly. Wire
 * SOURCE → LEVEL → TONE → OUTPUT and the beacon lights (and hums, if sound was switched on).
 * Reduced motion: cables draw instantly, nothing sways. Keyboard: every jack is a focusable
 * button; Enter picks a cable up, Enter on another jack plugs it in, Esc drops it.
 */

import type { PatchAudio, PatchState } from "./patch-audio";

type Dir = "in" | "out";

interface JackDef {
	id: string;
	module: string;
	label: string;
	dir: Dir;
	x: number;
	y: number;
}

interface KnobDef {
	x: number;
	y: number;
	r: number;
	turn: number;
	label?: string;
}

interface ModuleDef {
	id: string;
	name: string;
	hp: number;
	x: number;
	w: number;
	knobs: KnobDef[];
	jacks: JackDef[];
}

interface Connection {
	from: string;
	to: string;
	born: number;
	phase: number;
	group: SVGGElement;
	shadow: SVGPathElement;
	core: SVGPathElement;
	hit: SVGPathElement;
	plugA: SVGCircleElement;
	plugB: SVGCircleElement;
}

const NS = "http://www.w3.org/2000/svg";

const jack = (id: string, module: string, label: string, dir: Dir, x: number, y: number): JackDef => ({
	id,
	module,
	label,
	dir,
	x,
	y,
});

const MODULES: ModuleDef[] = [
	{
		id: "source",
		name: "SOURCE",
		hp: 12,
		x: 20,
		w: 190,
		knobs: [
			{ x: 115, y: 108, r: 28, turn: 35, label: "VOLTS" },
			{ x: 70, y: 182, r: 12, turn: -50 },
			{ x: 160, y: 182, r: 12, turn: 20 },
		],
		jacks: [
			jack("source.tune", "Source", "TUNE", "in", 70, 232),
			jack("source.out", "Source", "CURRENT", "out", 160, 232),
		],
	},
	{
		id: "pulse",
		name: "PULSE",
		hp: 8,
		x: 218,
		w: 130,
		knobs: [{ x: 283, y: 112, r: 26, turn: -20, label: "RATE" }],
		jacks: [jack("pulse.out", "Pulse", "PULSE", "out", 283, 232)],
	},
	{
		id: "dimmer",
		name: "LEVEL",
		hp: 14,
		x: 356,
		w: 214,
		knobs: [
			{ x: 463, y: 108, r: 30, turn: 70, label: "GAIN" },
			{ x: 405, y: 180, r: 12, turn: 120 },
			{ x: 521, y: 180, r: 12, turn: -30 },
		],
		jacks: [
			jack("dimmer.in", "Level", "IN", "in", 400, 232),
			jack("dimmer.cv", "Level", "GAIN CV", "in", 463, 232),
			jack("dimmer.out", "Level", "OUT", "out", 526, 232),
		],
	},
	{
		id: "tint",
		name: "TONE",
		hp: 11,
		x: 578,
		w: 176,
		knobs: [
			{ x: 666, y: 112, r: 24, turn: 45, label: "COLOUR" },
			{ x: 666, y: 180, r: 12, turn: 0 },
		],
		jacks: [
			jack("tint.in", "Tone", "IN", "in", 620, 232),
			jack("tint.cv", "Tone", "CV", "in", 666, 232),
			jack("tint.out", "Tone", "OUT", "out", 712, 232),
		],
	},
	{
		id: "lamp",
		name: "OUTPUT",
		hp: 11,
		x: 762,
		w: 178,
		knobs: [{ x: 851, y: 184, r: 13, turn: 10 }],
		jacks: [jack("lamp.in", "Output", "IN", "in", 851, 232)],
	},
];

const JACKS = new Map<string, JackDef>();
for (const m of MODULES) for (const j of m.jacks) JACKS.set(j.id, j);

/** Signal flows through these modules: in-jack ⇒ out-jack. */
const THROUGH: Record<string, string> = {
	"dimmer.in": "dimmer.out",
	"tint.in": "tint.out",
};

const PAIR_NOTES: Record<string, string> = {
	"source.out>dimmer.in": "Current into the level. It has something to hold back now.",
	"dimmer.out>tint.in": "Level into the tone. Warm, civilised.",
	"tint.out>lamp.in": "Tone to the output. Almost there.",
	"source.out>lamp.in": "Raw current straight to the output. Bright. Unfiltered. Slightly rude.",
	"pulse.out>dimmer.cv": "Pulse on the level — the beacon is breathing.",
	"pulse.out>tint.cv": "Pulse on the tone. A flicker, very 1957.",
	"pulse.out>source.tune": "Pulse on the source. A polite shimmer.",
	"pulse.out>lamp.in": "The pulse, alone, into the output. That's not a signal, that's weather.",
	"source.out>source.tune": "The source feeding itself. Self-modulation — the house favourite.",
	"source.out>dimmer.cv": "Current on the level's CV. Chaos. Keep it.",
	"dimmer.out>dimmer.cv": "The level feeding its own CV. Strobe physics.",
};

function getJack(id: string): JackDef {
	const j = JACKS.get(id);
	if (!j) throw new Error(`Unknown jack ${id}`);
	return j;
}

const label = (id: string) => {
	const j = JACKS.get(id);
	return j ? `${j.module} ${j.label.toLowerCase()}` : id;
};

const pairNote = (from: string, to: string) =>
	PAIR_NOTES[`${from}>${to}`] ??
	`${label(from)} into ${label(to)}. No idea if that's wise. That's the point.`;

function el<K extends keyof SVGElementTagNameMap>(
	tag: K,
	attrs: Record<string, string>,
	parent?: Element,
): SVGElementTagNameMap[K] {
	const node = document.createElementNS(NS, tag);
	for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
	parent?.appendChild(node);
	return node;
}

function text(parent: Element, x: number, y: number, cls: string, content: string) {
	const t = el("text", { x: String(x), y: String(y), class: cls }, parent);
	t.textContent = content;
	return t;
}

/** The cable curve: endpoints plus a low midpoint. Gravity, roughly. */
function cablePath(ax: number, ay: number, bx: number, by: number, slack = 0) {
	const dist = Math.hypot(bx - ax, by - ay);
	const sag = Math.min(95, 24 + dist * 0.22) + slack;
	const mx = (ax + bx) / 2;
	const my = Math.max(ay, by) + sag;
	return `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
}

export interface PatchbayApi {
	patchClassic: () => void;
	surprise: () => void;
	clearAll: () => void;
	destroy: () => void;
}

export function initPatchbay(
	host: HTMLElement,
	audio: PatchAudio,
	setStatus: (msg: string) => void,
	brand: string,
): PatchbayApi {
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const svg = el(
		"svg",
		{ viewBox: "0 0 960 300", class: "absolute inset-0 block h-full w-full", role: "group" },
		host,
	);
	svg.setAttribute("aria-label", "Interactive patch panel: five modules with patchable jacks");

	el("rect", { x: "0", y: "0", width: "960", height: "300", rx: "16", class: "pb-bgplate" }, svg);
	el("rect", { x: "8", y: "8", width: "944", height: "12", rx: "3", class: "pb-rail" }, svg);
	el("rect", { x: "8", y: "280", width: "944", height: "12", rx: "3", class: "pb-rail" }, svg);

	const moduleLeds = new Map<string, SVGCircleElement>();
	const jackEls = new Map<string, SVGGElement>();

	let screwSeed = 0;
	const screw = (x: number, y: number) => {
		el("circle", { cx: String(x), cy: String(y), r: "3.4", class: "pb-screw" }, svg);
		const a = (((screwSeed++ * 47) % 180) * Math.PI) / 180;
		const dx = Math.cos(a) * 2.6;
		const dy = Math.sin(a) * 2.6;
		el(
			"line",
			{
				x1: (x - dx).toFixed(1),
				y1: (y - dy).toFixed(1),
				x2: (x + dx).toFixed(1),
				y2: (y + dy).toFixed(1),
				class: "pb-screw-slot",
			},
			svg,
		);
	};

	for (const m of MODULES) {
		el(
			"rect",
			{ x: String(m.x), y: "24", width: String(m.w), height: "252", rx: "6", class: "pb-face" },
			svg,
		);
		screw(m.x + 10, 14);
		screw(m.x + m.w - 10, 14);
		screw(m.x + 10, 286);
		screw(m.x + m.w - 10, 286);

		const cx = m.x + m.w / 2;
		text(svg, cx, 46, "pb-label pb-label--name", m.name);
		text(svg, cx, 60, "pb-label pb-hp", `${m.hp} HP`);

		for (const k of m.knobs) {
			el("circle", { cx: String(k.x), cy: String(k.y), r: String(k.r), class: "pb-knob" }, svg);
			const rad = ((k.turn - 90) * Math.PI) / 180;
			el(
				"line",
				{
					x1: (k.x + Math.cos(rad) * (k.r * 0.45)).toFixed(1),
					y1: (k.y + Math.sin(rad) * (k.r * 0.45)).toFixed(1),
					x2: (k.x + Math.cos(rad) * (k.r - 3)).toFixed(1),
					y2: (k.y + Math.sin(rad) * (k.r - 3)).toFixed(1),
					class: "pb-mark",
				},
				svg,
			);
			if (k.label) text(svg, k.x, k.y + k.r + 14, "pb-label", k.label);
		}

		if (m.id === "lamp") {
			// the beacon: a dark lens in its bezel until current reaches the output
			el("circle", { cx: "851", cy: "112", r: "38", class: "pb-bulb-glow" }, svg);
			el("circle", { cx: "851", cy: "112", r: "27", class: "pb-knob" }, svg);
			el("circle", { cx: "851", cy: "112", r: "19", class: "pb-bulb" }, svg);
			const led = el("circle", { cx: String(m.x + m.w - 18), cy: "40", r: "3.5", class: "pb-led" }, svg);
			text(svg, 851, 268, "pb-label pb-hp", brand);
			moduleLeds.set(m.id, led);
		} else {
			const led = el("circle", { cx: String(m.x + m.w - 18), cy: "40", r: "3.5", class: "pb-led" }, svg);
			moduleLeds.set(m.id, led);
		}
		if (m.id === "pulse") {
			el("circle", { cx: "283", cy: "172", r: "4", class: "pb-led lit--green pb-blink" }, svg);
		}
	}

	const cableLayer = el("g", { class: "pb-cables" }, svg);
	const jackLayer = el("g", { class: "pb-jacks" }, svg);
	const dragLayer = el("g", { class: "pb-drag", style: "pointer-events:none" }, svg);

	for (const m of MODULES) {
		for (const j of m.jacks) {
			const g = el("g", { transform: `translate(${j.x} ${j.y})`, class: "pb-jack" }, jackLayer);
			g.dataset.jack = j.id;
			g.dataset.dir = j.dir;
			g.setAttribute("role", "button");
			g.setAttribute("tabindex", "0");
			el("circle", { r: "15", class: "pb-halo" }, g);
			if (j.dir === "out") el("circle", { r: "13", class: "pb-out-ring" }, g);
			el("circle", { r: "10", class: "pb-nut" }, g);
			el("circle", { r: "4.5", class: "pb-hole" }, g);
			el("circle", { r: "17", class: "pb-hit" }, g);
			text(svg, j.x, j.y + 26, "pb-label", j.label);
			jackEls.set(j.id, g);
		}
	}

	const connections: Connection[] = [];
	let colorIdx = 0;
	let wasLit = false;

	const has = (from: string, to: string) => connections.some((c) => c.from === from && c.to === to);
	const atInput = (to: string) => connections.find((c) => c.to === to);

	const reachFrom = (start: string) => {
		const seen = new Set<string>([start]);
		const queue = [start];
		while (queue.length) {
			const cur = queue.pop();
			if (cur === undefined) break;
			for (const c of connections) {
				if (c.from === cur && !seen.has(c.to)) {
					seen.add(c.to);
					queue.push(c.to);
				}
			}
			const through = THROUGH[cur];
			if (through && !seen.has(through)) {
				seen.add(through);
				queue.push(through);
			}
		}
		return seen;
	};

	const computeState = (): PatchState => {
		const fromSource = reachFrom("source.out");
		const tone = fromSource.has("lamp.in");
		const inPath = (inJack: string, outJack: string) =>
			tone && fromSource.has(inJack) && reachFrom(outJack).has("lamp.in");
		const filtered = inPath("dimmer.in", "dimmer.out");
		const tinted = inPath("tint.in", "tint.out");
		return {
			tone,
			filtered,
			pulseDim: filtered && has("pulse.out", "dimmer.cv"),
			pulseTint: tinted && has("pulse.out", "tint.cv"),
			pulseTune: tone && has("pulse.out", "source.tune"),
		};
	};

	const drawConnection = (c: Connection, slack: number) => {
		const a = getJack(c.from);
		const b = getJack(c.to);
		const d = cablePath(a.x, a.y, b.x, b.y, slack);
		c.shadow.setAttribute("d", d);
		c.core.setAttribute("d", d);
		c.hit.setAttribute("d", d);
		c.plugA.setAttribute("cx", String(a.x));
		c.plugA.setAttribute("cy", String(a.y));
		c.plugB.setAttribute("cx", String(b.x));
		c.plugB.setAttribute("cy", String(b.y));
	};

	let looping = false;
	let visible = true;
	let lastFrame = 0;
	let frame = 0;

	const loopFrame = (t: number) => {
		if (!looping) return;
		if (t - lastFrame >= 33) {
			for (const c of connections) {
				const age = t - c.born;
				let slack = Math.sin(t / 950 + c.phase) * 2.2;
				if (age < 900) slack += 30 * Math.exp(-age / 200) * Math.cos(age / 65);
				drawConnection(c, slack);
			}
			lastFrame = t;
		}
		frame = requestAnimationFrame(loopFrame);
	};

	const ensureLoop = () => {
		if (reduce) {
			for (const c of connections) drawConnection(c, 0);
			return;
		}
		if (!looping && visible && connections.length) {
			looping = true;
			frame = requestAnimationFrame(loopFrame);
		}
		if (!connections.length) looping = false;
	};

	const refresh = () => {
		const used = new Set<string>();
		for (const c of connections) {
			used.add(getJack(c.from).module.toLowerCase());
			used.add(getJack(c.to).module.toLowerCase());
		}
		const state = computeState();
		for (const m of MODULES) {
			const led = moduleLeds.get(m.id);
			if (!led) continue;
			if (m.id === "lamp") led.classList.toggle("lit--green", state.tone);
			else led.classList.toggle("lit", used.has(m.id));
		}
		svg.classList.toggle("singing", state.tone);

		for (const [id, g] of jackEls) {
			const j = getJack(id);
			let suffix = "";
			if (j.dir === "in") {
				const c = atInput(id);
				if (c) suffix = `, patched from ${label(c.from)}`;
			} else {
				const outs = connections.filter((c) => c.from === id).map((c) => label(c.to));
				if (outs.length) suffix = `, feeding ${outs.join(" and ")}`;
			}
			g.setAttribute(
				"aria-label",
				`${j.module}, ${j.label.toLowerCase()}: ${j.dir === "out" ? "output" : "input"} jack${suffix}`,
			);
		}

		audio.update(state);

		if (state.tone && !wasLit) {
			setStatus(`Circuit complete: the beacon is lit.${audio.enabled ? " Listen to it hum." : ""}`);
		} else if (!state.tone && wasLit) {
			setStatus("The beacon went dark: current no longer reaches the output.");
		}
		wasLit = state.tone;
		ensureLoop();
	};

	const removeConnection = (c: Connection) => {
		c.group.remove();
		const i = connections.indexOf(c);
		if (i >= 0) connections.splice(i, 1);
	};

	const addConnection = (from: string, to: string, quiet = false) => {
		if (has(from, to)) return;
		const prev = atInput(to);
		if (prev) removeConnection(prev);

		const group = el("g", {}, cableLayer);
		const shadow = el("path", { class: "pb-cable-shadow" }, group);
		const core = el("path", { class: `pb-cable pb-cable--${"abc"[colorIdx % 3]}` }, group);
		const plugA = el("circle", { r: "6", class: "pb-plug" }, group);
		const plugB = el("circle", { r: "6", class: "pb-plug" }, group);
		const hit = el("path", { class: "pb-cable-hit" }, group);
		const title = document.createElementNS(NS, "title");
		title.textContent = `Cable: ${label(from)} → ${label(to)}. Click to unplug.`;
		hit.appendChild(title);
		colorIdx++;

		const c: Connection = {
			from,
			to,
			born: performance.now(),
			phase: Math.random() * Math.PI * 2,
			group,
			shadow,
			core,
			hit,
			plugA,
			plugB,
		};
		connections.push(c);
		drawConnection(c, 0);

		hit.addEventListener("pointerdown", (e) => {
			e.stopPropagation();
			removeConnection(c);
			setStatus(`Pulled the cable from ${label(to)}.`);
			refresh();
		});

		if (!quiet) setStatus(pairNote(from, to));
		refresh();
	};

	const vio = new IntersectionObserver(
		(entries) => {
			visible = entries[0]?.isIntersecting ?? true;
			if (!visible) looping = false;
			else ensureLoop();
		},
		{ threshold: 0 },
	);
	vio.observe(svg);

	const toSvg = (e: PointerEvent) => {
		const ctm = svg.getScreenCTM();
		if (!ctm) return { x: 0, y: 0 };
		const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
		return { x: pt.x, y: pt.y };
	};

	let dragFrom: JackDef | null = null;
	let dragPath: SVGPathElement | null = null;
	let dragPlug: SVGCircleElement | null = null;

	const beginDrag = (j: JackDef) => {
		dragFrom = j;
		svg.classList.add(j.dir === "out" ? "pb--from-out" : "pb--from-in");
		dragPath = el("path", { class: `pb-cable pb-cable--${"abc"[colorIdx % 3]}`, opacity: "0.9" }, dragLayer);
		dragPlug = el("circle", { r: "6", class: "pb-plug" }, dragLayer);
	};

	const endDrag = () => {
		dragFrom = null;
		dragPath?.remove();
		dragPlug?.remove();
		dragPath = null;
		dragPlug = null;
		svg.classList.remove("pb--from-out", "pb--from-in");
	};

	const tryConnect = (a: JackDef, b: JackDef) => {
		if (a.dir === b.dir) {
			setStatus(
				a.dir === "out"
					? "Two outputs can't talk to each other. Find a jack marked IN."
					: "Two inputs, no current. One end needs an OUT.",
			);
			return false;
		}
		const from = a.dir === "out" ? a : b;
		const to = a.dir === "out" ? b : a;
		addConnection(from.id, to.id);
		return true;
	};

	const jackFrom = (target: EventTarget | null) => {
		if (!(target instanceof Element)) return null;
		const g = target.closest<SVGGElement>("[data-jack]");
		const id = g?.dataset.jack;
		return id ? (JACKS.get(id) ?? null) : null;
	};

	const onPointerDown = (e: PointerEvent) => {
		const j = jackFrom(e.target);
		if (!j) return;
		e.preventDefault();

		const existing = j.dir === "in" ? atInput(j.id) : undefined;
		if (existing) {
			const from = getJack(existing.from);
			removeConnection(existing);
			refresh();
			beginDrag(from);
		} else {
			beginDrag(j);
		}

		const move = (ev: PointerEvent) => {
			if (!dragFrom || !dragPath || !dragPlug) return;
			const p = toSvg(ev);
			dragPath.setAttribute("d", cablePath(dragFrom.x, dragFrom.y, p.x, p.y));
			dragPlug.setAttribute("cx", String(p.x));
			dragPlug.setAttribute("cy", String(p.y));
		};
		const up = (ev: PointerEvent) => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", up);
			if (!dragFrom) return;
			const dropped = jackFrom(document.elementFromPoint(ev.clientX, ev.clientY));
			if (dropped && dropped.id !== dragFrom.id) tryConnect(dragFrom, dropped);
			else if (!dropped) setStatus("Cable dropped. They land soft.");
			endDrag();
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		window.addEventListener("pointercancel", up);
	};
	svg.addEventListener("pointerdown", onPointerDown);

	let pending: JackDef | null = null;
	const setPending = (j: JackDef | null) => {
		for (const g of jackEls.values()) g.classList.remove("pb-pending");
		svg.classList.remove("pb--from-out", "pb--from-in");
		pending = j;
		if (j) {
			jackEls.get(j.id)?.classList.add("pb-pending");
			svg.classList.add(j.dir === "out" ? "pb--from-out" : "pb--from-in");
		}
	};

	svg.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && pending) {
			setPending(null);
			setStatus("Cable dropped. They land soft.");
			return;
		}
		if (e.key !== "Enter" && e.key !== " ") return;
		const j = jackFrom(e.target);
		if (!j) return;
		e.preventDefault();

		if (!pending) {
			const existing = j.dir === "in" ? atInput(j.id) : undefined;
			if (existing) {
				removeConnection(existing);
				setStatus(`Pulled the cable from ${label(j.id)}.`);
				refresh();
				return;
			}
			setPending(j);
			setStatus(
				`Cable picked up at ${label(j.id)}. Tab to a${j.dir === "out" ? "n input" : "n output"} and press Enter; Esc drops it.`,
			);
			return;
		}
		if (pending.id === j.id) {
			setPending(null);
			setStatus("Cable dropped. They land soft.");
			return;
		}
		if (tryConnect(pending, j)) setPending(null);
	});

	const CLASSIC: Array<[string, string]> = [
		["source.out", "dimmer.in"],
		["dimmer.out", "tint.in"],
		["tint.out", "lamp.in"],
	];

	let presetTimers: number[] = [];
	const cancelPresetTimers = () => {
		for (const id of presetTimers) window.clearTimeout(id);
		presetTimers = [];
	};

	const patchClassic = () => {
		cancelPresetTimers();
		const missing = CLASSIC.filter(([f, t]) => !has(f, t));
		if (!missing.length) {
			setStatus("The classic circuit is already patched. Put the pulse somewhere — live a little.");
			return;
		}
		if (reduce) {
			for (const [f, t] of missing) addConnection(f, t, true);
			refresh();
			return;
		}
		missing.forEach(([f, t], i) => {
			presetTimers.push(window.setTimeout(() => addConnection(f, t, true), i * 190));
		});
	};

	const surprise = () => {
		cancelPresetTimers();
		const outs = [...JACKS.values()].filter((j) => j.dir === "out");
		const ins = [...JACKS.values()].filter((j) => j.dir === "in");
		const options: Array<[string, string]> = [];
		for (const o of outs) for (const i of ins) if (!has(o.id, i.id)) options.push([o.id, i.id]);
		const pick = options[Math.floor(Math.random() * options.length)];
		if (!pick) {
			setStatus("Every jack is spoken for. Impressive. Slightly alarming.");
			return;
		}
		addConnection(pick[0], pick[1], true);
		setStatus(`Random patch: ${pairNote(pick[0], pick[1])}`);
	};

	const clearAll = () => {
		cancelPresetTimers();
		while (connections[0]) removeConnection(connections[0]);
		setStatus("All cables pulled. The rack is dark again.");
		refresh();
	};

	const destroy = () => {
		cancelPresetTimers();
		looping = false;
		cancelAnimationFrame(frame);
		vio.disconnect();
		svg.remove();
	};

	refresh();
	return { patchClassic, surprise, clearAll, destroy };
}
