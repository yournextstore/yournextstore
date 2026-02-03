"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/icons/material-icon";

type SearchFormProps = {
	initialQuery?: string;
};

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
	const router = useRouter();
	const [query, setQuery] = useState(initialQuery);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-xl mx-auto">
			<div className="relative">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search for CBD oils, gummies, and more..."
					className="w-full bg-dark-accent border border-border rounded-full py-4 px-6 pr-14 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
				/>
				<button
					type="submit"
					className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
				>
					<MaterialIcon name="search" className="text-xl" />
				</button>
			</div>
		</form>
	);
}
