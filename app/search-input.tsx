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
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the apothecary…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-44 rounded-full border border-border bg-card/60 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-1 focus:ring-offset-background transition-all focus:w-56"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 hover:bg-secondary rounded-full transition-colors lg:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5" />
			</YnsLink>
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
				<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				<input
					type="search"
					name="q"
					placeholder="Search the apothecary…"
					autoComplete="off"
					className="h-12 w-full rounded-full border border-border bg-background pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
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
				<Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/60" />
				<input
					type="search"
					name="q"
					defaultValue={initialQuery}
					placeholder="Search the apothecary…"
					autoComplete="off"
					enterKeyHint="search"
					className="h-14 w-full border-0 bg-transparent pl-8 pr-2 text-2xl font-medium tracking-tight text-foreground placeholder:text-foreground/40 focus:outline-none sm:text-3xl"
				/>
			</div>
		</form>
	);
}
