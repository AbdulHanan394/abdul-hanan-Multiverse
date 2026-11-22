import { worldIds, worldPath } from "@/content/worlds";
import type { MetadataRoute } from "next";
import { projects } from "@/content/profile";
export default function sitemap(): MetadataRoute.Sitemap {
	const base =
		process.env.SITE_URL ||
		"https://the-code-corsair-abdul-hanan.nurturingtanager32.chatgpt.site";
	return [
		"",
		...worldIds.filter((id) => id !== "corsair").map(worldPath),
		...projects.map((p) => "/projects/" + p.slug),
	].map((path) => ({
		url: base + path,
	}));
}
