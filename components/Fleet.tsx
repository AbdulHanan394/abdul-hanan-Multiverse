"use client";
import { useState } from "react";
import {
	Anchor,
	BookOpen,
	Grid2X2,
	Map as MapIcon,
	MapPin,
	Ship,
} from "lucide-react";
import { projects } from "@/content/profile";
import CompassRose from "./CompassRose";
export default function Fleet() {
	const [map, setMap] = useState(false);
	return (
		<section id="fleet" className="section fleet">
			<div className="wrap">
				<div className="section-head">
					<div>
						<p className="eyebrow">
							<Anchor size={15} /> Selected expeditions
						</p>
						<h2>
							The Fleet<span className="period">.</span>
						</h2>
						<p className="deck">Four projects, each with its own course.</p>
					</div>
					<fieldset className="view-switch" aria-label="Project view">
						<button
							type="button"
							aria-pressed={!map}
							onClick={() => setMap(false)}
						>
							<Grid2X2 size={15} /> Gallery
						</button>
						<button
							type="button"
							aria-pressed={map}
							onClick={() => setMap(true)}
						>
							<MapIcon size={16} /> Chart
						</button>
					</fieldset>
				</div>
				{map ? (
					<div className="island-chart">
						<svg
							viewBox="0 0 1000 220"
							preserveAspectRatio="none"
							aria-hidden="true"
						>
							<path
								d="M100 145Q215 200 345 72T615 148T890 66"
								fill="none"
								stroke="currentColor"
								strokeDasharray="5 7"
							/>
						</svg>
						<CompassRose marked className="chart-rose" />
						{projects.map((p, i) => (
							<a
								className={`isle isle-${i}`}
								key={p.slug}
								href={`/projects/${p.slug}`}
							>
								<MapPin size={22} />
								<strong>{p.title}</strong>
								<small>{p.landmark}</small>
							</a>
						))}
					</div>
				) : (
					<div className="project-grid">
						{projects.map((p) => (
							<a
								key={p.slug}
								className="project-card"
								href={`/projects/${p.slug}`}
							>
								<div className="card-art">
									<img
										loading="lazy"
										width="836"
										height="470"
										src={`/art/${p.art}.webp`}
										alt={p.landmark}
									/>
									<span className="card-open">
										<BookOpen size={17} />
									</span>
								</div>
								<div className="card-info">
									<span className="eyebrow">{p.category}</span>
									<h3>{p.title}</h3>
									<p>{p.summary}</p>
									<span className="case-link">
										Read case study <BookOpen size={14} />
									</span>
								</div>
							</a>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
export function VoyageMapButton() {
	return (
		<button
			type="button"
			className="text-btn"
			onClick={() => window.dispatchEvent(new Event("voyage-map"))}
		>
			<Ship size={17} /> Open voyage map
		</button>
	);
}
