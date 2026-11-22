import type { WorldId } from "@/content/worlds";

export const games = {
	corsair: {
		name: "Smuggler’s Run",
		genre: "Navigation",
		pitch: "Two caches, a reef pass and one tide to reach the harbor.",
		rules:
			"Tap a neighboring sea tile to sail one square. Collect both gold caches and reach the anchor within 14 moves.",
	},
	orbital: {
		name: "Soft Landing",
		genre: "Flight simulator",
		pitch: "A quiet moon. A small fuel tank. One chance to touch down.",
		rules:
			"Each turn, coast to gain 1 m/s or burn one fuel to shed 1 m/s. Land at 2 m/s or slower. Your instruments update after each command.",
	},
	frontier: {
		name: "Pony Express",
		genre: "Reaction race",
		pitch: "Three mailbags. Three riders. Catch the handoff on the bell.",
		rules:
			"Wait for the station bell, then pass the mailbag as fast as you can. An early pass adds a full second to your time.",
	},
	marvel: {
		name: "Panels Out of Time",
		genre: "Comic puzzle",
		pitch:
			"A reality glitch shuffled the pages. Put three rescues back in order.",
		rules:
			"Tap captions in story order. Tap a placed caption to take it back. Print the page to check your sequence.",
	},
	neon: {
		name: "Packet Runner",
		genre: "Arcade survival",
		pitch:
			"Ride the circuit and collect five packets before your trail closes in.",
		rules:
			"Steer with the arrow pad or arrow keys. Collect glowing packets, avoid the walls and your own trail. The runner moves on its own.",
	},
	abyss: {
		name: "Black Box Echo",
		genre: "Sonar deduction",
		pitch: "A recorder is still transmitting somewhere on the ocean floor.",
		rules:
			"Ping a square. Its number gives the distance to the recorder in horizontal and vertical steps combined. Find it within six pings.",
	},
	clockwork: {
		name: "The Midnight Lock",
		genre: "Mechanical puzzle",
		pitch: "Three coupled dials guard the workshop. Bring every hand to XII.",
		rules:
			"Turn a crown to move its hand clockwise by a quarter turn. The next hand turns with it. The rightmost crown turns only its own hand.",
	},
	alpine: {
		name: "Last Light Ascent",
		genre: "Expedition strategy",
		pitch:
			"The summit is ten pitches up. Decide when to climb and when to anchor.",
		rules:
			"Roll to climb 1–3 pitches. A storm sends you back to your last anchor. Place either of your two anchors to bank progress. Reach pitch 10 before a third storm.",
	},
} satisfies Record<
	WorldId,
	{ name: string; genre: string; pitch: string; rules: string }
>;

export type Result = { won: boolean; message: string };
export type GameProps = { finish: (result: Result) => void };
export const randomInt = (max: number) => Math.floor(Math.random() * max);
