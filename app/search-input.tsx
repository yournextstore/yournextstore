"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { YnsLink } from "@/components/yns-link";

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
		<form onSubmit={handleSubmit} className="relative w-full">
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<input
				type="search"
				name="q"
				placeholder="Search the shop"
				className="h-10 w-full rounded-full border border-border bg-transparent pl-10 pr-4 text-sm focus:outline-none"
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
		if (typeof query === "string" && query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<form onSubmit={handleSubmit} className="relative w-full">
			<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
			<input
				type="search"
				name="q"
				defaultValue={initialQuery ?? ""}
				placeholder="Search the shop"
				className="h-12 w-full rounded-full border border-border bg-transparent pl-11 pr-4 text-base focus:outline-none"
			/>
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
			<form onSubmit={handleSubmit} className="hidden lg:block">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the shop"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-44 rounded-full border border-border/70 bg-transparent pl-9 pr-3 text-[12px] tracking-wide placeholder:text-muted-foreground/70 focus:outline-none focus:border-[color:var(--oxblood)] focus:ring-0"
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
