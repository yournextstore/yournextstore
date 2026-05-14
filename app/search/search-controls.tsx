"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { YnsLink } from "@/components/yns-link";
import { SORT_OPTIONS, type SortKey } from "./sort";

type Category = { id: string; slug: string; name: string };

function buildUrl(searchParams: URLSearchParams, overrides: Record<string, string | null>) {
	const params = new URLSearchParams(searchParams);
	for (const [key, value] of Object.entries(overrides)) {
		if (value === null) params.delete(key);
		else params.set(key, value);
	}
	params.delete("page");
	const qs = params.toString();
	return qs ? `/search?${qs}` : "/search";
}

function FilterRow({
	href,
	isActive,
	label,
	count,
	size = "sm",
	onClick,
}: {
	href: string;
	isActive: boolean;
	label: string;
	count?: number;
	size?: "sm" | "md";
	onClick?: () => void;
}) {
	const py = size === "md" ? "py-3 text-base" : "py-2.5 text-sm";
	const activeClass = isActive
		? size === "md"
			? "font-medium text-foreground"
			: "text-foreground"
		: "text-muted-foreground";
	return (
		<li>
			<YnsLink
				href={href}
				onClick={onClick}
				className={`flex items-baseline justify-between gap-2 border-b border-border ${py} transition-colors hover:text-foreground ${activeClass}`}
			>
				<span>
					{isActive ? "— " : ""}
					{label}
				</span>
				{typeof count === "number" ? <span className="text-xs tabular-nums">{count}</span> : null}
			</YnsLink>
		</li>
	);
}

export function ActiveFilters({
	categories,
	activeCategory,
}: {
	categories: Category[];
	activeCategory?: string;
}) {
	const searchParams = useSearchParams();
	const active = categories.find((c) => c.slug === activeCategory);
	if (!active) return null;

	return (
		<div className="flex items-center gap-2 text-sm">
			<span className="text-muted-foreground">in</span>
			<YnsLink
				href={buildUrl(searchParams, { category: null })}
				className="group inline-flex items-center gap-1.5 border-b border-foreground/70 pb-0.5 text-foreground transition-colors hover:border-foreground"
			>
				<span>{active.name}</span>
				<X className="h-3 w-3 opacity-60 group-hover:opacity-100" strokeWidth={1.5} />
			</YnsLink>
		</div>
	);
}

export function SortSelect({ value }: { value: SortKey }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	return (
		<label className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
			<span>Sort</span>
			<div className="relative">
				<select
					value={value}
					disabled={isPending}
					onChange={(e) => {
						const url = buildUrl(searchParams, { sort: e.target.value });
						startTransition(() => router.push(url));
					}}
					className="appearance-none border-0 border-b border-foreground/30 bg-transparent pr-5 pb-0.5 text-sm font-medium normal-case tracking-normal text-foreground focus:border-foreground focus:outline-none"
				>
					{SORT_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
				<span
					aria-hidden
					className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50"
				>
					↓
				</span>
			</div>
		</label>
	);
}

export function CategorySidebar({
	categories,
	activeCategory,
	totalCount,
}: {
	categories: Category[];
	activeCategory?: string;
	totalCount: number;
}) {
	const searchParams = useSearchParams();

	return (
		<nav aria-label="Filter by category">
			<h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Category</h2>
			<ul className="flex flex-col">
				<FilterRow
					href={buildUrl(searchParams, { category: null })}
					isActive={!activeCategory}
					label="All"
					count={totalCount}
				/>
				{categories.map((c) => (
					<FilterRow
						key={c.id}
						href={buildUrl(searchParams, { category: c.slug })}
						isActive={c.slug === activeCategory}
						label={c.name}
					/>
				))}
			</ul>
		</nav>
	);
}

export function MobileControls({
	categories,
	activeCategory,
	sort,
	totalCount,
}: {
	categories: Category[];
	activeCategory?: string;
	sort: SortKey;
	totalCount: number;
}) {
	const searchParams = useSearchParams();
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const active = categories.find((c) => c.slug === activeCategory);
	const activeSort = SORT_OPTIONS.find((s) => s.value === sort);

	return (
		<div className="sticky top-16 z-30 -mx-4 flex items-center justify-between border-y border-border bg-background/90 px-4 py-3 text-xs uppercase tracking-[0.18em] backdrop-blur-md sm:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						className="inline-flex items-center gap-2 text-foreground transition-opacity hover:opacity-70"
					>
						<SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
						<span>
							Filter{active ? ` · ${active.name}` : ""} / {activeSort?.label}
						</span>
					</button>
				</SheetTrigger>
				<SheetContent side="bottom" className="rounded-t-2xl p-6">
					<SheetTitle className="text-2xl font-medium tracking-tight">Refine</SheetTitle>

					<h3 className="mt-6 mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Sort</h3>
					<ul className="flex flex-col">
						{SORT_OPTIONS.map((opt) => (
							<FilterRow
								key={opt.value}
								href={buildUrl(searchParams, { sort: opt.value })}
								isActive={opt.value === sort}
								label={opt.label}
								size="md"
								onClick={close}
							/>
						))}
					</ul>

					<h3 className="mt-8 mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Category</h3>
					<ul className="flex flex-col">
						<FilterRow
							href={buildUrl(searchParams, { category: null })}
							isActive={!activeCategory}
							label="All"
							count={totalCount}
							size="md"
							onClick={close}
						/>
						{categories.map((c) => (
							<FilterRow
								key={c.id}
								href={buildUrl(searchParams, { category: c.slug })}
								isActive={c.slug === activeCategory}
								label={c.name}
								size="md"
								onClick={close}
							/>
						))}
					</ul>
				</SheetContent>
			</Sheet>
			<span className="tabular-nums text-foreground">{totalCount}</span>
		</div>
	);
}
