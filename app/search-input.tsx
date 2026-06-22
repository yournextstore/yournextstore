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
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/50" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search snacks…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-44 lg:w-56 rounded-full border border-brand-ink/15 bg-brand-cream/60 pl-9 pr-4 text-sm placeholder:text-brand-ink/50 focus:outline-none focus:border-brand-coral focus:bg-white focus:ring-2 focus:ring-brand-coral/20 transition-colors"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2.5 rounded-full text-brand-ink hover:bg-brand-cream transition-colors md:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5" strokeWidth={1.75} />
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
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/50" />
				<input
					type="search"
					name="q"
					placeholder="Search snacks…"
					className="h-10 w-full rounded-full border border-brand-ink/15 bg-brand-cream/60 pl-9 pr-4 text-sm placeholder:text-brand-ink/50 focus:outline-none focus:border-brand-coral focus:bg-white focus:ring-2 focus:ring-brand-coral/20 transition-colors"
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
				<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-ink/50" />
				<input
					type="search"
					name="q"
					placeholder="Search snacks…"
					defaultValue={initialQuery ?? ""}
					className="h-12 w-full rounded-full border border-brand-ink/15 bg-brand-cream/60 pl-10 pr-4 text-base placeholder:text-brand-ink/50 focus:outline-none focus:border-brand-coral focus:bg-white focus:ring-2 focus:ring-brand-coral/20 transition-colors"
				/>
			</div>
		</form>
	);
}
