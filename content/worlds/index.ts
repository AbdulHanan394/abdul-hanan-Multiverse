export const worldIds = [
	"corsair",
	"orbital",
	"frontier",
	"marvel",
	"neon",
	"abyss",
	"clockwork",
	"alpine",
] as const;
export type WorldId = (typeof worldIds)[number];
export interface World {
	id: WorldId;
	name: string;
	genre: string;
	short: string;
	location: string;
	line: string;
	accent: string;
	projects: string;
	about: string;
	skills: string;
	journey: string;
	log: string;
	oracle: string;
	contact: string;
	instrument: string;
	instruction: string;
	effect: string;
	landmarks: [string, string, string, string];
}
export const worlds: Record<WorldId, World> = {
	corsair: {
		id: "corsair",
		name: "The Code Corsair",
		genre: "Maritime fantasy",
		short: "Corsair",
		location: "North Atlantic",
		line: "Charting the Unknown. Engineering the Impossible.",
		accent: "#d5b47b",
		projects: "The Fleet",
		about: "The Captain",
		skills: "The Arsenal",
		journey: "The Voyage",
		log: "The Chronicle",
		oracle: "The Oracle",
		contact: "Send a Raven",
		instrument: "The brass helm",
		instruction:
			"Turn the helm to a port. Each bearing opens a different project.",
		effect: "Catch the wind",
		landmarks: [
			"The Observatory",
			"The Lighthouse",
			"The Trading Port",
			"The Merchant Harbor",
		],
	},
	orbital: {
		id: "orbital",
		name: "Orbital Relay",
		genre: "Space exploration",
		short: "Orbital",
		location: "Saturn orbit",
		line: "A mission archive for intelligent systems, built on Earth.",
		accent: "#aebbff",
		projects: "Mission archive",
		about: "Crew dossier",
		skills: "Flight systems",
		journey: "Flight history",
		log: "Telemetry",
		oracle: "Mission control",
		contact: "Open a channel",
		instrument: "Orbital transfer",
		instruction: "Adjust the orbital radius to dock with a project satellite.",
		effect: "Engage warp",
		landmarks: [
			"Cognitive satellite",
			"Learning module",
			"Cargo relay",
			"Transport capsule",
		],
	},
	frontier: {
		id: "frontier",
		name: "Dust & Iron",
		genre: "Western",
		short: "Frontier",
		location: "Red Mesa Junction",
		line: "A field journal from the edge of the software frontier.",
		accent: "#ffd08e",
		projects: "The dispatch board",
		about: "The engineer",
		skills: "The toolkit",
		journey: "The trail",
		log: "The gazette",
		oracle: "The operator",
		contact: "Send a wire",
		instrument: "Junction telegraph",
		instruction:
			"Send a two-symbol wire. Dot and dash combinations route you to four project outposts.",
		effect: "Ride the trail",
		landmarks: [
			"Signal office",
			"Schoolhouse",
			"Freight depot",
			"Moving company",
		],
	},
	marvel: {
		id: "marvel",
		name: "Marvel Multiverse",
		genre: "Superhero comics",
		short: "Marvel",
		location: "Multiverse dispatch",
		line: "One engineer. Four origin stories. Pick up an issue.",
		accent: "#ffcf4c",
		projects: "The issue rack",
		about: "Origin story",
		skills: "Power set",
		journey: "The backstory",
		log: "Latest dispatch",
		oracle: "Ask the editor",
		contact: "Letters page",
		instrument: "The panel press",
		instruction:
			"Turn the pages of a four-panel issue. Each panel leads to its project’s origin story.",
		effect: "Break the panel",
		landmarks: [
			"The memory engine",
			"Focus field",
			"The dispatch network",
			"Moving day",
		],
	},
	neon: {
		id: "neon",
		name: "Neon District",
		genre: "Cyberpunk",
		short: "Neon",
		location: "District 04 · after dark",
		line: "Follow the signal from the interface to the machine.",
		accent: "#64f3d7",
		projects: "Network directory",
		about: "Operator profile",
		skills: "Loaded modules",
		journey: "System history",
		log: "Event stream",
		oracle: "Query terminal",
		contact: "Transmit",
		instrument: "Project terminal",
		instruction:
			"Type a project command, or tap a command key to inspect its record.",
		effect: "Run overdrive",
		landmarks: ["Memory node", "Vision node", "Freight node", "Transit node"],
	},
	abyss: {
		id: "abyss",
		name: "Hadal Station",
		genre: "Deep-sea exploration",
		short: "Hadal",
		location: "Hadal survey sector",
		line: "Deep-water field notes on the systems beneath the surface.",
		accent: "#87f1df",
		projects: "Recovered signals",
		about: "Dive dossier",
		skills: "Dive equipment",
		journey: "Dive history",
		log: "Hydrophone log",
		oracle: "Surface radio",
		contact: "Radio the surface",
		instrument: "Hydrophone array",
		instruction:
			"Send a sonar ping, then identify a returning signal to discover a project.",
		effect: "Pulse the sonar",
		landmarks: [
			"Memory capsule",
			"Reef beacon",
			"Subsea freight",
			"Supply tender",
		],
	},
	clockwork: {
		id: "clockwork",
		name: "The Clockmaker",
		genre: "Brass & clockwork",
		short: "Clockwork",
		location: "The astronomical workshop",
		line: "An engineer’s cabinet of mechanisms, instruments, and working models.",
		accent: "#e9bf80",
		projects: "The cabinet",
		about: "Maker’s notes",
		skills: "Instruments",
		journey: "The ledger",
		log: "Workshop log",
		oracle: "The automaton",
		contact: "Correspondence",
		instrument: "The escapement",
		instruction:
			"Wind the crown one detent at a time. The mechanism indexes a different project at every stop.",
		effect: "Wind the engine",
		landmarks: [
			"The mnemonic engine",
			"The study dial",
			"Freight regulator",
			"Traveling works",
		],
	},
	alpine: {
		id: "alpine",
		name: "Aurora Ridge",
		genre: "Polar expedition",
		short: "Aurora",
		location: "Northern icefield",
		line: "Fieldwork in software, under a sky that never stands still.",
		accent: "#a2efd0",
		projects: "Field studies",
		about: "Field notes",
		skills: "The gear room",
		journey: "The traverse",
		log: "Camp journal",
		oracle: "Base camp",
		contact: "Reach base camp",
		instrument: "Aurora spectroscope",
		instruction:
			"Tune the wavelength to reveal a band of the aurora and its corresponding field study.",
		effect: "Wake the aurora",
		landmarks: [
			"Memory observatory",
			"Learning station",
			"Supply crossing",
			"Base-camp transit",
		],
	},
};
export const isWorld = (value: string): value is WorldId =>
	worldIds.includes(value as WorldId);
export const worldPath = (id: WorldId) =>
	id === "corsair" ? "/" : `/worlds/${id}`;
export const studyPath = (id: WorldId, slug: string) =>
	`${id === "corsair" ? "" : worldPath(id)}/projects/${slug}`;
export const worldArt = (id: WorldId) =>
	id === "corsair" ? "/art/hero.webp" : `/worlds/${id}.webp`;
export const cardArt = (id: WorldId, art: string) =>
	id === "corsair" ? `/art/${art}.webp` : `/worlds/${id}-${art}.webp`;
