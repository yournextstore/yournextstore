import Link from "next/link";
import type { Chip } from "@/lib/catalog";

/** GoCart's endless chip strip. Two identical halves slide by -50%; the copy is hidden from AT. */
export function CategoriesMarquee({ chips }: { chips: Chip[] }) {
	if (chips.length === 0) return null;
	const half = Array.from({ length: Math.ceil(12 / chips.length) }, () => chips).flat();

	const row = (copy: boolean) =>
		half.map((chip, index) => (
			<Link
				key={`${copy ? "b" : "a"}-${chip.href}-${index}`}
				href={chip.href}
				aria-hidden={copy || index >= chips.length ? true : undefined}
				tabIndex={copy || index >= chips.length ? -1 : undefined}
				className="shrink-0 whitespace-nowrap rounded-lg bg-slate-100 px-5 py-2 text-xs text-slate-600 transition-all duration-300 hover:bg-slate-600 hover:text-white active:scale-95 sm:text-sm"
			>
				{chip.label}
			</Link>
		));

	return (
		<nav
			aria-label="Browse"
			className="group relative mx-auto my-10 w-full max-w-7xl select-none overflow-hidden sm:my-20"
		>
			<div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-20 bg-linear-to-r from-white to-transparent" />
			<div className="flex w-max animate-go-marquee-fast group-hover:[animation-play-state:paused] sm:animate-go-marquee">
				<div className="flex gap-4 pr-4">{row(false)}</div>
				<div className="flex gap-4 pr-4">{row(true)}</div>
			</div>
			<div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-linear-to-l from-white to-transparent md:w-40" />
		</nav>
	);
}
