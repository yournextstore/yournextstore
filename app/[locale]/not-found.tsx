import { ShoppingCartIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Metadata");
	return {
		title: t("notFoundTitle"),
		description: t("notFoundDescription"),
	};
}

export default async function NotFound() {
	const t = await getTranslations("NotFound");

	return (
		<div
			className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
			style={{ minHeight: "90vh" }}
		>
			<ShoppingCartIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
			<h1 className="mt-6 text-7xl font-bold tracking-tight">{t("title")}</h1>
			<h2 className="mt-4 text-xl text-muted-foreground">{t("subtitle")}</h2>
			<p className="mt-2 text-sm text-muted-foreground">{t("description")}</p>
			<Link
				href="/"
				className="mt-8 inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
			>
				{t("continueShopping")}
			</Link>
		</div>
	);
}
