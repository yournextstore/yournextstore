import Link from "next/link";
import { YNSMedia } from "@/lib/yns-media";

function CheckIcon() {
	return (
		<svg aria-hidden className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
				fill="#111827"
			/>
		</svg>
	);
}

/**
 * ProductFeature: a centred title and lead, then a description with check-marked points on the
 * left and a three-photo grid (one wide, two halves) on the right.
 */
export function ProductFeatures({
	title,
	lead,
	heading,
	description,
	points,
	images,
	href,
	cta = "View the product",
}: {
	title: string;
	lead: string;
	heading: string;
	description: string | null;
	points: string[];
	images: string[];
	href?: string;
	cta?: string;
}) {
	const [wide, left, right] = images;
	return (
		<section className="container-ae py-16 sm:py-24">
			<div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
				<h2 className="mb-3 text-[1.875rem] font-bold sm:text-[2.25rem]">{title}</h2>
				<p>{lead}</p>
			</div>
			<div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
				<div className="lg:pr-8">
					<h3 className="mb-3 text-xl font-semibold sm:text-2xl">{heading}</h3>
					{description && <p className="mb-8 line-clamp-[8]">{description}</p>}
					<ul className="space-y-5">
						{points.map((point) => (
							<li key={point} className="flex gap-3">
								<CheckIcon />
								<span>{point}</span>
							</li>
						))}
					</ul>
					{href && (
						<Link href={href} className="btn-ae btn-ae-dark mt-8">
							{cta}
						</Link>
					)}
				</div>
				<div className="grid grid-cols-2 gap-4 sm:gap-6">
					{wide && (
						<div className="relative col-span-2 aspect-[16/7] overflow-hidden rounded-xl bg-muted">
							<YNSMedia
								src={wide}
								alt=""
								fill
								sizes="(max-width: 992px) 100vw, 50vw"
								className="object-cover object-[50%_30%]"
							/>
						</div>
					)}
					{[left, right].map((src) =>
						src ? (
							<div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
								<YNSMedia
									src={src}
									alt=""
									fill
									sizes="(max-width: 992px) 50vw, 25vw"
									className="object-cover object-[50%_30%]"
								/>
							</div>
						) : null,
					)}
				</div>
			</div>
		</section>
	);
}
