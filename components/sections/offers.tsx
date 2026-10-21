import Link from "next/link";

export type Offer = { name: string; description: string; href: string };

/** Penny's three-up offers strip above the hero (below it on phones). */
export function Offers({ offers }: { offers: Offer[] }) {
	return (
		<nav aria-label="Offers" className="order-last lg:order-first">
			<div className="mx-auto max-w-7xl lg:px-8">
				<ul className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
					{offers.map((offer) => (
						<li key={offer.name} className="flex flex-col">
							<Link
								href={offer.href}
								className="relative flex flex-1 flex-col justify-center bg-white px-4 py-6 text-center focus:z-10"
							>
								<p className="text-sm text-gray-500">{offer.name}</p>
								<p className="font-semibold text-gray-900">{offer.description}</p>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
