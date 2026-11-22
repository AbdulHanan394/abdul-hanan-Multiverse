"use client";
import { Gamepad2, Github, MapPin, Mail } from "lucide-react";
import { socials, projects } from "@/content/profile";
import { editions } from "@/content/worlds/editions";
import { useEffect, useState } from "react";
import { Pause, Play, Layers, BookOpen } from "lucide-react";
import { worldArt, worlds, type WorldId } from "@/content/worlds";
import WorldIcon from "./WorldIcon";
import SceneCanvas from "./SceneCanvas";
export default function WorldHero({ id }: { id: Exclude<WorldId, "corsair"> }) {
	const w = worlds[id],
		edition = editions[id],
		featured = projects.find((p) => p.slug === edition.featured)!,
		[paused, setPaused] = useState(false),
		[pulse, setPulse] = useState(0),
		[fired, setFired] = useState(false);
	useEffect(() => {
		try {
			setPaused(
				localStorage.getItem("world-motion") === "paused" ||
					matchMedia("(prefers-reduced-motion:reduce)").matches,
			);
		} catch {}
	}, []);
	useEffect(() => {
		if (!pulse) return;
		setFired(true);
		const end = setTimeout(() => setFired(false), 1900);
		return () => clearTimeout(end);
	}, [pulse]);
	function toggle() {
		const next = !paused;
		setPaused(next);
		try {
			localStorage.setItem("world-motion", next ? "paused" : "on");
		} catch {}
	}
	return (
		<section
			className={`edition-hero ${paused ? "still" : ""} ${fired ? "fired" : ""}`}
			id="arrival"
			aria-label={w.name}
		>
			<div className="edition-stage" aria-hidden="true">
				<img
					className="scene-plate"
					src={worldArt(id)}
					alt=""
					fetchPriority="high"
				/>
				<div className="scene-scrim" />
				<SceneCanvas id={id} paused={paused} pulse={pulse} />
				<div className="scene-engraving" />
				{fired && !paused && (
					<div key={pulse} className="scene-burst">
						{id === "marvel" ? <b>THWIP!</b> : null}
					</div>
				)}
			</div>
			<div className="wrap scene-copy">
				<p className="scene-kicker">
					<WorldIcon id={id} size={17} /> {w.name} <i /> Developer portfolio
				</p>
				<h1 className="edition-name">
					Abdul <span>Hanan</span>
				</h1>
				<p className="edition-role">Full-stack developer &amp; AI engineer</p>
				<p className="scene-line">{edition.intro}</p>
				<div className="scene-actions">
					<a className="btn primary" href="#fleet">
						<BookOpen size={16} /> Explore my work
					</a>
					<a className="btn ghost" href="#contact">
						<Mail size={16} /> Contact me
					</a>
				</div>
			</div>
			<div className="hero-project-slip">
				<a href={"#demo-" + featured.slug}>
					<span className="slip-art">
						<img src={`/worlds/${id}-${featured.art}.webp`} alt="" />
					</span>
					<span>
						<small>Inside my work</small>
						<strong>{featured.title}</strong>
						<em>Try project demo</em>
					</span>
				</a>
			</div>
			<div className="scene-bar">
				<div className="wrap">
					<span className="scene-location">
						<MapPin size={15} />
						Lahore, Pakistan
					</span>
					<a className="scene-social" href={socials.GitHub}>
						<Github size={15} /> GitHub
					</a>
					<a href="#play">
						<Gamepad2 size={15} /> Arcade
					</a>
					<a href="#worlds">
						<Layers size={15} /> Change world
					</a>
					<button
						type="button"
						aria-pressed={fired}
						onClick={() => setPulse((v) => v + 1)}
					>
						<WorldIcon id={id} size={16} />
						{fired ? (paused ? "Signal received" : "Effect active") : w.effect}
					</button>
					<button
						type="button"
						aria-label={paused ? "Play scene motion" : "Pause scene motion"}
						onClick={toggle}
					>
						{paused ? <Play size={15} /> : <Pause size={15} />}
					</button>
				</div>
			</div>
		</section>
	);
}
