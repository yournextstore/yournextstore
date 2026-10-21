export default function SearchLoading() {
	return (
		<section className="px-[var(--main-gap)] py-4">
			<div className="mb-12">
				<div className="h-8 w-48 bg-secondary animate-pulse" />
				<div className="mt-2 h-5 w-32 bg-secondary animate-pulse" />
			</div>
			<div className="photon-grid">
				{Array.from({ length: 6 }, (_, i) => (
					<div key={i}>
						<div className="aspect-square bg-secondary  animate-pulse mb-4" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
