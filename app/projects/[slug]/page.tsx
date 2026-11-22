import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/worlds/CaseStudy";
import { projects } from "@/content/profile";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
	return projects.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params,
		p = projects.find((v) => v.slug === slug);
	return p
		? {
				title: p.title,
				description: p.summary,
				alternates: { canonical: "/projects/" + slug },
				openGraph: {
					title: p.title,
					description: p.summary,
					images: ["/art/" + p.art + ".webp"],
				},
			}
		: {};
}
export default async function Study({ params }: Props) {
	const { slug } = await params,
		p = projects.find((v) => v.slug === slug);
	if (!p) notFound();
	return <CaseStudy project={p} id="corsair" />;
}
