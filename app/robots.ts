import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
	const base =
		process.env.SITE_URL ||
		"https://the-code-corsair-abdul-hanan.nurturingtanager32.chatgpt.site";
	return {
		rules: { userAgent: "*", allow: "/", disallow: "/api/" },
		sitemap: base + "/sitemap.xml",
	};
}
