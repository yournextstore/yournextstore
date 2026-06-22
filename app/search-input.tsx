"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { YnsLink } from "@/components/yns-link";

export function MobileSearchInput({ onNavigate }: { onNavigate?: () => void }) {
	const router = useRouter();
	const searchParams = useSearchParams();

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
				<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="search"
					name="q"
					placeholder="Search"
					defaultValue={searchParams.get("q") ?? ""}
					className="h-9 w-full rounded-full border border-bone/10 bg-bone/5 pl-9 pr-3 text-sm text-bone placeholder:text-muted-foreground/70 focus:outline-none focus:border-ember/60 focus:ring-2 focus:ring-ember/20"
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
		if (typeof query === "string" && query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="relative">
				<Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				<input
					type="search"
					name="q"
					placeholder="Search"
					defaultValue={initialQuery}
					className="h-12 w-full rounded-full border border-bone/10 bg-bone/5 pl-11 pr-6 text-base text-bone placeholder:text-muted-foreground/70 focus:outline-none focus:border-ember/60 focus:ring-2 focus:ring-ember/20"
				/>
			</div>
		</form>
	);
}

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
					<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-44 rounded-full border border-bone/10 bg-bone/5 pl-9 pr-3 text-sm text-bone placeholder:text-muted-foreground/70 focus:outline-none focus:border-ember/60 focus:ring-2 focus:ring-ember/20"
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
