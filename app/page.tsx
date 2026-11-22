import WorldGame from "@/components/arcade/WorldGame";
import { WorldAtlas } from "@/components/worlds/WorldAtlas";
import Instrument from "@/components/worlds/Instrument";
import Hero from "@/components/Hero";
import Fleet from "@/components/Fleet";
import Captain from "@/components/Captain";
import Arsenal from "@/components/Arsenal";
import Voyage from "@/components/Voyage";
import Chronicle from "@/components/Chronicle";
import Oracle from "@/components/Oracle";
import Contact from "@/components/Contact";
export default function Home() {
	return (
		<main id="main">
			<Hero />
			<WorldGame id="corsair" />
			<WorldAtlas current="corsair" />
			<Fleet />
			<Instrument id="corsair" />
			<Captain />
			<Arsenal />
			<Voyage />
			<Chronicle />
			<Oracle />
			<Contact />
		</main>
	);
}
