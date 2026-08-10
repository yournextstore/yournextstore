"use client";

import { RouteErrorFallback } from "@/components/route-error";

export default function ProductError({
	error,
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	return (
		<RouteErrorFallback
			title="We couldn't load this product"
			description="This is usually temporary. Try again, or keep browsing the store."
			error={error}
			retry={retry}
		/>
	);
}
