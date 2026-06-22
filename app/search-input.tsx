"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { YnsLink } from "@/components/yns-link";

export function MobileSearchInput({ onNavigate }: { onNavigate?: () => void }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
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
		<form onSubmit={handleSubmit} className="flex items-center gap-2">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
				<input
					type="search"
					name="q"
					placeholder="Search..."
					defaultValue={searchParams.get("q") ?? ""}
					className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
				/>
			</div>
			<button
				type="submit"
				aria-label="Search"
				className="p-2 hover:bg-secondary rounded-full transition-colors"
			>
				<Search className="w-4 h-4" />
			</button>
		</form>
	);
}

export function SearchPageInput({ initialQuery }: { initialQuery?: string }) {
	const router = useRouter();

	const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q");
		if (typeof query === "string") {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<form onSubmit={handleSubmit} className="relative flex items-center">
			<Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
			<input
				type="search"
				name="q"
				placeholder="Search products..."
				defaultValue={initialQuery ?? ""}
				className="h-14 w-full rounded-full border border-border bg-background pl-12 pr-4 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b5e4e]" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the shop"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-44 rounded-full border border-[#d8c4a8] bg-[#fbf3e6] pl-9 pr-3 text-[12px] text-[#2a2622] placeholder:text-[#6b5e4e]/70 focus:outline-none focus:ring-2 focus:ring-[#1f46c2]/30 focus:border-[#1f46c2]"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 hover:bg-[#ecd3b8] rounded-full transition-colors lg:hidden"
				aria-label="Search"
			>
				<Search className="w-4 h-4 text-[#2a2622]" />
			</YnsLink>
		</>
	);
}
