import { type MetadataRoute } from "next";
import { env } from "@/env.mjs";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: env.NEXT_PUBLIC_URL + "/sitemap.xml",
	};
}
