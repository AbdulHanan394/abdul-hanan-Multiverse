// Verify the exact deployable Worker. Provider calls use local fixtures.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const source = await readFile("dist/server/index.js");
const { default: worker } = await import(
	"data:text/javascript;base64," + source.toString("base64")
);
const origin = "https://portfolio.test";
let passed = 0;
function check(value, message) {
	assert.ok(value, message);
	passed++;
}
const request = (path, env = {}, body, headers = {}) =>
	worker.fetch(
		new Request(
			origin + path,
			body === undefined
				? {}
				: {
						method: "POST",
						headers: { "Content-Type": "application/json", ...headers },
						body: JSON.stringify(body),
					},
		),
		env,
	);
const checkedScripts = new Set();
async function verifyPageScripts(html) {
	for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
		const url = match[1];
		if (!url.startsWith("/_next/static/") || checkedScripts.has(url)) continue;
		const response = await request(url);
		check(
			response.ok &&
				response.headers.get("Content-Type")?.includes("javascript"),
			"script " + url,
		);
		checkedScripts.add(url);
	}
}
const home = await request("/"),
	html = await home.text();
await verifyPageScripts(html);
check(home.status === 200 && html.includes("Abdul Hanan"), "home");
function verifyArcade(page, id) {
	check(
		page.includes('id="play"') &&
			page.includes('href="#play"') &&
			page.includes('data-game="' + id + '"') &&
			page.includes("Start game"),
		"playable entry " + id,
	);
}
verifyArcade(html, "corsair");
for (const id of [
	"fleet",
	"captain",
	"arsenal",
	"voyage",
	"chronicle",
	"oracle",
	"contact",
])
	check(html.includes('id="' + id + '"'), id);
for (const slug of [
	"abdul-core",
	"focusspark",
	"buraq-dispatches",
	"jb-easy-moving",
]) {
	const r = await request("/projects/" + slug);
	const body = await r.text();
	await verifyPageScripts(body);
	check(r.ok && body.includes("The engineering challenge"), slug);
}
for (const path of new Set(
	[
		...html.matchAll(/(?:src|href)="(\/(?:_next\/static|art|fonts)\/[^"]+)"/g),
	].map((m) => m[1]),
)) {
	check((await request(path)).ok, path);
}
check(
	(await request("/art/hero.webp")).headers.get("Content-Type") ===
		"image/webp",
	"hero",
);
check((await request("/missing-page")).status === 404, "404");
check(
	(await (await request("/sitemap.xml")).text()).includes(
		"/projects/focusspark",
	),
	"sitemap",
);
for (const id of [
	"orbital",
	"frontier",
	"marvel",
	"neon",
	"abyss",
	"clockwork",
	"alpine",
]) {
	const path = "/worlds/" + id,
		page = await request(path),
		text = await page.text();
	await verifyPageScripts(text);
	verifyArcade(text, id);
	check(
		text.includes('class="edition-name">Abdul <span>Hanan</span>') &&
			text.includes("Full-stack developer") &&
			text.indexOf('id="fleet"') < text.indexOf('id="play"'),
		"portfolio identity and order " + id,
	);
	for (const slug of [
		"focusspark",
		"abdul-core",
		"buraq-dispatches",
		"jb-easy-moving",
	])
		check(
			text.includes('id="demo-' + slug + '"') &&
				text.includes('id="studio-' + slug + '"'),
			"project demo " + id + "/" + slug,
		);
	check(
		page.ok &&
			text.includes('data-world="' + id + '"') &&
			text.includes('id="instrument"'),
		path,
	);
	check(
		(await request(path + ".webp")).headers.get("Content-Type") ===
			"image/webp",
		id + " art",
	);
	for (const slug of [
		"abdul-core",
		"focusspark",
		"buraq-dispatches",
		"jb-easy-moving",
	]) {
		const route = path + "/projects/" + slug,
			study = await request(route),
			body = await study.text();
		await verifyPageScripts(body);
		check(
			study.ok &&
				body.includes('data-world="' + id + '"') &&
				body.includes("The engineering challenge") &&
				text.includes('href="' + route + '"'),
			route,
		);
	}
	for (const asset of ["thumb", "core", "focus", "buraq", "moving"])
		check(
			(await request(path + "-" + asset + ".webp")).headers.get(
				"Content-Type",
			) === "image/webp",
			id + " " + asset,
		);
}
const missingChunk = await request("/_next/static/chunks/does-not-exist.js");
check(
	missingChunk.status === 404 &&
		missingChunk.headers.get("Cache-Control") === "no-store",
	"missing chunk cache",
);
const config = await (await request("/api/config")).json();
check(!config.contact && !config.assistant, "empty configuration");
const message = {
	name: "Test visitor",
	email: "visitor@example.com",
	message: "A portfolio integration test.",
	projectType: "AI system",
};
check(
	(await request("/api/contact", {}, message)).status === 503,
	"offline contact",
);
check(
	(await request("/api/contact", {}, { ...message, email: "invalid" }))
		.status === 422,
	"address validation",
);
check(
	(await request("/api/contact", {}, { ...message, website: "spam" }))
		.status === 422,
	"honeypot",
);
check(
	(await request("/api/contact", {}, message, { Origin: "https://other.test" }))
		.status === 403,
	"origin validation",
);
check(
	(await request("/api/oracle", {}, { question: "What is Abdul Core?" }))
		.status === 503,
	"offline assistant",
);
const original = globalThis.fetch;
try {
	globalThis.fetch = async (_url, init) => {
		check(
			new Headers(init.headers).get("x-api-key") === "fixture",
			"server credential",
		);
		check(JSON.parse(init.body).query.includes("Projects"), "query adapter");
		return Response.json({ response: { content: "Test response" } });
	};
	check(
		(
			await (
				await request(
					"/api/oracle",
					{
						ASSISTANT_URL: "https://assistant.test/query",
						ASSISTANT_API_KEY: "fixture",
					},
					{ question: "Projects?" },
				)
			).json()
		).answer === "Test response",
		"assistant response",
	);
	const mail = {
		CONTACT_FROM: "Sender <dev@example.com>",
		CONTACT_TO: "inbox@example.com",
		RESEND_API_KEY: "fixture",
	};
	globalThis.fetch = async () => Response.json({ id: "test" });
	check(
		(await (await request("/api/contact", mail, message)).json()).accepted ===
			true,
		"provider acceptance",
	);
	globalThis.fetch = async () => new Response(null, { status: 503 });
	check(
		(await request("/api/contact", mail, message)).status === 502,
		"provider failure",
	);
	check(
		(await request("/api/contact", mail, message)).status === 429,
		"per-instance limit",
	);
	check((await request("/api/activity")).status === 503, "GitHub unavailable");
	let calls = 0;
	globalThis.fetch = async () => {
		calls++;
		return Response.json([]);
	};
	check(
		(await (await request("/api/activity")).json()).events.length === 0,
		"no public events",
	);
	await request("/api/activity");
	check(calls === 1, "GitHub cache");
} finally {
	globalThis.fetch = original;
}
console.log(passed + " production artifact checks passed.");
