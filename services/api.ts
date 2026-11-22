type Env = Partial<
	Record<
		| "GITHUB_TOKEN"
		| "ASSISTANT_URL"
		| "ASSISTANT_API_KEY"
		| "ASSISTANT_QUERY_FIELD"
		| "RESEND_API_KEY"
		| "CONTACT_FROM"
		| "CONTACT_TO"
		| "PUBLIC_EMAIL"
		| "RESUME_URL",
		string
	>
>;
const json = (body: unknown, status = 200) =>
	Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rates = new Map<string, { count: number; expires: number }>();
function limited(req: Request, key: string, max: number) {
	const ip =
		req.headers.get("cf-connecting-ip") ||
		req.headers.get("x-vercel-forwarded-for")?.split(",")[0] ||
		"local";
	const id = key + ":" + ip,
		now = Date.now();
	if (rates.size > 3000)
		for (const [k, v] of rates) if (v.expires <= now) rates.delete(k);
	const bucket = rates.get(id);
	if (!bucket || bucket.expires <= now) {
		rates.set(id, { count: 1, expires: now + 60000 });
		return false;
	}
	return ++bucket.count > max;
}
type EventRecord = {
	id: string;
	type: string;
	repo: { name: string };
	created_at: string;
};
let cache: { until: number; events: unknown[] } | undefined;
async function activity(env: Env) {
	if (cache && cache.until > Date.now()) return json({ events: cache.events });
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"User-Agent": "CodeCorsairPortfolio",
	};
	if (env.GITHUB_TOKEN) headers.Authorization = "Bearer " + env.GITHUB_TOKEN;
	const res = await fetch(
		"https://api.github.com/users/AbdulHanan394/events/public?per_page=10",
		{ headers, signal: AbortSignal.timeout(7500) },
	);
	if (!res.ok) return json({ error: "GitHub activity is unavailable." }, 503);
	const titles: Record<string, string> = {
		PushEvent: "Pushed changes",
		CreateEvent: "Created a ref or repository",
		WatchEvent: "Starred a repository",
		IssuesEvent: "Issue activity",
		PullRequestEvent: "Pull request activity",
		ForkEvent: "Forked a repository",
		ReleaseEvent: "Release activity",
	};
	const events = ((await res.json()) as EventRecord[])
		.filter((e) => e?.repo?.name && e.created_at && e.id)
		.slice(0, 4)
		.map((e) => ({
			id: e.id,
			title:
				titles[e.type] ||
				e.type.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2"),
			repo: e.repo.name,
			url:
				"https://github.com/" +
				e.repo.name.split("/").map(encodeURIComponent).join("/"),
			date: e.created_at,
		}));
	cache = { until: Date.now() + 600000, events };
	return json({ events });
}
const mailReady = (env: Env) =>
	Boolean(env.CONTACT_FROM && env.CONTACT_TO && env.RESEND_API_KEY);
