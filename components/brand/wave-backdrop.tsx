import type { ReactNode } from "react";

type WaveOptions = { base: number; amplitude: number; periods: number; phase?: number };

const WIDTH = 2880;
const HEIGHT = 320;

/** A filled wave that runs edge to edge and closes along the bottom; whole periods so it tiles. */
function wavePath({ base, amplitude, periods, phase = 0 }: WaveOptions) {
	const y = (x: number) =>
		(base + Math.sin((x / WIDTH) * periods * Math.PI * 2 + phase) * amplitude).toFixed(1);
	const xs = Array.from({ length: WIDTH / 12 + 1 }, (_, i) => Math.min(i * 12, WIDTH));
	return [
		`M0 ${y(0)}`,
		...xs.slice(1).map((x) => `L${x} ${y(x)}`),
		`L${WIDTH} ${HEIGHT}`,
		`L0 ${HEIGHT}`,
		"Z",
	].join(" ");
}

/* Tonal browns: the outer wave is the page colour, so the band melts into what sits around it. */
const brown = (percent: number) => `color-mix(in oklab, var(--woody) ${percent}%, var(--page))`;

type Layer = { d: string; fill: string; seconds: number; reverse: boolean };
const layer = (o: WaveOptions, fill: string, seconds: number, reverse: boolean): Layer => ({
	d: wavePath(o),
	fill,
	seconds,
	reverse,
});

const BOTTOM: Layer[] = [
	layer({ base: 150, amplitude: 42, periods: 4 }, brown(36), 58, false),
	layer({ base: 184, amplitude: 36, periods: 6, phase: 1.1 }, brown(26), 46, true),
	layer({ base: 218, amplitude: 30, periods: 8, phase: 2.2 }, brown(15), 36, false),
	layer({ base: 252, amplitude: 24, periods: 6, phase: 3.3 }, "var(--page)", 28, true),
];
const TOP: Layer[] = [
	layer({ base: 160, amplitude: 36, periods: 6, phase: 0.6 }, brown(36), 62, true),
	layer({ base: 192, amplitude: 30, periods: 8, phase: 1.7 }, brown(26), 50, false),
	layer({ base: 222, amplitude: 26, periods: 6, phase: 2.8 }, brown(15), 40, true),
	layer({ base: 252, amplitude: 20, periods: 8, phase: 4.0 }, "var(--page)", 32, false),
];
const SKY = `linear-gradient(180deg, ${brown(44)} 0%, ${brown(46)} 50%, ${brown(40)} 100%)`;

function Edge({ layers, className }: { layers: Layer[]; className: string }): ReactNode {
	return (
		<div className={`absolute inset-x-0 overflow-hidden ${className}`}>
			{layers.map((l) => (
				<svg
					key={l.d.slice(0, 24) + l.seconds}
					aria-hidden="true"
					viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
					preserveAspectRatio="none"
					className="animate-wave-drift absolute bottom-0 left-0 h-full w-[200%]"
					style={{ animationDuration: `${l.seconds}s`, animationDirection: l.reverse ? "reverse" : "normal" }}
				>
					<path d={l.d} fill={l.fill} />
				</svg>
			))}
		</div>
	);
}

/** Layered waving band in tonal browns, waves on both edges. Closing banners only. */
export function WaveBackdrop() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 overflow-hidden"
			style={{ background: SKY }}
		>
			<Edge layers={TOP} className="-top-px h-[calc(22%+1px)] rotate-180" />
			<Edge layers={BOTTOM} className="-bottom-px h-[calc(34%+1px)]" />
		</div>
	);
}
