export default function RootNotFound() {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
			style={{ minHeight: "90vh" }}
		>
			<h1 className="mt-6 text-7xl font-bold tracking-tight">404</h1>
			<h2 className="mt-4 text-xl text-gray-500">Page not found</h2>
			<a
				href="/"
				className="mt-8 inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
			>
				Continue Shopping
			</a>
		</div>
	);
}