async function contact(data: Record<string, unknown>, env: Env) {
	if (clean(data.website)) return json({ error: "Submission rejected." }, 422);
	const name = clean(data.name),
		reply = clean(data.email),
		type = clean(data.projectType),
		message = clean(data.message);
	if (
		name.length < 2 ||
		name.length > 100 ||
		!email.test(reply) ||
		reply.length > 254 ||
		!["Web application", "AI system", "Backend engineering", "Other"].includes(
			type,
		) ||
		message.length < 10 ||
		message.length > 3000
	)
		return json(
			{
				error:
					"Check your name, email, project type, and message (10–3,000 characters).",
			},
			422,
		);
	if (!mailReady(env))
		return json(
			{
				error: "Email delivery is not connected. Please reach out on LinkedIn.",
			},
			503,
		);
	const r = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + env.RESEND_API_KEY,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: env.CONTACT_FROM,
			to: [env.CONTACT_TO],
			reply_to: reply,
			subject: "Portfolio inquiry · " + type,
			text: [name, reply, type, message].join("\n\n"),
		}),
		signal: AbortSignal.timeout(10000),
	});
	if (!r.ok)
		return json(
			{
				error:
					"The email provider could not accept this message. Please try again later.",
			},
			502,
		);
	const body = await r.json();
	return body.id
		? json({ accepted: true })
		: json({ error: "Delivery could not be confirmed." }, 502);
}
async function oracle(data: Record<string, unknown>, env: Env) {
	const question = clean(data.question);
	if (!question || question.length > 600)
		return json({ error: "Enter a question of up to 600 characters." }, 422);
	if (!env.ASSISTANT_URL)
		return json(
			{
				error:
					"The assistant is offline. Explore the profile questions instead.",
			},
			503,
		);
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (env.ASSISTANT_API_KEY) headers["x-api-key"] = env.ASSISTANT_API_KEY;
	const prior = Array.isArray(data.history)
		? data.history
				.slice(-6)
				.filter(
					(m) =>
						m &&
						(m.role === "user" || m.role === "assistant") &&
						typeof m.text === "string",
				)
				.map(
					(m) =>
						(m.role === "user" ? "Visitor" : "Assistant") +
						": " +
						m.text.slice(0, 1200),
				)
				.join("\n")
		: "";
	const query = prior ? prior + "\nVisitor: " + question : question;
	const r = await fetch(env.ASSISTANT_URL, {
		method: "POST",
		headers,
		body: JSON.stringify({ [env.ASSISTANT_QUERY_FIELD || "query"]: query }),
		signal: AbortSignal.timeout(20000),
	});
	if (!r.ok)
		return json({ error: "The assistant is temporarily unavailable." }, 502);
	const b = await r.json(),
		answer = [
			b.answer,
			b.content,
			b.response?.content,
			b.response?.answer,
			b.response,
		].find((v) => typeof v === "string" && v.trim());
	return answer
		? json({ answer: answer.slice(0, 12000) })
		: json({ error: "The assistant returned an unreadable response." }, 502);
}
export async function handleApi(req: Request, env: Env) {
	const path = new URL(req.url).pathname.replace(/\/$/, "");
	try {
		if (path === "/api/config" && req.method === "GET")
			return json({
				assistant: Boolean(env.ASSISTANT_URL),
				contact: mailReady(env),
				email: email.test(env.PUBLIC_EMAIL || "") ? env.PUBLIC_EMAIL : null,
				resume:
					env.RESUME_URL && /^(https:\/\/|\/(?!\/))/i.test(env.RESUME_URL)
						? env.RESUME_URL
						: null,
			});
		if (path === "/api/activity" && req.method === "GET")
			return await activity(env);
		if (path !== "/api/contact" && path !== "/api/oracle")
			return json({ error: "Unknown route." }, 404);
		if (req.method !== "POST") return json({ error: "Use POST." }, 405);
		const origin = req.headers.get("origin");
		if (origin && origin !== new URL(req.url).origin)
			return json({ error: "Origin mismatch." }, 403);
		if (!req.headers.get("content-type")?.includes("application/json"))
			return json({ error: "Expected JSON." }, 415);
		if (limited(req, path, path === "/api/contact" ? 5 : 12))
			return json(
				{ error: "Please wait one minute before trying again." },
				429,
			);
		const reader = req.body?.getReader();
		if (!reader) return json({ error: "Missing body." }, 400);
		const decoder = new TextDecoder();
		let size = 0,
			raw = "";
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			size += chunk.value.byteLength;
			if (size > 24000) {
				await reader.cancel();
				return json({ error: "Submission too large." }, 413);
			}
			raw += decoder.decode(chunk.value, { stream: true });
		}
		let data: Record<string, unknown>;
		try {
			data = JSON.parse(raw + decoder.decode());
		} catch {
			return json({ error: "Invalid JSON." }, 400);
		}
		if (!data || typeof data !== "object" || Array.isArray(data))
			return json({ error: "Expected an object." }, 400);
		return path === "/api/contact"
			? await contact(data, env)
			: await oracle(data, env);
	} catch {
		return json(
			{
				error: "The service could not complete this request. Please try again.",
			},
			503,
		);
	}
}
