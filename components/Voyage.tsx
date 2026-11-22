import { Route, Sailboat } from "lucide-react";
import { milestones } from "@/content/profile";
import { VoyageMapButton } from "./Fleet";
export default function Voyage() {
	return (
		<section id="voyage" className="section voyage">
			<div className="wrap split">
				<div>
					<p className="eyebrow">
						<Route size={16} /> Experience
					</p>
					<h2>
						The Voyage<span className="period">.</span>
					</h2>
					<p className="deck">
						From a software engineering degree to client platforms and personal
						AI systems.
					</p>
					<VoyageMapButton />
				</div>
				<ol className="timeline">
					{milestones.map(([tag, title, body], i) => (
						<li key={title}>
							{i === 0 && <Sailboat size={18} className="route-ship" />}
							<p className="eyebrow">{tag}</p>
							<h3>{title}</h3>
							<p>{body}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
