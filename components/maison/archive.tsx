"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import type { Piece } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { PieceCard, PieceRow } from "./piece-card";

const SORTS = [
	{ value: "archive", label: "Archive selection" },
	{ value: "asc", label: "Valuation, ascending" },
	{ value: "desc", label: "Valuation, descending" },
	{ value: "name", label: "Name, A to Z" },
] as const;
type Sort = (typeof SORTS)[number]["value"];

const FLAGS = [
	{ value: "stock", label: "In stock", test: (piece: Piece) => piece.stock !== "out" },
	{ value: "sale", label: "Reduced", test: (piece: Piece) => piece.compareLabel !== null },
	{ value: "last", label: "Last pieces", test: (piece: Piece) => piece.stock === "low" },
] as const;

const PAGE = 24;

type Group = { key: string; title: string; values: { value: string; count: number }[] };

function capitalise(value: string) {
	return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

function valuesOf(piece: Piece, key: string): string[] {
	if (key === "dept") return piece.category ? [piece.category.name] : [];
	if (key === "flag") return FLAGS.filter((flag) => flag.test(piece)).map((flag) => flag.value);
	return piece.options.find((group) => `opt:${group.label}` === key)?.values ?? [];
}

function countBy(pieces: Piece[], key: string) {
	const counts = new Map<string, number>();
	for (const piece of pieces) {
		for (const value of valuesOf(piece, key)) counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	return counts;
}

function buildGroups(pieces: Piece[], showDepartments: boolean): Group[] {
	const departments = countBy(pieces, "dept");
	const optionLabels = [...new Set(pieces.flatMap((piece) => piece.options.map((group) => group.label)))];
	const optionGroups = optionLabels.flatMap((label) => {
		const counts = countBy(pieces, `opt:${label}`);
		return counts.size > 1
			? [
					{
						key: `opt:${label}`,
						title: capitalise(label),
						values: [...counts].map(([value, count]) => ({ value, count })),
					},
				]
			: [];
	});
	const flags = countBy(pieces, "flag");
	return [
		...(showDepartments && departments.size > 1
			? [
					{
						key: "dept",
						title: "Department",
						values: [...departments].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count })),
					},
				]
			: []),
		...optionGroups,
		{
			key: "flag",
			title: "Availability",
			values: FLAGS.filter((flag) => flags.has(flag.value)).map((flag) => ({
				value: flag.value,
				count: flags.get(flag.value) ?? 0,
			})),
		},
	].filter((group) => group.values.length > 0);
}

function labelFor(key: string, value: string) {
	if (key === "flag") return FLAGS.find((flag) => flag.value === value)?.label ?? value;
	return capitalise(value);
}

/**
 * The archive: a printed facet rail (valuation, department, options, availability) with live
 * counts, archive sort, grid/list views and filter chips. Everything filters in the browser
 * over records rendered on the server, so the first paint is the full prerendered grid.
 */
