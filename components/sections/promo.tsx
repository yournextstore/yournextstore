import { Lock, Mail, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import boutique from "@/public/images/pexels/boutique.jpg";

// Penny's quote blocks carry customer testimonials from its CMS. A store has none to give, and
// invented quotes are not an option, so the same three-column rhythm describes how the shop works.
const NOTES = [
	{
		icon: Search,
		text: "Browse the whole range, filter by category and find the piece that fits your day.",
		title: "Easy to browse",
	},
	{
		icon: Lock,
		text: "Pay at a secure checkout with the payment methods you already use.",
		title: "Secure checkout",
	},
	{
		icon: Mail,
		text: "A confirmation with your order details lands in your inbox as soon as you buy.",
		title: "Order updates by email",
	},
];

/** Penny's BackgroundImage band: a faded photograph behind the sale callout and the quote row. */
export function Promo({ storeName }: { storeName: string }) {
	return (
		<div className="relative overflow-hidden">
			<div aria-hidden="true" className="absolute inset-0">
				<div className="absolute inset-0 mx-auto max-w-7xl overflow-hidden xl:px-8">
					<div className="relative h-full w-full">
						<Image src={boutique} alt="" fill sizes="1280px" className="object-cover object-center" />
					</div>
				</div>
				<div className="absolute inset-0 bg-white/75" />
				<div className="absolute inset-0 bg-linear-to-t from-white via-white" />
			</div>

			<section
				aria-labelledby="sale-heading"
				className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-32 text-center sm:px-6 lg:px-8"
			>
				<div className="mx-auto max-w-2xl lg:max-w-none">
					<h2
						id="sale-heading"
						className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
					>
						Just arrived
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-xl text-gray-600">
						Fresh additions to the shop, from everyday staples to small finds.
					</p>
					<Link
						href="/products?sort=newest"
						className="mt-6 inline-block rounded-md border border-gray-300 bg-white px-8 py-3 font-medium text-gray-900 shadow-sm hover:bg-gray-50"
					>
						See what&apos;s new
					</Link>
				</div>
			</section>

			<section
				aria-labelledby="notes-heading"
				className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
			>
				<div className="mx-auto max-w-2xl lg:max-w-none">
					<h2 id="notes-heading" className="text-2xl font-extrabold tracking-tight text-gray-900">
						Shopping with {storeName}
					</h2>
					<div className="mt-16 space-y-16 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
						{NOTES.map((note) => (
							<div key={note.title} className="sm:flex lg:block">
								<note.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
								<div className="mt-8 sm:mt-0 sm:ml-6 lg:mt-10 lg:ml-0">
									<p className="text-lg text-gray-600">{note.text}</p>
									<p className="mt-4 font-semibold text-gray-900">{note.title}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
