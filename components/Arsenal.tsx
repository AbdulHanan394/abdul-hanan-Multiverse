import {
	Compass,
	Database,
	Telescope,
	Anchor,
	Wrench,
	Cog,
	ChevronDown,
} from "lucide-react";
import { arsenal, projects } from "@/content/profile";
const icons = [Compass, Cog, Database, Telescope, Anchor, Wrench];
export default function Arsenal() {
	return (
		<section id="arsenal" className="section">
			<div className="wrap split">
				<div>
					<p className="eyebrow">
						<Compass size={16} /> Engineering instruments
					</p>
					<h2>
						The Arsenal<span className="period">.</span>
					</h2>
					<p className="deck">
						The tools I use, and where they earned their place aboard.
					</p>
				</div>
				<div className="instrument-list">
					{arsenal.map((a, i) => {
						const Icon = icons[i];
						return (
							<details key={a.title} name="arsenal" open={i === 0}>
								<summary>
									<Icon size={21} />
									<span>{a.title}</span>
									<ChevronDown size={16} />
								</summary>
								<div className="instrument-body">
									<span className="eyebrow">{a.artifact}</span>
									<p>{a.note}</p>
									<div className="tags">
										{a.tools.map((t) => (
											<span key={t}>{t}</span>
										))}
									</div>
									<a
										className="text-link"
										href={`/projects/${projects[a.project].slug}`}
									>
										Aboard {projects[a.project].title}
									</a>
								</div>
							</details>
						);
					})}
				</div>
			</div>
		</section>
	);
}
