// Plain module (no "use client"): the layout's inline script and the server components read these too.

export const PAPER_MODES = [
	{ value: "blank", label: "Blank" },
	{ value: "dot", label: "Dot grid" },
	{ value: "ruled", label: "Ruled" },
	{ value: "graph", label: "Graph" },
] as const;

export type PaperMode = (typeof PAPER_MODES)[number]["value"];

export const DEFAULT_PAPER: PaperMode = "dot";
export const PAPER_STORAGE_KEY = "paper";
export const PAPER_EVENT = "paperchange";

export const isPaperMode = (value: unknown): value is PaperMode =>
	PAPER_MODES.some((mode) => mode.value === value);

export const PAPER_NOTES: Record<PaperMode, { head: string; body: string; spec: string }> = {
	blank: {
		head: "Blank.",
		body: "No guidance at all, on purpose. For ideas that arrive sideways and refuse to sit on a line.",
		spec: "plain sheet · nothing printed · takes pencil like a wall takes chalk",
	},
	dot: {
		head: "Dot grid.",
		body: "The quietest possible suggestion of order. Lines when you squint, freedom when you don’t.",
		spec: "our house ruling · a dot every 22 px · printed at a whisper",
	},
	ruled: {
		head: "Ruled.",
		body: "With a proper red margin, because a page should keep its accounts. Wide enough for a real hand.",
		spec: "feint lines · margin in red · the ledger standard",
	},
	graph: {
		head: "Graph.",
		body: "For people whose ideas have dimensions. Light enough to disappear under a soft pencil.",
		spec: "engineer’s grid · no heavy fifth line, you’re welcome",
	},
};

/**
 * Runs before first paint: marks the page as scripted (reveals) and restores the saved ruling, so a
 * returning visitor never sees the default sheet flash first.
 */
export const PAPER_BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{var p=localStorage.getItem("${PAPER_STORAGE_KEY}");if(p==="blank"||p==="dot"||p==="ruled"||p==="graph")d.dataset.paper=p;}catch(e){}})();`;
