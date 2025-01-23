import { getTranslations } from "@/i18n/server";
import { YnsLink } from "@/ui/yns-link";

export async function CartEmpty() {
	const t = await getTranslations("/cart.empty");
	return (
		<div className="flex max-h-80 flex-1 flex-col items-center justify-center gap-4">
			<div className="flex flex-col items-center justify-center space-y-2 text-center">
				<ShoppingCartIcon className="h-12 w-12 text-neutral-500" />
				<h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
				<p className="text-neutral-500">{t("description")}</p>
			</div>
			<YnsLink
				className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-6 text-sm font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-900/90 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50"
				href="/"
			>
				{t("continueShoppingButton")}
			</YnsLink>
		</div>
	);
}

function ShoppingCartIcon(props: { className: string }) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="8" cy="21" r="1" />
			<circle cx="19" cy="21" r="1" />
			<path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
		</svg>
	);
}
