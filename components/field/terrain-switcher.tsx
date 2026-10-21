"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Scramble } from "./scramble";
import { setTerrain, TERRAINS, type Terrain, useTerrain } from "./terrain-store";

export type FieldPick = { name: string; slug: string; price: string | null };

const DATA: Record<
	Terrain,
	{ label: string; caption: string; image: string; alt: string; spec: [string, string][] }
> = {
	alpine: {
		label: "Cold",
		caption: "Cold — snow load and long nights",
		image: "/images/pexels/weather-snow-street.jpg",
		alt: "A four-season tent half buried in fresh snow at night, lit from inside, dark pines behind.",
		spec: [
			["Temp", "−4 °C / feels −9"],
			["Wind", "NW / 24 km/h"],
			["Daylight", "8 h / camp by four"],
			["Pack", "Four-season tent, −18 °C bag"],
		],
	},
	desert: {
		label: "Heat",
		caption: "Heat — dry ground and long shadows",
		image: "/images/pexels/weather-desert-road.jpg",
		alt: "A low tent pitched among red rocks on desert sand at sunset.",
		spec: [
			["Temp", "31 °C / dry"],
			["UV", "HIGH / shade by noon"],
			["Daylight", "14 h / long evening"],
			["Pack", "Light quilt, extra water"],
		],
	},
	coastal: {
		label: "Rain",
		caption: "Rain — taut fly, dry bags",
		image: "/images/pexels/weather-rain-city.jpg",
		alt: "A tent pitched on a wet coastal headland at dusk under grey storm cloud, waves below.",
		spec: [
			["Temp", "11 °C / damp"],
			["Rain", "8 mm / all afternoon"],
			["Daylight", "10 h / grey"],
			["Pack", "Tunnel tent, everything bagged"],
		],
	},
};

/** Line-art weather readouts in the original's diagram language: drawn strokes, one orange highlight, mono callouts. */
function WeatherDiagram({ terrain }: { terrain: Terrain }) {
	return (
		<svg
			className="tent-svg block h-auto w-full"
			viewBox="0 0 420 300"
			role="img"
			aria-labelledby="diagram-title"
			style={{
				background: "radial-gradient(120% 100% at 50% 20%, rgba(255,90,31,.05), transparent 60%)",
			}}
		>
			<title id="diagram-title">Weather diagram for the selected forecast</title>
			<g className="tent-config" data-active={terrain === "alpine"}>
				<path className="ground" pathLength={1} d="M24 244 H396" />
				<path className="member" pathLength={1} d="M210 62 V218 M142 101 L278 179 M142 179 L278 101" />
				<path
					className="member"
					pathLength={1}
					d="M196 76 L210 90 L224 76 M196 204 L210 190 L224 204 M156 92 L162 112 L142 118 M264 188 L258 168 L278 162 M156 188 L162 168 L142 162 M264 92 L258 112 L278 118"
				/>
				<path className="hl" pathLength={1} d="M300 70 V196 M292 196 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" />
				<path
					className="stake"
					pathLength={1}
					d="M60 230 l8 -8 M92 234 l8 -8 M340 232 l8 -8 M372 230 l8 -8"
				/>
				<text className="callout" x="40" y="58">
					SNOW · LIGHT
				</text>
				<text className="callout hl-txt" x="316" y="90">
					−4 °C
				</text>
				<text className="callout" x="40" y="276">
					LAYER UP
				</text>
				<text className="callout" x="300" y="276">
					WIND CHILL
				</text>
			</g>
			<g className="tent-config" data-active={terrain === "desert"}>
				<path className="ground" pathLength={1} d="M24 244 H396" />
				<path className="member" pathLength={1} d="M174 150 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0" />
				<path
					className="member"
					pathLength={1}
					d="M210 92 V74 M210 208 V226 M152 150 H134 M268 150 H286 M169 109 L156 96 M251 109 L264 96 M169 191 L156 204 M251 191 L264 204"
				/>
				<path className="hl" pathLength={1} d="M48 244 Q210 20 372 244" />
				<path className="stake" pathLength={1} d="M250 244 l60 -28 M282 244 l44 -20" />
				<text className="callout" x="40" y="58">
					CLEAR SKY
				</text>
				<text className="callout hl-txt" x="300" y="112">
					SUN PATH
				</text>
				<text className="callout" x="40" y="276">
					UV HIGH
				</text>
				<text className="callout" x="268" y="276">
					SHADE BY NOON
				</text>
			</g>
			<g className="tent-config" data-active={terrain === "coastal"}>
				<path className="ground" pathLength={1} d="M24 244 H396" />
				<path
					className="member"
					pathLength={1}
					d="M120 150 Q104 150 104 132 Q104 110 128 112 Q134 80 170 82 Q192 58 226 72 Q262 66 272 98 Q306 100 306 128 Q306 150 284 150 Z"
				/>
				<path
					className="hl"
					pathLength={1}
					d="M140 170 l-10 26 M176 170 l-10 26 M212 170 l-10 26 M248 170 l-10 26 M284 170 l-10 26 M158 206 l-8 20 M194 206 l-8 20 M230 206 l-8 20 M266 206 l-8 20"
				/>
				<path className="stake" pathLength={1} d="M150 244 q30 -8 60 0 q30 8 60 0" />
				<path className="wind" pathLength={1} d="M18 150 h64 m-14 -8 l14 8 -14 8" />
				<text className="callout" x="24" y="138">
					WIND
				</text>
				<text className="callout" x="320" y="96">
					LOW CLOUD
				</text>
				<text className="callout hl-txt" x="210" y="278" textAnchor="middle">
					RAIN · 8 MM · ALL AFTERNOON
				</text>
			</g>
		</svg>
	);
}

