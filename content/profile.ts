export const socials = {
	GitHub: "https://github.com/AbdulHanan394",
	LinkedIn: "https://www.linkedin.com/in/abdulhanan394/",
	X: "https://x.com/AbdulHanan394",
};
export const destinations = [
	["arrival", "Arrival"],
	["fleet", "The Fleet"],
	["captain", "The Captain"],
	["arsenal", "The Arsenal"],
	["voyage", "The Voyage"],
	["chronicle", "The Chronicle"],
	["oracle", "The Oracle"],
	["contact", "Send a Raven"],
] as const;
export interface Project {
	slug: string;
	title: string;
	category: string;
	art: string;
	landmark: string;
	summary: string;
	stack: string[];
	architecture: string;
	challenge: string;
	solution: string;
	flow: string[];
}
export const projects: Project[] = [
	{
		slug: "abdul-core",
		title: "Abdul Core",
		category: "AI Engineering",
		art: "core",
		landmark: "The Observatory",
		summary:
			"A personal AI assistant that connects a conversation to a searchable memory of engineering work.",
		stack: [
			"Next.js",
			"FastAPI",
			"PostgreSQL",
			"ChromaDB",
			"Sentence Transformers",
			"Gemini",
			"Ollama",
			"Docker",
		],
		architecture:
			"Scheduled collectors bring public activity into a FastAPI pipeline. PostgreSQL holds structured records. Sentence Transformers encodes text for retrieval from ChromaDB, and a Next.js chat interface presents the answer.",
		challenge:
			"A short conversation window loses context as a project evolves. Personal history also arrives in different formats, which makes retrieval uneven.",
		solution:
			"Normalize activity before indexing it, keep recent turns close to the conversation, and retrieve relevant history for each question. The frontend calls a server-side proxy that keeps the backend credential private.",
		flow: [
			"Collect activity",
			"Normalize & index",
			"Retrieve context",
			"Compose answer",
		],
	},
	{
		slug: "focusspark",
		title: "FocusSpark",
		category: "AI & Education",
		art: "focus",
		landmark: "The Lighthouse",
		summary:
			"A study companion that brings focus detection, document chat, flashcards, and quizzes into one learning space.",
		stack: [
			"React",
			"FastAPI",
			"PostgreSQL",
			"OpenCV",
			"MediaPipe",
			"DeepFace",
		],
		architecture:
			"A React study interface connects to a FastAPI backend. Computer vision components use head pose and eye landmarks as signals during a session. PostgreSQL supports structured learning records.",
		challenge:
			"A frame from a webcam gives only a partial picture of attention. A student also needs practical ways to work with the material they are studying.",
		solution:
			"Pair session-level focus signals with document interaction, flashcards, quizzes, and study analytics. Each feature gives the learner a different way to revisit the same material.",
		flow: [
			"Study session",
			"Observe focus signals",
			"Work with documents",
			"Review learning",
		],
	},
	{
		slug: "buraq-dispatches",
		title: "Buraq Dispatches",
		category: "Logistics Platform",
		art: "buraq",
		landmark: "The Trading Port",
		summary:
			"A carrier-facing dispatch platform that brings service discovery and carrier onboarding into one workflow.",
		stack: ["React", "Node.js", "Express", "MongoDB"],
		architecture:
			"A React frontend presents dispatch services and guides carriers through setup. Node.js and Express provide the backend layer for the MERN application.",
		challenge:
			"A prospective carrier needs to understand the dispatch offering and submit onboarding information through the same website.",
		solution:
			"Connect service information to a dedicated carrier setup flow, with clearly separated form inputs and supporting document handling.",
		flow: [
			"Explore services",
			"Start carrier setup",
			"Provide details",
			"Submit inquiry",
		],
	},
	{
		slug: "jb-easy-moving",
		title: "JB Easy Moving LLC",
		category: "Full Stack Development",
		art: "moving",
		landmark: "The Merchant Harbor",
		summary:
			"A moving company website with dedicated service pages, location search, and a direct inquiry flow.",
		stack: ["React", "Tailwind CSS", "React Router", "EmailJS", "Nominatim"],
		architecture:
			"React Router organizes service pages. Tailwind handles responsive layouts, Nominatim supports location autocomplete, and EmailJS connects inquiries to the business.",
		challenge:
			"Visitors planning a move need to describe their route and reach the right service from a phone.",
		solution:
			"Provide distinct service routes, a mobile menu, location suggestions, and an inquiry form within the same experience.",
		flow: [
			"Find a service",
			"Search locations",
			"Describe the move",
			"Send an inquiry",
		],
	},
];
export const logbook = [
	[
		"Engineering philosophy",
		"Build a clear path from a real problem to a working product. For me, that means giving the interface, the API, and the data model equal attention.",
	],
	[
		"Technical specialization",
		"I build full-stack web applications and AI systems. My recent work connects retrieval, language models, and computer vision to interfaces people can use.",
	],
	[
		"Education",
		"BS Software Engineering, University of Central Punjab. My background spans software architecture, databases, machine learning, and human–computer interaction.",
	],
	[
		"What drives the work",
		"I like software that helps someone take a concrete next step, whether that is reviewing a study session, finding a moving service, or asking a question about earlier work.",
	],
	[
		"Solving difficult problems",
		"Trace the request from the interface to the stored data. Check what each boundary receives and returns, then test the complete user journey.",
	],
];
export const arsenal = [
	{
		title: "Frontend",
		artifact: "The Navigator’s Compass",
		tools: [
			"React",
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"JavaScript",
			"HTML5",
			"CSS3",
		],
		note: "Responsive interfaces, routing, forms, and conversational experiences.",
		project: 3,
	},
	{
		title: "Backend",
		artifact: "The Engine Room",
		tools: [
			"Node.js",
			"Express",
			"FastAPI",
			"Python",
			"REST APIs",
			"Authentication",
		],
		note: "Typed API boundaries and server-side integrations.",
		project: 0,
	},
	{
		title: "Databases",
		artifact: "The Treasure Vault",
		tools: ["PostgreSQL", "MongoDB", "ChromaDB"],
		note: "Structured application records and semantic retrieval.",
		project: 0,
	},
	{
		title: "AI Engineering",
		artifact: "The Celestial Observatory",
		tools: [
			"LLMs",
			"RAG",
			"Sentence Transformers",
			"Gemini",
			"Ollama",
			"OpenCV",
			"MediaPipe",
			"DeepFace",
		],
		note: "Retrieval pipelines, conversational assistants, and computer vision.",
		project: 1,
	},
	{
		title: "DevOps",
		artifact: "The Shipyard",
		tools: ["Docker", "Docker Compose", "GitHub Actions", "Nginx"],
		note: "Containerized services and reproducible development environments.",
		project: 0,
	},
	{
		title: "Tools",
		artifact: "The Captain’s Instruments",
		tools: ["Git", "GitHub", "Location search", "EmailJS"],
		note: "Source control and integrations that connect the interface to a real workflow.",
		project: 3,
	},
];
export const milestones = [
	[
		"Education",
		"University of Central Punjab",
		"BS Software Engineering. Foundations in architecture, databases, and machine learning.",
	],
	[
		"Client work",
		"Buraq Dispatches",
		"Full-stack development for carrier onboarding and dispatch services.",
	],
	[
		"Client work",
		"JB Easy Moving LLC",
		"Service discovery, location search, and an inquiry flow for a moving business.",
	],
	[
		"Final-year project",
		"FocusSpark",
		"An AI learning assistant combining computer vision and document-based study.",
	],
	[
		"Personal project",
		"Abdul Core",
		"A personal knowledge system with contextual retrieval and conversational access.",
	],
];
export const questions = [
	["How does Abdul Core remember context?", projects[0].solution],
	["What did Abdul build for FocusSpark?", projects[1].architecture],
	[
		"Which backend technologies does Abdul use?",
		"My backend work includes Node.js, Express, Python, and FastAPI. Abdul Core uses PostgreSQL for structured data and ChromaDB for vector retrieval.",
	],
	["Where did Abdul study?", logbook[2][1]],
];
