"use client";

import { RouteErrorFallback } from "@/components/route-error";

export default function OrderError({
	error,
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	return (
		<RouteErrorFallback
			title="We couldn't load your order"
			description="Your payment went through if you completed checkout — this page just failed to load. Try again in a moment."
			error={error}
			retry={retry}
		/>
	);
}
