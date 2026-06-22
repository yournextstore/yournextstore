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
				<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3a4a8c]/60" />
				<input
					type="search"
					name="q"
					placeholder="Search cookies…"
					defaultValue={searchParams.get("q") ?? ""}
					className="h-10 w-full rounded-full border-2 border-[#3a4a8c]/15 bg-[#fff8e7] pl-10 pr-4 text-sm font-medium text-[#3a4a8c] placeholder:text-[#3a4a8c]/45 focus:outline-none focus:ring-4 focus:ring-[#e8456a]/20 focus:border-[#e8456a]"
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
				<Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3a4a8c]/60" />
				<input
					type="search"
					name="q"
					placeholder="Search cookies…"
					defaultValue={initialQuery}
					className="h-12 w-full rounded-full border-2 border-[#3a4a8c]/15 bg-[#fff8e7] pl-11 pr-6 text-base font-medium text-[#3a4a8c] placeholder:text-[#3a4a8c]/45 focus:outline-none focus:ring-4 focus:ring-[#e8456a]/20 focus:border-[#e8456a]"
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
					<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3a4a8c]/60" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search cookies…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-56 rounded-full border-2 border-[#3a4a8c]/15 bg-[#fff8e7] pl-10 pr-4 text-sm font-medium text-[#3a4a8c] placeholder:text-[#3a4a8c]/45 focus:outline-none focus:ring-4 focus:ring-[#e8456a]/20 focus:border-[#e8456a]"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 text-[#3a4a8c] hover:bg-[#fff8e7] rounded-full transition-colors sm:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5" />
			</YnsLink>
		</>
	);
}
