"use client";
import { worlds, type WorldId } from "@/content/worlds";
import WorldIcon from "./worlds/WorldIcon";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
import { Orbit, RotateCcw, Send } from "lucide-react";
import { questions } from "@/content/profile";
import useConfig from "./useConfig";
import CompassRose from "./CompassRose";
const Stars = dynamic(() => import("./Stars"), { ssr: false });
class SceneBoundary extends Component<
	{ children: React.ReactNode },
	{ failed: boolean }
> {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	render() {
		return this.state.failed ? <CompassRose marked /> : this.props.children;
	}
}
type Message = { id: string; role: "user" | "assistant"; text: string };
export default function Oracle({ world = "corsair" }: { world?: WorldId }) {
	const cfg = useConfig(),
		[msgs, setMsgs] = useState<Message[]>([]),
		[draft, setDraft] = useState(""),
		[busy, setBusy] = useState(false),
		[error, setError] = useState("");
	const region = useRef<HTMLDivElement>(null),
		history = useRef<HTMLDivElement>(null),
		request = useRef<AbortController | null>(null),
		[rich, setRich] = useState(false);
	useEffect(() => {
		let visible = false;
		const motion = matchMedia("(prefers-reduced-motion:reduce)");
		const sync = () =>
			setRich(
				visible &&
					!motion.matches &&
					document.documentElement.dataset.quality === "Ultra" &&
					typeof WebGL2RenderingContext !== "undefined",
			);
		const obs = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			sync();
		});
		if (region.current) obs.observe(region.current);
		const mut = new MutationObserver(sync);
		mut.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-quality"],
		});
		motion.addEventListener("change", sync);
		return () => {
			obs.disconnect();
			mut.disconnect();
			motion.removeEventListener("change", sync);
			request.current?.abort();
		};
	}, []);
	useEffect(() => {
		if (history.current && msgs.length)
			history.current.scrollTop = history.current.scrollHeight;
	}, [msgs]);
	function reset() {
		request.current?.abort();
		request.current = null;
		setBusy(false);
		setMsgs([]);
		setDraft("");
		setError("");
	}
	async function ask(q: string, answer?: string) {
		if (!q.trim() || busy) return;
		setError("");
		setDraft("");
		const next: Message[] = [
			...msgs,
			{ id: crypto.randomUUID(), role: "user", text: q },
		];
		setMsgs(next);
		if (!cfg?.assistant) {
			if (answer)
				setMsgs([
					...next,
					{ id: crypto.randomUUID(), role: "assistant", text: answer },
				]);
			return;
		}
		setBusy(true);
		const abort = new AbortController();
		request.current = abort;
		try {
			const r = await fetch("/api/oracle", {
				method: "POST",
				signal: abort.signal,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question: q, history: msgs.slice(-6) }),
			});
			const data = await r.json();
			if (!r.ok) throw Error(data.error);
			setMsgs([
				...next,
				{ id: crypto.randomUUID(), role: "assistant", text: data.answer },
			]);
		} catch (e) {
			if (!abort.signal.aborted)
				setError(
					e instanceof Error ? e.message : "The assistant is unavailable.",
				);
		} finally {
			if (request.current === abort) {
				setBusy(false);
				request.current = null;
			}
		}
	}
	return (
		<section id="oracle" className="section oracle">
			<div className="wrap split">
				<div>
					<p className="eyebrow">
						<Orbit size={16} />{" "}
						{world === "corsair"
							? "The celestial observatory"
							: "Profile explorer"}
					</p>
					<h2>
						{world === "corsair" ? (
							<>
								Ask the <em>Oracle.</em>
							</>
						) : (
							worlds[world].oracle
						)}
					</h2>
					<p className="deck">Discover the mind behind the machinery.</p>
					<div ref={region} className="orrery" aria-hidden="true">
						{world !== "corsair" ? (
							<WorldIcon id={world} size={100} />
						) : rich ? (
							<SceneBoundary>
								<Stars />
							</SceneBoundary>
						) : (
							<CompassRose marked />
						)}
					</div>
				</div>
				<div className="oracle-console">
					<div className="console-head">
						<span>
							{cfg?.assistant
								? "Connected assistant"
								: "Static profile explorer"}
						</span>
						<button
							type="button"
							className="icon-btn"
							aria-label="Reset conversation"
							onClick={reset}
						>
							<RotateCcw size={16} />
						</button>
					</div>
					<p>
						{cfg?.assistant
							? "Ask about my projects, skills, and engineering work."
							: "Choose a question to read an answer from my portfolio."}
					</p>
					<div className="question-list">
						{questions.map(([q, a]) => (
							<button
								type="button"
								key={q}
								disabled={busy}
								onClick={() => ask(q, a)}
							>
								{q}
							</button>
						))}
					</div>
					<div className="messages" ref={history} role="log" aria-live="polite">
						{msgs.map((m) => (
							<p key={m.id}>
								<b>
									{m.role === "user"
										? "You"
										: cfg?.assistant
											? "Oracle"
											: "Profile notes"}
								</b>
								{m.text}
							</p>
						))}
						{busy && <p>Consulting the Oracle…</p>}
					</div>
					{error && <p role="alert">{error}</p>}
					{cfg?.assistant && (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								void ask(draft);
							}}
						>
							<label className="sr-only" htmlFor="ask">
								Your question
							</label>
							<input
								id="ask"
								required
								maxLength={600}
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								placeholder="Ask about a project…"
							/>
							<button type="submit" aria-label="Send question" disabled={busy}>
								<Send size={18} />
							</button>
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
