import { getTranslations } from "@/i18n/server";

export async function ProductNotFound({ query }: { query: string | undefined }) {
	const t = await getTranslations("/search.notFound");

	return (
		<div className="flex h-[60vh] flex-col items-center justify-center gap-4">
			<h1 className="text-3xl font-bold">{t("title", { query })}</h1>
			<p className="max-w-md text-center text-neutral-500">{t("description")}</p>
		</div>
	);
}
