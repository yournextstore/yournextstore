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
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="search the archive…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-56 rounded-full border border-border bg-background/60 pl-9 pr-4 font-editorial italic text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:bg-background transition-all"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 hover:bg-secondary rounded-full transition-colors sm:hidden"
				aria-label="Search"
			>
				<Search className="w-6 h-6" />
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
		<form onSubmit={handleSubmit} className="w-full">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
				<input
					type="search"
					name="q"
					placeholder="search the archive…"
					className="h-9 w-full rounded-full border border-border bg-background/60 pl-9 pr-4 font-editorial italic text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:bg-background transition-all"
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
					placeholder="search the archive…"
					defaultValue={initialQuery ?? ""}
					className="h-12 w-full rounded-full border border-border bg-background/60 pl-11 pr-4 font-editorial italic text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:bg-background transition-all"
				/>
			</div>
		</form>
	);
}
