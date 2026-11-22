import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/profile";
import {
	worldIds,
	isWorld,
	worlds,
	studyPath,
	cardArt,
} from "@/content/worlds";
import CaseStudy from "@/components/worlds/CaseStudy";
type Props = { params: Promise<{ world: string; slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () =>
	worldIds
		.filter((id) => id !== "corsair")
		.flatMap((world) => projects.map((p) => ({ world, slug: p.slug })));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { world, slug } = await params,
		p = projects.find((v) => v.slug === slug);
	if (!p || !isWorld(world)) return {};
	return {
		title: p.title + " · " + worlds[world].name,
		description: p.summary,
		alternates: { canonical: studyPath("corsair", slug) },
		openGraph: { title: p.title, images: [cardArt(world, p.art)] },
	};
}
export default async function Study({ params }: Props) {
	const { world, slug } = await params,
		p = projects.find((v) => v.slug === slug);
	if (!p || !isWorld(world) || world === "corsair") notFound();
	return <CaseStudy project={p} id={world} />;
}
