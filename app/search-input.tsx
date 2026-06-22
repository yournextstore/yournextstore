"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { YnsLink } from "@/components/yns-link";

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q");
		if (typeof query === "string" && query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<>
			<form onSubmit={handleSubmit} className="hidden lg:block">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--brand-ink)]/45" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the shelf…"
						defaultValue={searchParams.get("q") ?? ""}
						className="font-mono-ed h-9 w-48 border-b border-[var(--brand-ink)]/20 bg-transparent pl-8 pr-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-ink)] placeholder:text-[var(--brand-ink)]/35 focus:border-[var(--brand-ink)] focus:outline-none"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="rounded-full p-1.5 text-[var(--brand-ink)] transition-colors hover:bg-[var(--brand-ink)]/5 lg:hidden"
				aria-label="Search"
			>
				<Search className="h-4 w-4" strokeWidth={1.5} />
			</YnsLink>
		</>
	);
}

export function MobileSearchInput({ onNavigate }: { onNavigate: () => void }) {
	const router = useRouter();

	const handleSubmit = useCallback(
		(e: React.SubmitEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const query = formData.get("q");
			if (typeof query === "string" && query.trim()) {
				router.push(`/search?q=${encodeURIComponent(query.trim())}`);
				onNavigate();
			}
		},
		[onNavigate],
	);

	return (
		<form onSubmit={handleSubmit}>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-ink)]/45" />
				<input
					type="search"
					name="q"
					placeholder="Search the shelf…"
					className="font-mono-ed h-10 w-full border-b border-[var(--brand-ink)]/20 bg-transparent pl-9 pr-2 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-ink)] placeholder:text-[var(--brand-ink)]/35 focus:border-[var(--brand-ink)] focus:outline-none"
				/>
			</div>
		</form>
	);
}

export function SearchPageInput({ initialQuery }: { initialQuery: string }) {
	const router = useRouter();

	const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q");
		if (typeof query === "string") {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<form onSubmit={handleSubmit}>
			<div className="relative">
				<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-ink)]/45" />
				<input
					type="search"
					name="q"
					placeholder="Search the shelf…"
					defaultValue={initialQuery}
					className="font-mono-ed h-12 w-full border-b border-[var(--brand-ink)]/20 bg-transparent pl-12 pr-4 text-sm uppercase tracking-[0.18em] text-[var(--brand-ink)] placeholder:text-[var(--brand-ink)]/35 focus:border-[var(--brand-ink)] focus:outline-none"
				/>
			</div>
		</form>
	);
}
