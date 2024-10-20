import { markdownToHtml } from "@/lib/md2html";
import { getTranslations } from "next-intl/server";

export default async function ReturnRefundPolicyPage() {
	const t = await getTranslations("Global.legal");

	const imprint = await markdownToHtml("return-refund-policy.md");

	return (
		<article className="pb-12">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("returnRefundPolicyLabel")}
			</h1>
			<br />
			<div dangerouslySetInnerHTML={{ __html: imprint }} />
		</article>
	);
}
