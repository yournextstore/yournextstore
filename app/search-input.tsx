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
			<form onSubmit={handleSubmit} className="hidden sm:block">
				<div className="group relative">
					<Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the collection"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-56 rounded-full border border-border bg-background/70 pl-10 pr-4 text-[12px] tracking-[0.04em] placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground/60 focus:bg-background transition-all"
					/>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-display italic text-muted-foreground/60"
					>
						⌘K
					</span>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 hover:bg-secondary/60 rounded-full transition-colors sm:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5" />
			</YnsLink>
		</>
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
		<form onSubmit={handleSubmit} className="relative">
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<input
				type="search"
				name="q"
				placeholder="Search the collection"
				className="h-10 w-full rounded-full border border-border bg-background/70 pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground/60 transition-all"
			/>
		</form>
	);
}

export function SearchPageInput({ initialQuery }: { initialQuery?: string }) {
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
		<form onSubmit={handleSubmit} className="relative">
			<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
			<input
				type="search"
				name="q"
				placeholder="Search the collection…"
				defaultValue={initialQuery ?? ""}
				className="h-12 w-full rounded-full border border-border bg-background/70 pl-12 pr-5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground/60 focus:bg-background transition-all"
			/>
		</form>
	);
}
