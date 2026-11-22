"use client";
import { useEffect, useState } from "react";
import {
	BookOpen,
	Check,
	Layers,
	RotateCw,
	Search,
	TicketCheck,
} from "lucide-react";
import { projects } from "@/content/profile";
import { worlds, cardArt, studyPath, type WorldId } from "@/content/worlds";
import { editions } from "@/content/worlds/editions";
import WorldIcon from "./WorldIcon";

function MemorySearch() {
	const [query, setQuery] = useState(""),
		[term, setTerm] = useState<string | null>(null);
	const words = term?.toLowerCase().match(/[a-z0-9]+/g) ?? [];
	const results = projects
		.map((p) => {
			const record = [p.title, p.summary, p.architecture, ...p.stack]
				.join(" ")
				.toLowerCase();
			return { p, score: words.filter((w) => record.includes(w)).length };
		})
		.filter((r) => r.score > 0)
		.sort((a, b) => b.score - a.score);
	return (
		<>
			<h4>Search my project notes</h4>
			<p>Try a tool like OpenCV, ChromaDB or React.</p>
			<form
				className="demo-inputs"
				onSubmit={(e) => {
					e.preventDefault();
					setTerm(query.trim());
				}}
			>
				<input
					aria-label="Search project notes"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search by tool or project"
					required
					maxLength={80}
				/>
				<button>
					<Search size={16} />
					Search
				</button>
			</form>
			<div className="demo-output" role="status">
				{term &&
					(results.length ? (
						<>
							<strong>{results[0].p.title}</strong>
							<p>{results[0].p.architecture}</p>
						</>
					) : (
						"No matching note. Try another project or tool."
					))}
			</div>
		</>
	);
}
const cards = [
	[
		"What two signals does FocusSpark use during a study session?",
		"Head pose and eye landmarks from webcam frames.",
	],
	[
		"How can a student revisit a document?",
		"Ask questions about it, review flashcards and take a quiz.",
	],
	[
		"Where does FocusSpark store structured study records?",
		"PostgreSQL holds the session’s structured learning records.",
	],
];
function Flashcards() {
	const [index, setIndex] = useState(0),
		[flipped, setFlipped] = useState(false);
	return (
		<>
			<h4>Try a study card</h4>
			<button
				type="button"
				className="study-flip"
				onClick={() => setFlipped(!flipped)}
				aria-label={flipped ? "Show question" : "Reveal answer"}
			>
				<span key={index + "-" + flipped}>
					<small>
						{flipped ? "Answer" : "Question"} · {index + 1}/{cards.length}
					</small>
					<strong>{cards[index][Number(flipped)]}</strong>
					<em>
						<RotateCw size={14} />
						{flipped ? "Show question" : "Reveal answer"}
					</em>
				</span>
			</button>
			<button
				type="button"
				className="demo-next"
				onClick={() => {
					setIndex((index + 1) % cards.length);
					setFlipped(false);
				}}
			>
				Next card
			</button>
		</>
	);
}
const steps = [
	"Choose dispatch service",
	"Review carrier information",
	"Attach sample document",
];
function CarrierSetup() {
	const [checked, setChecked] = useState<string[]>([]),
		[ready, setReady] = useState(false);
	return (
		<>
			<h4>Assemble a sample carrier packet</h4>
			<div className="packet-steps">
				{steps.map((s) => (
					<label key={s}>
						<input
							type="checkbox"
							checked={checked.includes(s)}
							onChange={(e) => {
								setReady(false);
								setChecked(
									e.target.checked
										? [...checked, s]
										: checked.filter((v) => v !== s),
								);
							}}
						/>
						{s}
					</label>
				))}
			</div>
			<button
				disabled={checked.length !== 3 || ready}
				onClick={() => setReady(true)}
			>
				<TicketCheck size={16} />
				Preview packet
			</button>
			<p role="status" className="demo-output">
				{ready
					? "Your sample packet is ready for dispatch review."
					: checked.length + " of 3 items ready"}
			</p>
		</>
	);
}
function MovePlanner() {
	const [from, setFrom] = useState(""),
		[to, setTo] = useState(""),
		[result, setResult] = useState("");
	return (
		<>
			<h4>Build a moving inquiry</h4>
			<p>Choose two stops to preview a customer’s request.</p>
			<form
				className="move-form"
				onSubmit={(e) => {
					e.preventDefault();
					setResult(
						from === to
							? "Choose different pickup and delivery locations."
							: `Pickup at ${from}. Delivery to ${to}. Your sample inquiry is ready for a mover to review.`,
					);
				}}
			>
				{(["Pickup", "Delivery"] as const).map((label, i) => (
					<label key={label}>
						{label}
						<select
							required
							value={i ? to : from}
							onChange={(e) => {
								(i ? setTo : setFrom)(e.target.value);
								setResult("");
							}}
						>
							<option value="">Select a stop</option>
							{[
								"Downtown apartment",
								"Westside office",
								"Northside storage",
							].map((o) => (
								<option key={o}>{o}</option>
							))}
						</select>
					</label>
				))}
				<button>Preview inquiry</button>
			</form>
			<p className="demo-output" role="status">
				{result}
			</p>
		</>
	);
}
const demos: Record<string, () => React.JSX.Element> = {
	"abdul-core": MemorySearch,
	focusspark: Flashcards,
	"buraq-dispatches": CarrierSetup,
	"jb-easy-moving": MovePlanner,
};
export default function ProjectStudio({
	id,
}: {
	id: Exclude<WorldId, "corsair">;
}) {
	const initial = editions[id].featured;
	const [slug, setSlug] = useState<string>(initial);
	useEffect(() => {
		const sync = () => {
			const found = projects.find((p) => location.hash === "#demo-" + p.slug);
			if (found) setSlug(found.slug);
		};
		sync();
		window.addEventListener("hashchange", sync);
		return () => window.removeEventListener("hashchange", sync);
	}, [id]);
	function select(next: string) {
		setSlug(next);
		history.replaceState(history.state, "", "#demo-" + next);
	}
	return (
		<section className="section world-work project-studio" id="fleet">
			<div className="wrap">
				<div className="section-head">
					<div>
						<p className="eyebrow">
							<WorldIcon id={id} size={16} />
							{worlds[id].projects}
						</p>
						<h2>Inside my projects</h2>
					</div>
					<a href="#instrument" className="text-link">
						<Layers size={16} />
						Project finder
					</a>
				</div>
				<div className="studio-targets">
					{projects.map((p) => (
						<span key={p.slug} id={"demo-" + p.slug} />
					))}
				</div>
				<div
					className="project-picker"
					role="group"
					aria-label="Choose a project demo"
				>
					{projects.map((p) => (
						<button
							key={p.slug}
							aria-pressed={p.slug === slug}
							aria-controls={"studio-" + p.slug}
							onClick={() => select(p.slug)}
						>
							<img alt="" src={cardArt(id, p.art)} loading="lazy" />
							<strong>{p.title}</strong>
							{p.slug === slug && <Check size={14} />}
						</button>
					))}
				</div>
				{projects.map((p) => {
					const Demo = demos[p.slug];
					return (
						<article
							key={p.slug}
							hidden={p.slug !== slug}
							id={"studio-" + p.slug}
							className="project-panel"
						>
							<div className="project-plate">
								<img src={cardArt(id, p.art)} alt="" loading="lazy" />
								<div>
									<small>{p.category}</small>
									<h3>{p.title}</h3>
									<p>{p.summary}</p>
									<a href={studyPath(id, p.slug)}>
										<BookOpen size={16} />
										Read case study
									</a>
								</div>
							</div>
							<div className="project-prototype">
								<small className="eyebrow">Interactive sample</small>
								{p.slug === slug && <Demo />}
								<div className="prototype-tools">
									{p.stack.slice(0, 4).map((t) => (
										<span key={t}>{t}</span>
									))}
								</div>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}
