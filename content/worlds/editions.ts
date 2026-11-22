import type { WorldId } from ".";

export const editions = {
	orbital: {
		intro:
			"I build AI systems that can find a useful answer in a long history of work. Abdul Core is my mission log turned into a working assistant.",
		featured: "abdul-core",
	},
	frontier: {
		intro:
			"I build the software behind a working dispatch desk. At Buraq Dispatches, my job was to take a carrier from a first visit through onboarding.",
		featured: "buraq-dispatches",
	},
	marvel: {
		intro:
			"My origin story starts with a webcam and a study session. For FocusSpark, I brought computer vision, document chat and quizzes into one app.",
		featured: "focusspark",
	},
	neon: {
		intro:
			"Follow a request through my stack. In Abdul Core, I connect the chat interface to a FastAPI service and a searchable memory of my work.",
		featured: "abdul-core",
	},
	abyss: {
		intro:
			"I like working below the interface. In FocusSpark, I used head pose and eye landmarks to help students look back at a study session.",
		featured: "focusspark",
	},
	clockwork: {
		intro:
			"I build web apps where each part has a job. For JB Easy Moving, I connected service pages, address search and customer inquiries.",
		featured: "jb-easy-moving",
	},
	alpine: {
		intro:
			"I build software that helps someone take the next step. For JB Easy Moving, that meant turning two locations on a map into a moving inquiry.",
		featured: "jb-easy-moving",
	},
} satisfies Record<
	Exclude<WorldId, "corsair">,
	{ intro: string; featured: string }
>;