export function Archive({
	pieces,
	showDepartments = true,
	priorityFirst = false,
}: {
	pieces: Piece[];
	showDepartments?: boolean;
	priorityFirst?: boolean;
}) {
	const { currency, locale } = useStoreConfig();
	const fractionDigits = new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions()
		.maximumFractionDigits;
	const unit = 10 ** (fractionDigits ?? 2);
	const money = (major: number) =>
		new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(major);
	const sign = money(0)
		.replace(/[\d\s., ]/g, "")
		.trim();

	const topMajor = Math.ceil(Math.max(0, ...pieces.map((piece) => piece.price)) / unit);
	const step = Math.max(1, Math.round(topMajor / 60));
	const ceiling = Math.max(step, Math.ceil(topMajor / step) * step);

	const groups = buildGroups(pieces, showDepartments);
	const [picked, setPicked] = useState<Record<string, string[]>>({});
	const [open, setOpen] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(groups.map((group, index) => [group.key, index < 2])),
	);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState<number | null>(null);
	const [sort, setSort] = useState<Sort>("archive");
	const [view, setView] = useState<"grid" | "list">("grid");
	const [limit, setLimit] = useState(PAGE);
	const [railOpen, setRailOpen] = useState(false);

	const hi = max ?? ceiling;

	useEffect(() => {
		if (!railOpen) return;
		const onKey = (event: KeyboardEvent) => event.key === "Escape" && setRailOpen(false);
		document.addEventListener("keydown", onKey);
		const previous = document.body.style.overflow;
		if (window.innerWidth < 1024) document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = previous;
		};
	}, [railOpen]);

	const matches = (piece: Piece) => {
		const major = piece.price / unit;
		if (major < min || major > hi) return false;
		return Object.entries(picked).every(([key, values]) => {
			if (values.length === 0) return true;
			const own = valuesOf(piece, key);
			// Availability flags narrow (all must hold); other facets widen within a group.
			return key === "flag"
				? values.every((value) => own.includes(value))
				: values.some((value) => own.includes(value));
		});
	};

	const filtered = pieces.filter(matches);
	const sorted =
		sort === "asc"
			? [...filtered].sort((a, b) => a.price - b.price)
			: sort === "desc"
				? [...filtered].sort((a, b) => b.price - a.price)
				: sort === "name"
					? [...filtered].sort((a, b) => a.name.localeCompare(b.name, locale))
					: // The curated default: newest first, pieces still waiting for a photograph last.
						[...filtered].sort(
							(a, b) => Number(a.image === null) - Number(b.image === null) || b.createdAt - a.createdAt,
						);
	const shown = sorted.slice(0, limit);

	const toggle = (key: string, value: string) => {
		setPicked((current) => {
			const values = current[key] ?? [];
			return {
				...current,
				[key]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
			};
		});
		setLimit(PAGE);
	};

	const clearAll = () => {
		setPicked({});
		setMin(0);
		setMax(null);
		setLimit(PAGE);
	};

	const chips = [
		...Object.entries(picked).flatMap(([key, values]) =>
			values.map((value) => ({
				id: `${key}:${value}`,
				label: labelFor(key, value),
				undo: () => toggle(key, value),
			})),
		),
		...(min > 0 || max !== null
			? [
					{
						id: "price",
						label: `${money(min)} — ${money(hi)}`,
						undo: () => {
							setMin(0);
							setMax(null);
						},
					},
				]
			: []),
	];

	const parseMajor = (raw: string) => Number(raw.replace(/\D/g, ""));

	return (
		<div id="archive" className="flex scroll-mt-24 flex-wrap items-start gap-x-[52px] gap-y-9 pt-8">
			<button
				type="button"
				tabIndex={-1}
				aria-hidden
				onClick={() => setRailOpen(false)}
				className={cn("fixed inset-0 z-[65] bg-[oklch(0.22_0.006_0/0.42)] lg:hidden", !railOpen && "hidden")}
			/>
			<aside
				aria-label="Filters"
				className={cn(
					"scrollbar-thin fixed inset-y-0 left-0 z-[70] flex w-[300px] max-w-[86vw] flex-col gap-7 overflow-y-auto border-r border-line bg-card p-5 transition-[translate,visibility] duration-300",
					"lg:visible lg:sticky lg:top-[86px] lg:z-auto lg:max-h-[calc(100vh-102px)] lg:w-auto lg:min-w-0 lg:max-w-[260px] lg:flex-[1_1_220px] lg:translate-x-0 lg:self-start lg:border-r-0 lg:bg-transparent lg:p-0 lg:pb-2 lg:pr-1",
					railOpen ? "visible translate-x-0" : "invisible -translate-x-full",
				)}
			>
				<button
					type="button"
					onClick={() => setRailOpen(false)}
					className="eti -mb-2 flex min-h-6 cursor-pointer items-center gap-1.5 self-end text-soft transition hover:text-acc lg:hidden"
				>
					Close <X aria-hidden className="size-3.5" strokeWidth={1.5} />
				</button>
				{ceiling > 0 ? (
					<div className="flex flex-col gap-3">
						<div className="eti text-dim">Valuation{sign ? `, ${sign}` : ""}</div>
						<input
							type="range"
							aria-label="Valuation ceiling"
							min={0}
							max={ceiling}
							step={step}
							value={hi}
							onChange={(event) => {
								setMax(Number(event.target.value));
								setLimit(PAGE);
							}}
							className="w-full"
						/>
						<div className="flex items-center gap-2 font-mono text-[12px] text-soft">
							<input
								inputMode="numeric"
								aria-label="Lowest valuation"
								key={`min-${min}`}
								defaultValue={String(min)}
								onBlur={(event) => setMin(Math.min(parseMajor(event.target.value) || 0, hi))}
								onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
								className="w-full min-w-0 rounded-[2px] border border-rule bg-transparent px-[7px] py-[5px] font-mono text-[12px] text-ink outline-none focus:border-faint"
							/>
							<span aria-hidden className="text-faint">
								—
							</span>
							<input
								inputMode="numeric"
								aria-label="Highest valuation"
								key={`max-${hi}`}
								defaultValue={String(hi)}
								onBlur={(event) => {
									const value = parseMajor(event.target.value);
									setMax(value ? Math.max(value, min) : null);
								}}
								onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
								className="w-full min-w-0 rounded-[2px] border border-rule bg-transparent px-[7px] py-[5px] font-mono text-[12px] text-ink outline-none focus:border-faint"
							/>
						</div>
					</div>
				) : null}
				<div className="flex flex-col gap-7">
					{groups.map((group) => {
						const isOpen = open[group.key] ?? false;
						const selected = picked[group.key] ?? [];
						return (
							<div key={group.key} className="flex flex-col gap-[11px]">
								<button
									type="button"
									aria-expanded={isOpen}
									onClick={() => setOpen((current) => ({ ...current, [group.key]: !isOpen }))}
									className="eti flex min-h-6 cursor-pointer items-baseline gap-2.5 text-left text-dim"
								>
									<span className="flex-1">{group.title}</span>
									<span aria-hidden className="text-acc">
										{isOpen ? "–" : "+"}
									</span>
								</button>
								{isOpen ? (
									<ul className="flex flex-col gap-[3px]">
										{group.values.map(({ value, count }) => {
											const on = selected.includes(value);
											return (
												<li key={value}>
													<button
														type="button"
														aria-pressed={on}
														onClick={() => toggle(group.key, value)}
														className="flex min-h-7 w-full cursor-pointer items-baseline gap-2.5 py-0.5 text-left text-[13.5px] text-ink transition hover:text-acc"
													>
														<span
															aria-hidden
															className={cn(
																"font-mono text-[11px]",
																on ? "text-acc" : "text-[oklch(0.78_0.006_0)]",
															)}
														>
															{on ? "✕" : "·"}
														</span>
														<span className="flex-1 leading-[1.4]">{labelFor(group.key, value)}</span>
														<span className="font-mono text-[11px] text-faint">{count}</span>
													</button>
												</li>
											);
										})}
									</ul>
								) : null}
							</div>
						);
					})}
				</div>
			</aside>

			<section aria-label="Pieces" className="flex min-w-0 flex-[999_1_520px] flex-col gap-6">
				<div className="flex flex-wrap items-center gap-x-[18px] gap-y-3 border-b border-line pb-3.5">
					<button
						type="button"
						onClick={() => setRailOpen(true)}
						className="eti flex min-h-8 cursor-pointer items-center gap-2 rounded-[2px] border border-rule px-2.5 py-[7px] text-[11px] text-soft transition hover:border-faint lg:hidden"
					>
						<SlidersHorizontal aria-hidden className="size-[13px]" strokeWidth={1.6} />
						Filters
					</button>
					<span className="eti text-[11px] text-dim" aria-live="polite">
						{filtered.length} of {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
					</span>
					<span className="flex-1" />
					<select
						aria-label="Sort the archive"
						value={sort}
						onChange={(event) => {
							const next = SORTS.find((option) => option.value === event.target.value);
							if (next) setSort(next.value);
						}}
						className="min-h-8 cursor-pointer rounded-[2px] border border-rule bg-transparent px-2.5 py-1.5 text-[13px] text-ink outline-none"
					>
						{SORTS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<div className="eti flex gap-3.5 text-[11px]">
						{(["grid", "list"] as const).map((mode) => (
							<button
								key={mode}
								type="button"
								aria-pressed={view === mode}
								onClick={() => setView(mode)}
								className={cn(
									"min-h-6 cursor-pointer text-soft transition hover:text-acc",
									view === mode && "border-b border-acc pb-[3px] text-acc",
								)}
							>
								{mode === "grid" ? "Grid" : "List"}
							</button>
						))}
					</div>
				</div>

				{chips.length > 0 ? (
					<div className="flex flex-wrap items-center gap-2">
						{chips.map((chip) => (
							<button
								key={chip.id}
								type="button"
								onClick={chip.undo}
								aria-label={`${chip.label}, remove filter`}
								className="flex cursor-pointer items-center gap-2 rounded-[2px] border border-[oklch(0.86_0.02_25)] px-[9px] py-[5px] text-[12.5px] text-[oklch(0.4_0.06_25)] transition hover:bg-accent"
							>
								<span>{chip.label}</span>
								<span aria-hidden className="font-mono text-[11px]">
									✕
								</span>
							</button>
						))}
						<button
							type="button"
							onClick={clearAll}
							className="eti ml-1.5 min-h-6 cursor-pointer text-[11px] text-faint hover:text-acc"
						>
							Clear all
						</button>
					</div>
				) : null}

				{shown.length === 0 ? (
					<div className="py-[72px] text-center text-dim">
						<p className="font-sf mb-3 text-[22px]">No matches in the archive</p>
						<button type="button" onClick={clearAll} className="link-rule text-acc">
							Clear filters
						</button>
					</div>
				) : view === "grid" ? (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-x-[30px] gap-y-10">
						{shown.map((piece, index) => (
							<PieceCard key={piece.id} piece={piece} priority={priorityFirst && index === 0} />
						))}
					</div>
				) : (
					<div className="flex flex-col">
						{shown.map((piece) => (
							<PieceRow key={piece.id} piece={piece} />
						))}
					</div>
				)}

				{sorted.length > shown.length ? (
					<div className="flex justify-center pt-4">
						<button
							type="button"
							onClick={() => setLimit((current) => current + PAGE)}
							className="btn-keeper px-6 py-3"
						>
							Show more pieces · {sorted.length - shown.length} remaining
						</button>
					</div>
				) : null}
			</section>
		</div>
	);
}
