export default function SearchLoading() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="mb-12">
				<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
				<div className="mt-2 h-5 w-32 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }, (_, i) => (
					<div key={i}>
						<div className="aspect-square bg-secondary rounded-2xl animate-pulse mb-4" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
