import WorldGame from "@/components/arcade/WorldGame";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
	worldIds,
	worlds,
	isWorld,
	worldArt,
	worldPath,
} from "@/content/worlds";
import { WorldAtlas } from "@/components/worlds/WorldAtlas";
import WorldHero from "@/components/worlds/WorldHero";
import Instrument from "@/components/worlds/Instrument";
import ProjectStudio from "@/components/worlds/ProjectStudio";
import { WorldProfile } from "@/components/worlds/WorldSections";
import Chronicle from "@/components/Chronicle";
import Oracle from "@/components/Oracle";
import Contact from "@/components/Contact";
type Props = { params: Promise<{ world: string }> };
export const dynamicParams = false;
export const generateStaticParams = () =>
	worldIds.filter((id) => id !== "corsair").map((world) => ({ world }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { world } = await params;
	if (!isWorld(world)) return {};
	const w = worlds[world];
	return {
		title: { absolute: "Abdul Hanan · " + w.name + " portfolio" },
		description:
			"Explore Abdul Hanan’s full-stack and AI engineering work in the " +
			w.name +
			" edition of his portfolio.",
		alternates: { canonical: worldPath(world) },
		openGraph: { title: "Abdul Hanan · " + w.name, images: [worldArt(world)] },
	};
}
export default async function Edition({ params }: Props) {
	const { world: id } = await params;
	if (!isWorld(id) || id === "corsair") notFound();
	return (
		<main id="main">
			<WorldHero id={id} />
			<ProjectStudio id={id} />
			<WorldProfile id={id} />
			<Instrument id={id} />
			<WorldGame key={id} id={id} />
			<Chronicle world={id} />
			<Oracle world={id} />
			<Contact world={id} />
			<WorldAtlas current={id} />
		</main>
	);
}
