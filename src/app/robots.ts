import type { MetadataRoute } from "next";
import { publicUrl } from "@/env.mjs";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
			},
			{
				userAgent: "Googlebot",
				disallow: " ",
			},
			{
				userAgent: "Googlebot-image",
				disallow: " ",
			},
		],
		sitemap: publicUrl + "/sitemap.xml",
	};
}
