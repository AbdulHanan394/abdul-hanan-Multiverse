"use client";
import { useEffect, useState } from "react";
import { BookOpen, GitBranch, RotateCw } from "lucide-react";
import { worlds, type WorldId } from "@/content/worlds";
import { socials } from "@/content/profile";
interface EventRow {
	id: string;
	title: string;
	url: string;
	date: string;
	repo: string;
}
export default function Chronicle({ world = "corsair" }: { world?: WorldId }) {
	const [rows, setRows] = useState<EventRow[]>([]),
		[state, setState] = useState("loading"),
		[attempt, setAttempt] = useState(0);
	useEffect(() => {
		const abort = new AbortController();
		setState("loading");
		fetch("/api/activity", {
			signal: abort.signal,
			cache: attempt ? "reload" : "default",
		})
			.then(async (res) => {
				if (!res.ok) throw Error();
				const data = await res.json();
				setRows(data.events);
				setState("ready");
			})
			.catch(() => {
				if (!abort.signal.aborted) setState("error");
			});
		return () => abort.abort();
	}, [attempt]);
	return (
		<section id="chronicle" className="section">
			<div className="wrap">
				<div className="section-head">
					<div>
						<p className="eyebrow">
							<BookOpen size={16} /> Development activity
						</p>
						<h2>
							{worlds[world].log}
							<span className="period">.</span>
						</h2>
					</div>
					<a className="text-link" href={socials.GitHub}>
						View GitHub profile
					</a>
				</div>
				<div className="activity" aria-live="polite">
					{state === "loading" ? (
						<p>Reading the public GitHub log…</p>
					) : state === "error" ? (
						<div className="status-row">
							<p>GitHub activity is temporarily unavailable.</p>
							<button
								type="button"
								className="text-btn"
								onClick={() => setAttempt(attempt + 1)}
							>
								<RotateCw size={15} /> Retry
							</button>
						</div>
					) : rows.length ? (
						rows.map((r) => (
							<a key={r.id} href={r.url}>
								<GitBranch size={18} />
								<span>
									<strong>{r.title}</strong>
									<small>{r.repo}</small>
								</span>
								<time dateTime={r.date}>
									{new Date(r.date).toLocaleDateString("en-GB", {
										day: "numeric",
										month: "short",
										year: "numeric",
										timeZone: "UTC",
									})}
								</time>
							</a>
						))
					) : (
						<p>
							No recent public events are available. Browse the repositories on
							GitHub.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
