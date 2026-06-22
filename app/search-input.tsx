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
					<Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="SEARCH…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-44 border-2 border-foreground bg-background pl-8 pr-3 text-xs uppercase tracking-[0.18em] font-bold placeholder:text-foreground/50 focus:outline-none focus:bg-[#d4ff3a]"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="h-10 w-10 flex items-center justify-center border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-colors md:hidden"
				aria-label="Search"
			>
				<Search className="w-4 h-4" />
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
				<Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground" />
				<input
					type="search"
					name="q"
					placeholder="SEARCH…"
					className="h-10 w-full border-2 border-foreground bg-background pl-8 pr-3 text-xs uppercase tracking-[0.18em] font-bold placeholder:text-foreground/50 focus:outline-none focus:bg-[#d4ff3a]"
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
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
				<input
					type="search"
					name="q"
					placeholder="SEARCH…"
					defaultValue={initialQuery ?? ""}
					className="h-12 w-full border-2 border-foreground bg-background pl-10 pr-4 text-sm uppercase tracking-[0.18em] font-bold placeholder:text-foreground/50 focus:outline-none focus:bg-[#d4ff3a]"
				/>
			</div>
		</form>
	);
}
