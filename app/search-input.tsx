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
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-clay" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-40 rounded-sm border border-border bg-transparent pl-9 pr-3 text-xs tracking-wide text-ink placeholder:text-clay focus:outline-none focus:border-terracotta transition-colors"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 text-ink hover:text-terracotta transition-colors lg:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5" strokeWidth={1.6} />
			</YnsLink>
		</>
	);
}

export function MobileSearchInput({ onNavigate }: { onNavigate: () => void }) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
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
		<form onSubmit={handleSubmit} role="search">
			<div className="relative">
				<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-clay" strokeWidth={1.6} />
				<input
					ref={inputRef}
					type="search"
					name="q"
					placeholder="Search products…"
					enterKeyHint="search"
					autoComplete="off"
					className="h-12 w-full rounded-sm border border-border bg-transparent pl-12 pr-4 text-base text-ink placeholder:text-clay focus:outline-none focus:border-terracotta transition-colors"
				/>
			</div>
		</form>
	);
}

export function SearchPageInput({ initialQuery }: { initialQuery: string }) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q");
		if (typeof query === "string" && query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<form onSubmit={handleSubmit} role="search">
			<label htmlFor="search-page-input" className="sr-only">
				Search products
			</label>
			<div className="relative border-b border-ink/30 transition-colors focus-within:border-terracotta">
				<Search
					className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-clay"
					strokeWidth={1.5}
				/>
				<input
					ref={inputRef}
					id="search-page-input"
					type="search"
					name="q"
					placeholder="Search the store…"
					defaultValue={initialQuery}
					enterKeyHint="search"
					autoComplete="off"
					className="h-14 w-full border-0 bg-transparent pl-8 pr-2 text-2xl font-medium tracking-tight text-ink placeholder:font-medium placeholder:text-clay focus:outline-none sm:text-3xl"
				/>
			</div>
		</form>
	);
}