export function TerrainSwitcher({ picks }: { picks: Record<Terrain, FieldPick | null> }) {
	const terrain = useTerrain();
	const tabs = useRef<(HTMLButtonElement | null)[]>([]);
	const index = TERRAINS.indexOf(terrain);
	const d = DATA[terrain];
	const pick = picks[terrain];

	const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		const i = index;
		const next =
			e.key === "ArrowRight" || e.key === "ArrowDown"
				? (i + 1) % TERRAINS.length
				: e.key === "ArrowLeft" || e.key === "ArrowUp"
					? (i - 1 + TERRAINS.length) % TERRAINS.length
					: e.key === "Home"
						? 0
						: e.key === "End"
							? TERRAINS.length - 1
							: null;
		if (next === null) return;
		e.preventDefault();
		const t = TERRAINS[next];
		if (!t) return;
		setTerrain(t);
		tabs.current[next]?.focus();
	};

	return (
		<>
			<div className="frame mb-10 flex">
				<div
					role="tablist"
					aria-label="Choose the weather"
					className="relative grid grid-cols-[repeat(3,minmax(96px,1fr))] rounded-[3px] border border-line bg-panel-2 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.03)]"
				>
					<span
						aria-hidden="true"
						className="absolute top-1 bottom-1 left-1 z-0 w-[calc((100%-8px)/3)] rounded-[2px] bg-signal shadow-[0_4px_16px_-6px_rgba(255,90,31,.8)] transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
						style={{ transform: `translateX(${index * 100}%)` }}
					/>
					{TERRAINS.map((t, i) => (
						<button
							key={t}
							ref={(el) => {
								tabs.current[i] = el;
							}}
							type="button"
							role="tab"
							id={`tab-${t}`}
							aria-selected={terrain === t}
							aria-controls="terrain-panel"
							tabIndex={terrain === t ? 0 : -1}
							onClick={() => setTerrain(t)}
							onKeyDown={onKeyDown}
							className={cn(
								"font-field relative z-[1] cursor-pointer px-3.5 py-[11px] text-[0.82rem] font-bold tracking-[0.08em] uppercase transition-colors",
								terrain === t ? "text-page" : "text-dim hover:text-ink",
							)}
						>
							{DATA[t].label}
						</button>
					))}
				</div>
			</div>

			<div
				id="terrain-panel"
				role="tabpanel"
				aria-labelledby={`tab-${terrain}`}
				className="frame grid items-start gap-[clamp(18px,3vw,34px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
			>
				<div className="relative aspect-video w-full overflow-hidden rounded-[2px] border border-line bg-panel">
					{TERRAINS.map((t) => (
						<Image
							key={t}
							src={DATA[t].image}
							alt={t === terrain ? DATA[t].alt : ""}
							aria-hidden={t !== terrain}
							fill
							sizes="(max-width: 1024px) 100vw, 640px"
							className={cn(
								"object-cover saturate-[.9] transition-opacity duration-500",
								t === terrain ? "opacity-100" : "opacity-0",
							)}
						/>
					))}
					<span
						aria-hidden="true"
						className="hatch absolute bottom-0 left-0 z-[2] h-[7px] w-[88px] opacity-40"
					/>
				</div>

				<div className="flex flex-col gap-[18px] rounded-[2px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,.018),transparent)] p-[clamp(16px,2.4vw,26px)]">
					<figure className="m-0">
						<WeatherDiagram terrain={terrain} />
						<figcaption className="font-field mt-3 flex gap-2 text-[0.72rem] tracking-[0.06em] text-dim uppercase">
							<span className="text-signal">FIG.</span>
							<span>{d.caption}</span>
						</figcaption>
					</figure>
					<dl className="flex flex-col">
						{d.spec.map(([label, value], i) => (
							<div
								key={label}
								className={cn(
									"flex items-baseline justify-between gap-4 py-[11px]",
									i > 0 && "border-t border-line",
								)}
							>
								<dt className="font-field text-[0.74rem] tracking-[0.1em] text-faint uppercase">{label}</dt>
								<dd className="font-field text-right text-[0.86rem] font-bold text-ink">
									<Scramble text={value} duration={500} />
								</dd>
							</div>
						))}
						{pick && (
							<div className="flex items-baseline justify-between gap-4 border-t border-line py-[11px]">
								<dt className="font-field text-[0.74rem] tracking-[0.1em] text-faint uppercase">
									Today's pick
								</dt>
								<dd className="font-field min-w-0 text-right text-[0.86rem] font-bold">
									<Link
										href={`/product/${pick.slug}`}
										className="text-signal underline decoration-line underline-offset-4 hover:decoration-signal"
									>
										{pick.name}
										{pick.price ? ` · ${pick.price}` : ""}
									</Link>
								</dd>
							</div>
						)}
					</dl>
				</div>
			</div>
		</>
	);
}
