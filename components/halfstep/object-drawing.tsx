/**
 * The original's hand-plotted bike, redrawn as an everyday object: an insulated bottle in round-capped
 * strokes and flat fills. Paint is one CSS variable (`--paint`), the accent is the hi-viz lime.
 * Each assembly is a `data-part` group so the exploded view can fly it out; callouts name them.
 */

export type PartId = "loop" | "cap" | "seal" | "inner" | "shell" | "base";

export type PartCallout = {
	part: PartId;
	name: string;
	note: string;
	/** Text position (viewBox units) and anchor on the assembled object. */
	x: number;
	y: number;
	ax: number;
	ay: number;
	/** Where the leader line leaves the label. */
	lx: number;
	ly: number;
	end?: boolean;
};

export const PART_CALLOUTS: PartCallout[] = [
	{ part: "loop", name: "LOOP", note: "CARRIES ON A FINGER", x: 40, y: 76, lx: 250, ly: 92, ax: 466, ay: 96 },
	{ part: "cap", name: "CAP", note: "QUARTER TURN SHUT", x: 40, y: 196, lx: 230, ly: 212, ax: 442, ay: 146 },
	{
		part: "seal",
		name: "SEAL",
		note: "KEEPS THE BAG DRY",
		x: 40,
		y: 316,
		lx: 220,
		ly: 332,
		ax: 450,
		ay: 178,
	},
	{
		part: "inner",
		name: "INNER WALL",
		note: "KEEPS IT COLD",
		x: 40,
		y: 436,
		lx: 210,
		ly: 452,
		ax: 436,
		ay: 380,
	},
	{
		part: "shell",
		name: "SHELL",
		note: "TAKES THE KNOCKS",
		x: 920,
		y: 316,
		lx: 740,
		ly: 332,
		ax: 540,
		ay: 380,
		end: true,
	},
	{
		part: "base",
		name: "BASE",
		note: "STANDS ON ANYTHING",
		x: 920,
		y: 536,
		lx: 760,
		ly: 552,
		ax: 540,
		ay: 580,
		end: true,
	},
];

function Parts() {
	return (
		<>
			<g className="lp-part" data-part="inner">
				<rect x="434" y="196" width="92" height="356" rx="22" className="lp-glass" />
				<path d="M450 236 V512" className="lp-filament" />
			</g>
			<g className="lp-part" data-part="shell">
				<path d="M420 262 Q420 210 450 194 H510 Q540 210 540 262 V562 H420 Z" className="lp-shade" />
				<path d="M420 300 H540 M420 520 H540" className="lp-rim" />
			</g>
			<g className="lp-part" data-part="base">
				<rect x="414" y="556" width="132" height="40" rx="16" className="lp-socket" />
				<line x1="430" y1="576" x2="530" y2="576" className="lp-ring" />
			</g>
			<g className="lp-part" data-part="seal">
				<rect x="444" y="172" width="72" height="14" rx="6" className="lp-seal" />
			</g>
			<g className="lp-part" data-part="cap">
				<rect x="438" y="116" width="84" height="58" rx="12" className="lp-canopy" />
				<path d="M454 128 V162 M470 128 V162 M486 128 V162 M502 128 V162" className="lp-ring" />
			</g>
			<g className="lp-part" data-part="loop">
				<path d="M458 118 Q458 76 480 76 Q502 76 502 118" className="lp-cord" />
			</g>
		</>
	);
}

/** The assembled bottle on its shadow: the hero illustration. */
export function ObjectHero({ label }: { label: string }) {
	return (
		<svg viewBox="190 20 580 600" className="block h-auto w-full" role="img" aria-label={label}>
			<ellipse cx="480" cy="598" rx="250" ry="12" className="lp-pool lp-hero-beam" />
			<ellipse cx="480" cy="596" rx="96" ry="8" className="lp-shadow" />
			<line x1="200" y1="600" x2="760" y2="600" className="lp-ground" />
			<Parts />
		</svg>
	);
}

/** The service diagram: same bottle, every assembly labelled, ready to come apart. */
export function ObjectExploded({ titleId, title }: { titleId: string; title: string }) {
	return (
		<svg
			viewBox="0 0 960 640"
			className="block h-full max-h-[78vh] w-full max-sm:max-h-[64vh]"
			role="img"
			aria-labelledby={titleId}
		>
			<title id={titleId}>{title}</title>
			<g data-fade="">
				<ellipse cx="480" cy="598" rx="250" ry="12" className="lp-pool" />
			</g>
			<line x1="200" y1="600" x2="760" y2="600" className="lp-ground" />
			<Parts />
			{PART_CALLOUTS.map((c) => (
				<g key={c.part} className="lp-callout" data-for={c.part}>
					<line className="c-line" x1={c.lx} y1={c.ly} x2={c.ax} y2={c.ay} />
					<circle className="c-dot" cx={c.ax} cy={c.ay} r="4" />
					<text x={c.x} y={c.y} textAnchor={c.end ? "end" : undefined}>
						<tspan className="c-name" x={c.x} dy="0">
							{c.name}
						</tspan>
						<tspan x={c.x} dy="22">
							{c.note}
						</tspan>
					</text>
				</g>
			))}
		</svg>
	);
}
