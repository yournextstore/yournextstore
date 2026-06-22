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
				className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f7e4d4] transition-colors"
				aria-label="Search"
			>
				<Search className="w-5 h-5 text-[#1a0f4d]" />
			</YnsLink>
			<form onSubmit={handleSubmit} className="hidden">
				<input ref={inputRef} type="search" name="q" defaultValue={searchParams.get("q") ?? ""} />
			</form>
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
				<Search
					className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b5b9a]"
					strokeWidth={1.6}
				/>
				<input
					ref={inputRef}
					type="search"
					name="q"
					placeholder="Search products…"
					enterKeyHint="search"
					autoComplete="off"
					className="h-12 w-full rounded-2xl border border-[#ecd9c6] bg-white pl-12 pr-4 text-base text-[#1a0f4d] placeholder:text-[#6b5b9a] focus:outline-none focus:border-[#4b1fb5] transition-colors"
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
			<div className="relative border-b-2 border-[#ecd9c6] transition-colors focus-within:border-[#4b1fb5]">
				<Search
					className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b5b9a]"
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
					className="h-14 w-full border-0 bg-transparent pl-8 pr-2 text-2xl font-medium tracking-tight text-[#1a0f4d] placeholder:font-medium placeholder:text-[#6b5b9a] focus:outline-none sm:text-3xl"
				/>
			</div>
		</form>
	);
}
