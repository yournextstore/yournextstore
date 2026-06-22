"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

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
		<form onSubmit={handleSubmit} className="w-full">
			<div className="relative">
				<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					ref={inputRef}
					type="search"
					name="q"
					placeholder="Search medicines, vitamins, healthcare…"
					defaultValue={searchParams.get("q") ?? ""}
					className="h-10 w-full rounded-full border border-border/80 bg-secondary/40 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-[color:var(--mint)] focus:bg-background focus:outline-none focus:ring-2 focus:ring-[color:var(--mint)]/30 transition-all"
				/>
			</div>
		</form>
	);
}

export function SearchPageInput({ initialQuery }: { initialQuery?: string }) {
	const router = useRouter();

	const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q");
		if (typeof query === "string" && query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="relative">
				<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="search"
					name="q"
					placeholder="Search medicines, vitamins, healthcare…"
					defaultValue={initialQuery ?? ""}
					className="h-12 w-full rounded-full border border-border/80 bg-secondary/40 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-[color:var(--mint)] focus:bg-background focus:outline-none focus:ring-2 focus:ring-[color:var(--mint)]/30 transition-all"
				/>
			</div>
		</form>
	);
}

export function MobileSearchInput({ onNavigate }: { onNavigate?: () => void }) {
	const router = useRouter();

	const handleSubmit = useCallback(
		(e: React.SubmitEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const query = formData.get("q");
			if (typeof query === "string" && query.trim()) {
				router.push(`/search?q=${encodeURIComponent(query.trim())}`);
				onNavigate?.();
			}
		},
		[onNavigate],
	);

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="relative">
				<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="search"
					name="q"
					placeholder="Search…"
					className="h-10 w-full rounded-full border border-border/80 bg-secondary/40 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-[color:var(--mint)] focus:bg-background focus:outline-none focus:ring-2 focus:ring-[color:var(--mint)]/30 transition-all"
				/>
			</div>
		</form>
	);
}
