import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export async function markdownToHtml(file: string) {
	const fileContent = fs.readFileSync(path.join(process.cwd(), "messages", "legal-pages", file), "utf-8");
	const result = await remark().use(html).process(fileContent);
	return result.toString();
}
