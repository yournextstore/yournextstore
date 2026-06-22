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
			<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
			<input
				type="search"
				name="q"
				placeholder="Search furniture"
				className="h-11 w-full rounded-full bg-[#f5e8e4]/60 ring-1 ring-black/5 pl-11 pr-4 text-sm text-[#0f0f0f] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/40"
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
			<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
			<input
				type="search"
				name="q"
				defaultValue={initialQuery ?? ""}
				placeholder="Search furniture"
				className="h-12 w-full rounded-full bg-[#f5e8e4]/60 ring-1 ring-black/5 pl-12 pr-4 text-base text-[#0f0f0f] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/40"
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
			<form onSubmit={handleSubmit} className="hidden sm:block">
				<div className="relative">
					<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search furniture"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-11 w-56 lg:w-64 rounded-full bg-[#f5e8e4]/60 ring-1 ring-black/5 pl-11 pr-4 text-sm placeholder:text-neutral-500 text-[#0f0f0f] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/40"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 hover:bg-[#f5e8e4] rounded-full transition-colors sm:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5 text-[#0f0f0f]" />
			</YnsLink>
		</>
	);
}
