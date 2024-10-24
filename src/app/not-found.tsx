import { getTranslations } from "@/i18n/server";
import { YnsLink } from "@/ui/yns-link";

export default async function NotFound() {
	const t = await getTranslations("Global.notFound");
	return (
		<main className="mx-auto max-w-xl flex-1 text-center">
			<h1 className="mt-4 text-4xl font-black">{t("title")}</h1>
			<p className="mt-4 text-lg">{t("description")}</p>
			<YnsLink href="/" className="mt-4 text-blue-600 underline">
				{t("goBackLink")}
			</YnsLink>
		</main>
	);
}
