import { YnsLink } from "../yns-link";

type Care = {
	name: string;
	tint: string;
	icon: React.ReactNode;
};

const CARES: Care[] = [
	{
		name: "Bone & Joint",
		tint: "bg-[color:var(--peach)]",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<path
					d="M14 8a4 4 0 0 0-4 4 4 4 0 0 0 1.7 3.3 4 4 0 0 0 .6 5.4l10 10a4 4 0 0 0 5.4.6A4 4 0 0 0 31 33a4 4 0 1 0 5-5 4 4 0 0 0-1.6-3.3 4 4 0 0 0-.7-5.4l-10-10a4 4 0 0 0-5.4-.6A4 4 0 0 0 14 8Z"
					stroke="#0F2F1A"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	{
		name: "Diabetes Care",
		tint: "bg-[color:var(--mint-soft)]",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<rect x="14" y="10" width="20" height="28" rx="3" stroke="#0F2F1A" strokeWidth="2" />
				<rect x="18" y="16" width="12" height="6" rx="1.5" stroke="#0F2F1A" strokeWidth="2" />
				<circle cx="20" cy="30" r="1.4" fill="#0F2F1A" />
				<circle cx="24" cy="30" r="1.4" fill="#0F2F1A" />
				<circle cx="28" cy="30" r="1.4" fill="#0F2F1A" />
			</svg>
		),
	},
	{
		name: "Kidney Care",
		tint: "bg-[color:var(--butter)]",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<path
					d="M18 12c-6 0-10 5-10 12s5 12 12 12 8-3 8-7-3-5-3-9 5-4 5-9-5-3-12 1Z"
					stroke="#0F2F1A"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	{
		name: "Liver Care",
		tint: "bg-[color:var(--peach)]",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<path
					d="M10 18c0-5 4-8 9-8 4 0 6 2 9 2s5-2 8-2c2 0 4 2 4 5 0 8-9 19-18 19S10 24 10 18Z"
					stroke="#0F2F1A"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
				<path d="M22 22c2-1 4 1 5 3" stroke="#0F2F1A" strokeWidth="2" strokeLinecap="round" />
			</svg>
		),
	},
	{
		name: "Respiratory",
		tint: "bg-[color:var(--sky)]",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<path
					d="M24 8v14M24 22c-2-4-6-6-9-6-2 0-4 1-4 4 0 6 4 16 13 16s13-10 13-16c0-3-2-4-4-4-3 0-7 2-9 6Z"
					stroke="#0F2F1A"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	{
		name: "Eye Care",
		tint: "bg-[color:var(--mint-soft)]",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
				<path
					d="M6 24c4-7 11-11 18-11s14 4 18 11c-4 7-11 11-18 11S10 31 6 24Z"
					stroke="#0F2F1A"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
				<circle cx="24" cy="24" r="5" stroke="#0F2F1A" strokeWidth="2" />
				<circle cx="24" cy="24" r="2" fill="#0F2F1A" />
			</svg>
		),
	},
];

export function CareCategories() {
	return (
		<section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
			<div className="flex items-end justify-between gap-4">
				<div>
					<h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">Shop by care area</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Personalized recommendations for every concern.
					</p>
				</div>
				<YnsLink
					href="/products"
					className="hidden text-xs font-semibold text-[color:var(--mint-deep)] underline-offset-4 hover:underline sm:inline"
				>
					See all categories
				</YnsLink>
			</div>
			<div className="no-scrollbar mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
				{CARES.map((care) => (
					<YnsLink
						key={care.name}
						href="/products"
						className="group flex w-[120px] shrink-0 flex-col items-center text-center sm:w-[140px]"
					>
						<div
							className={`${care.tint} flex aspect-square w-full items-center justify-center rounded-3xl transition-transform group-hover:-translate-y-0.5 group-hover:shadow-md`}
						>
							{care.icon}
						</div>
						<span className="mt-3 text-xs font-semibold text-foreground sm:text-sm">{care.name}</span>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
