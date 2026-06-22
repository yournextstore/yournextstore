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
					<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search the wild…"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-44 lg:w-56 rounded-full border border-white/30 bg-white/15 pl-10 pr-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:bg-white/25 focus:border-white/50 transition-colors"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15 transition-colors md:hidden"
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
					placeholder="Search the wild…"
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
