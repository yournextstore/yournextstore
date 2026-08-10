"use client";

import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/**
 * Shared fallback for route-level error boundaries. `retry` re-fetches and
 * re-renders the boundary's children (Server Components included), so a
 * transient commerce API failure recovers in place instead of unmounting
 * the whole page to the root boundary.
 */
export function RouteErrorFallback({
	title,
	description,
	error,
	retry,
}: {
	title: string;
	description: string;
	error: Error & { digest?: string };
	retry: () => void;
}) {
	useEffect(() => {
		console.error("route error boundary", { digest: error.digest, error });
	}, [error]);

	return (
		<div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 py-24 text-center">
			<AlertCircleIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
			<h1 className="mt-6 text-2xl font-medium tracking-tight">{title}</h1>
			<p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
			<div className="mt-8 flex items-center gap-4">
				<button
					type="button"
					onClick={retry}
					className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
				>
					Try Again
				</button>
				<Link
					href="/"
					className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
				>
					Continue Shopping
				</Link>
			</div>
		</div>
	);
}
