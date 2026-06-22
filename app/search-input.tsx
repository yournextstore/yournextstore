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
			<YnsLink
				href="/search"
				className="p-2.5 hover:bg-[color:var(--yns-ink)]/5 rounded-full transition-colors text-[color:var(--yns-ink)]"
				aria-label="Search"
			>
				<Search className="w-5 h-5" strokeWidth={1.5} />
			</YnsLink>
			<form onSubmit={handleSubmit} className="hidden">
				<input ref={inputRef} type="search" name="q" defaultValue={searchParams.get("q") ?? ""} />
			</form>
		</>
	);
}

export function MobileSearchInput({ onNavigate }: { onNavigate: () => void }) {
	const router = useRouter();

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
			<label className="sr-only">Search products</label>
			<div className="relative">
				<Search
					className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
					strokeWidth={1.5}
				/>
				<input
					type="search"
					name="q"
					placeholder="Search products"
					autoComplete="off"
					className="h-12 w-full rounded-full border border-border bg-background pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
				/>
			</div>
		</form>
	);
}

export function SearchPageInput({ initialQuery }: { initialQuery: string }) {
	const router = useRouter();

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
			<label className="sr-only">Search products</label>
			<div className="relative border-b border-foreground/30 transition-colors focus-within:border-foreground">
				<Search
					className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/60"
					strokeWidth={1.5}
				/>
				<input
					type="search"
					name="q"
					defaultValue={initialQuery}
					placeholder="Search the store"
					autoComplete="off"
					enterKeyHint="search"
					className="h-14 w-full border-0 bg-transparent pl-8 pr-2 text-2xl font-medium tracking-tight text-foreground placeholder:font-medium placeholder:text-foreground/40 focus:outline-none sm:text-3xl"
				/>
			</div>
		</form>
	);
}
