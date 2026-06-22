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
			<form onSubmit={handleSubmit} className="hidden lg:block">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:#fff8ec]/70" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the cellar…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-52 rounded-full border border-white/30 bg-white/10 pl-9 pr-3 text-sm text-[color:#fff8ec] placeholder:text-[color:#fff8ec]/60 focus:outline-none focus:ring-2 focus:ring-white/40"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="rounded-full p-2 text-[color:#fff8ec] transition-colors hover:bg-white/10 lg:hidden"
				aria-label="Search"
			>
				<Search className="h-5 w-5" strokeWidth={1.8} />
			</YnsLink>
		</>
	);
}

export function MobileSearchInput({ onNavigate }: { onNavigate: () => void }) {
	const router = useRouter();

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
				<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				<input
					type="search"
					name="q"
					placeholder="Search the cellar…"
					autoComplete="off"
					className="h-12 w-full rounded-full border border-border bg-background pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
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
			<div className="relative border-b border-foreground/30 transition-colors focus-within:border-foreground">
				<Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/60" />
				<input
					ref={inputRef}
					type="search"
					name="q"
					placeholder="Search the store"
					defaultValue={initialQuery}
					autoComplete="off"
					className="h-14 w-full border-0 bg-transparent pl-8 pr-2 text-2xl font-medium tracking-tight text-foreground placeholder:font-medium placeholder:text-foreground/40 focus:outline-none sm:text-3xl"
				/>
			</div>
		</form>
	);
}
