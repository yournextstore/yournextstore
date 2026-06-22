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
			<form onSubmit={handleSubmit} className="hidden md:block">
				<div className="relative">
					<Search
						className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14111c]/55"
						strokeWidth={1.8}
					/>
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search shades, sets…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-44 rounded-full border border-[#e4daf5] bg-white/70 pl-9 pr-3 text-[13px] text-[#14111c] placeholder:text-[#14111c]/40 focus:outline-none focus:ring-2 focus:ring-[#5e3ca8]/30 focus:border-[#b4a4dd]"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 hover:bg-white/60 rounded-full transition-colors md:hidden text-[#14111c]"
				aria-label="Search"
			>
				<Search className="w-5 h-5" strokeWidth={1.8} />
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
				<Search
					className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b6377]"
					strokeWidth={1.8}
				/>
				<input
					ref={inputRef}
					type="search"
					name="q"
					placeholder="Search shades, sets…"
					enterKeyHint="search"
					autoComplete="off"
					className="h-12 w-full rounded-full border border-[#e4daf5] bg-white pl-12 pr-4 text-base text-[#14111c] placeholder:text-[#14111c]/40 focus:outline-none focus:ring-2 focus:ring-[#5e3ca8]/30 focus:border-[#b4a4dd] transition-colors"
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
			<div className="relative border-b-2 border-[#e4daf5] transition-colors focus-within:border-[#5e3ca8]">
				<Search
					className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b6377]"
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
					className="h-14 w-full border-0 bg-transparent pl-8 pr-2 text-2xl font-medium tracking-tight text-[#14111c] placeholder:font-medium placeholder:text-[#14111c]/40 focus:outline-none sm:text-3xl"
				/>
			</div>
		</form>
	);
}
