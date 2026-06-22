"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { YnsLink } from "@/components/yns-link";

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

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
			<div className="hidden sm:flex items-center">
				{open ? (
					<form onSubmit={handleSubmit}>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1a2e]/60" />
							<input
								ref={inputRef}
								type="search"
								name="q"
								placeholder="Search scents..."
								defaultValue={searchParams.get("q") ?? ""}
								onBlur={() => setOpen(false)}
								className="h-9 w-56 rounded-full border border-[#1a1a2e]/20 bg-white/70 pl-9 pr-3 text-sm placeholder:text-[#1a1a2e]/50 focus:outline-none focus:ring-2 focus:ring-[#4d4bc4]"
							/>
						</div>
					</form>
				) : (
					<button
						type="button"
						onClick={() => setOpen(true)}
						className="p-2 hover:bg-white/30 rounded-full transition-colors"
						aria-label="Search"
					>
						<Search className="w-5 h-5" />
					</button>
				)}
			</div>
			<YnsLink
				href="/search"
				className="p-2 hover:bg-white/30 rounded-full transition-colors sm:hidden"
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
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1a2e]/60" />
				<input
					type="search"
					name="q"
					placeholder="Search scents..."
					className="h-10 w-full rounded-full border border-[#1a1a2e]/20 bg-white/70 pl-10 pr-4 text-sm placeholder:text-[#1a1a2e]/50 focus:outline-none focus:ring-2 focus:ring-[#4d4bc4]"
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
				<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1a1a2e]/60" />
				<input
					type="search"
					name="q"
					placeholder="Search scents..."
					defaultValue={initialQuery}
					className="h-12 w-full rounded-full border border-[#1a1a2e]/20 bg-white/70 pl-12 pr-5 text-base placeholder:text-[#1a1a2e]/50 focus:outline-none focus:ring-2 focus:ring-[#4d4bc4]"
				/>
			</div>
		</form>
	);
}
