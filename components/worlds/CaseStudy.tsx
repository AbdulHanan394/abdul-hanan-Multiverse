import { projects, type Project } from "@/content/profile";
import {
	worlds,
	worldPath,
	studyPath,
	cardArt,
	type WorldId,
} from "@/content/worlds";
import { BookOpen } from "lucide-react";
import WorldIcon from "./WorldIcon";
export default function CaseStudy({
	project: p,
	id,
}: {
	project: Project;
	id: WorldId;
}) {
	const w = worlds[id],
		next = projects[(projects.indexOf(p) + 1) % projects.length];
	return (
		<main id="main">
			<section
				className="study-hero edition-study"
				style={{
					backgroundImage: `linear-gradient(90deg,rgba(5,12,14,.97),rgba(5,12,14,.66) 50%,rgba(5,12,14,.12)),url(${cardArt(id, p.art)})`,
				}}
			>
				<div className="wrap">
					<a className="text-link" href={worldPath(id) + "#fleet"}>
						<WorldIcon id={id} size={17} />
						{id === "corsair" ? "Back to the fleet" : w.projects}
					</a>
					<p className="eyebrow">
						<BookOpen size={15} /> Case study · {p.category}
					</p>
					<h1>{p.title}</h1>
					<p>{p.summary}</p>
				</div>
			</section>
			<div className="wrap study-body">
				<aside>
					<span className="eyebrow">
						<WorldIcon id={id} size={15} /> Technology stack
					</span>
					<div className="tags">
						{p.stack.map((t) => (
							<span key={t}>{t}</span>
						))}
					</div>
				</aside>
				<article>
					<h2>Architecture</h2>
					<p>{p.architecture}</p>
					<ol className="flow">
						{p.flow.map((f) => (
							<li key={f}>{f}</li>
						))}
					</ol>
					<h2>The engineering challenge</h2>
					<p>{p.challenge}</p>
					<h2>The solution</h2>
					<p>{p.solution}</p>
					<a className="btn ghost" href={studyPath(id, next.slug)}>
						<WorldIcon id={id} size={16} /> Next project · {next.title}
					</a>
				</article>
			</div>
		</main>
	);
}
