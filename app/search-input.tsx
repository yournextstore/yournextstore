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
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search flavors..."
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-44 rounded-full border border-black/15 bg-black/[0.03] pl-9 pr-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--yns-cyan)]"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 rounded-full text-black hover:bg-black/5 transition-colors md:hidden"
				aria-label="Search"
			>
				<Search className="w-5 h-5" />
			</YnsLink>
		</>
	);
}

export function MobileSearchInput({ onNavigate }: { onNavigate: () => void }) {
	const router = useRouter();

	const handleSubmit = useCallback(
		(e: React.SubmitEvent<HTMLFormElement>) => {
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
		<form onSubmit={handleSubmit}>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60" />
				<input
					type="search"
					name="q"
					placeholder="Search flavors..."
					className="h-10 w-full rounded-full border border-black/15 bg-black/[0.03] pl-10 pr-4 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--yns-cyan)]"
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
		if (typeof query === "string") {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<form onSubmit={handleSubmit}>
			<div className="relative">
				<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/60" />
				<input
					type="search"
					name="q"
					placeholder="Search flavors..."
					defaultValue={initialQuery}
					className="h-12 w-full rounded-full border border-black/15 bg-black/[0.03] pl-12 pr-5 text-base text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--yns-cyan)]"
				/>
			</div>
		</form>
	);
}
