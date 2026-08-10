"use client";

// Catches errors thrown by the root layout itself (e.g. the meGetCached read),
// which the regular app/error.tsx boundary cannot reach. Renders its own
// <html>/<body> because the root layout is gone when this shows.
export default function GlobalError({
	error,
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	return (
		<html lang="en">
			<body
				style={{
					fontFamily: "system-ui, sans-serif",
					display: "flex",
					minHeight: "100dvh",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
					margin: 0,
				}}
			>
				<div>
					<h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
					<p style={{ color: "#666", marginBottom: "1.5rem" }}>
						The store failed to load{error.digest ? ` (${error.digest})` : ""}. Please try again.
					</p>
					<button
						type="button"
						onClick={() => retry()}
						style={{
							padding: "0.5rem 1rem",
							borderRadius: "0.375rem",
							border: "1px solid #ccc",
							background: "#111",
							color: "#fff",
							cursor: "pointer",
						}}
					>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}
