"use client";

import { Search, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

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
				<input
					type="search"
					name="q"
					placeholder="Search..."
					defaultValue={searchParams.get("q") ?? ""}
					className="h-10 w-full rounded-sm border border-border bg-background pl-3 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
				/>
			</div>
			<button
				type="submit"
				aria-label="Search"
				className="p-2 hover:bg-secondary rounded-full transition-colors"
			>
				<Search className="w-5 h-5" />
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
				className="h-14 w-full rounded-sm border border-border bg-background pl-12 pr-4 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary"
			/>
		</form>
	);
}

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);

	const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q");
		if (typeof query === "string" && query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
			setOpen(false);
		}
	}, []);

	return (
		<div className="flex items-center gap-1">
			<form
				onSubmit={handleSubmit}
				className={`hidden sm:flex transition-all duration-300 overflow-hidden ${open ? "w-44" : "w-0"}`}
			>
				<div className="relative w-full">
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search..."
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-full rounded-sm border border-border bg-cream-soft pl-3 pr-3 text-sm placeholder:text-espresso/40 focus:outline-none focus:border-terracotta"
					/>
				</div>
			</form>
			<button
				type="button"
				onClick={() => {
					setOpen((v) => !v);
					setTimeout(() => inputRef.current?.focus(), 50);
				}}
				className="p-2 hover:bg-secondary rounded-full transition-colors hidden sm:flex"
				aria-label="Search"
			>
				<Search className="w-5 h-5 text-espresso" />
			</button>
			<a
				href="#"
				aria-label="Account"
				className="p-2 hover:bg-secondary rounded-full transition-colors hidden sm:flex"
			>
				<User className="w-5 h-5 text-espresso" />
			</a>
		</div>
	);
}
