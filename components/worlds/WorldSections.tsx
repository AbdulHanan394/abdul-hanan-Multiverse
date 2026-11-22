import { arsenal, logbook, milestones, projects } from "@/content/profile";
import { studyPath, worlds, type WorldId } from "@/content/worlds";
import { ChevronDown } from "lucide-react";
import WorldIcon from "./WorldIcon";
export function WorldProfile({ id }: { id: WorldId }) {
	const w = worlds[id];
	return (
		<>
			<section id="captain" className="section world-bio">
				<div className="wrap split">
					<div>
						<p className="eyebrow">
							<WorldIcon id={id} size={16} /> About Abdul
						</p>
						<h2>Meet the engineer</h2>
						<p className="deck">
							I’m Abdul, a software engineering graduate from the University of
							Central Punjab. I’ve built carrier onboarding for Buraq
							Dispatches, a moving inquiry flow for JB Easy Moving, and AI tools
							for learning and personal memory.
						</p>
					</div>
					<div className="world-notes">
						{logbook.map(([title, body], i) => (
							<details key={title} name="profile-notes" open={i === 0}>
								<summary>
									{title}
									<ChevronDown size={16} />
								</summary>
								<p>{body}</p>
							</details>
						))}
					</div>
				</div>
			</section>
			<section id="arsenal" className="section world-skills">
				<div className="wrap">
					<p className="eyebrow">
						<WorldIcon id={id} size={16} /> Engineering skills
					</p>
					<h2>{w.skills}</h2>
					<div className="world-skills-grid">
						{arsenal.map((a) => (
							<details key={a.title} name="world-tools">
								<summary>
									{a.title}
									<ChevronDown size={16} />
								</summary>
								<p>{a.note}</p>
								<div className="tags">
									{a.tools.map((t) => (
										<span key={t}>{t}</span>
									))}
								</div>
								<a
									className="text-link"
									href={studyPath(id, projects[a.project].slug)}
								>
									{projects[a.project].title}
								</a>
							</details>
						))}
					</div>
				</div>
			</section>
			<section id="voyage" className="section world-history">
				<div className="wrap split">
					<div>
						<p className="eyebrow">
							<WorldIcon id={id} size={16} /> Experience
						</p>
						<h2>{w.journey}</h2>
					</div>
					<ol className="timeline">
						{milestones.map(([type, title, body]) => (
							<li key={title}>
								<p className="eyebrow">{type}</p>
								<h3>{title}</h3>
								<p>{body}</p>
							</li>
						))}
					</ol>
				</div>
			</section>
		</>
	);
}
