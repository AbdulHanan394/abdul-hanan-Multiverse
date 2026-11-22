"use client";
import { Gamepad2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	Anchor,
	Compass,
	Map as MapIcon,
	ChevronDown,
	Volume2,
	VolumeX,
	Navigation2,
} from "lucide-react";
import { Wind } from "lucide-react";
import SceneCanvas from "./worlds/SceneCanvas";
import SeaSurface from "./SeaSurface";
import CompassRose from "./CompassRose";
export default function Hero() {
	const root = useRef<HTMLElement>(null),
		audio = useRef<AudioContext | null>(null);
	const [sound, setSound] = useState(false),
		[intro, setIntro] = useState(false),
		[secret, setSecret] = useState(false);
	const clicks = useRef(0);
	const [gust, setGust] = useState(0);
	useEffect(() => {
		if (!gust) return;
		const timer = setTimeout(() => setGust(0), 2000);
		return () => clearTimeout(timer);
	}, [gust]);
	useEffect(() => {
		if (
			!root.current ||
			matchMedia("(prefers-reduced-motion:reduce)").matches ||
			document.documentElement.dataset.quality === "Lightweight"
		)
			return;
		let alive = true;
		let cleanup = () => {};
		void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
			([{ gsap }, { ScrollTrigger }]) => {
				if (!alive) return;
				gsap.registerPlugin(ScrollTrigger);
				const ctx = gsap.context(() => {
					const sky = gsap.matchMedia();
					sky.add("(prefers-reduced-motion: no-preference)", () => {
						gsap.to(".hero-art", {
							yPercent: 5,
							ease: "none",
							scrollTrigger: {
								trigger: root.current,
								start: "top top",
								end: "bottom top",
								scrub: true,
							},
						});
						gsap.to(".rose-turn", {
							rotation: 40,
							ease: "none",
							scrollTrigger: {
								trigger: root.current,
								start: "top top",
								end: "bottom top",
								scrub: true,
							},
						});
					});
				}, root);
				cleanup = () => ctx.revert();
			},
		);
		setIntro(true);
		const t = setTimeout(() => setIntro(false), 1500);
		return () => {
			alive = false;
			cleanup();
			clearTimeout(t);
		};
	}, []);
	useEffect(
		() => () => {
			void audio.current?.close();
		},
		[],
	);
	async function toggleSound() {
		if (audio.current) {
			void audio.current.close();
			audio.current = null;
			setSound(false);
			return;
		}
		try {
			const ac = new AudioContext();
			audio.current = ac;
			await ac.resume();
			const duration = ac.sampleRate * 5,
				buffer = ac.createBuffer(1, duration, ac.sampleRate),
				samples = buffer.getChannelData(0);
			let previous = 0;
			for (let i = 0; i < duration; i++) {
				previous = (previous + 0.022 * (Math.random() * 2 - 1)) / 1.022;
				samples[i] = previous * 2.4;
			}
			const noise = ac.createBufferSource();
			noise.buffer = buffer;
			noise.loop = true;
			const filter = ac.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.value = 650;
			const gain = ac.createGain();
			gain.gain.value = 0.19;
			noise.connect(filter).connect(gain).connect(ac.destination);
			noise.start();
			setSound(true);
		} catch {
			void audio.current?.close();
			audio.current = null;
			setSound(false);
		}
	}
	return (
		<section
			id="arrival"
			ref={root}
			className={`hero ${intro ? "introducing" : ""}`}
			aria-label="Arrival"
		>
			<div aria-hidden="true" className="hero-art">
				<SeaSurface />
			</div>
			{intro && (
				<div className="arrival-veil" aria-hidden="true">
					<CompassRose />
				</div>
			)}
			<div className="hero-shade" />
			{gust > 0 && (
				<div className="corsair-gust" aria-hidden="true">
					<SceneCanvas id="corsair" paused={false} pulse={gust} />
				</div>
			)}
			<div className="mist" />
			<div className="wrap hero-inner">
				<div className="hero-type">
					<div className="eyebrow hero-kicker">
						<span className="rule" /> Software engineer’s portfolio
					</div>
					<h1>
						Abdul Hanan<span>The Code Corsair</span>
					</h1>
					<p className="hero-motto">
						Charting the Unknown. Engineering the Impossible.
					</p>
					<p className="roleline">
						Full Stack Engineer <b>·</b> AI Systems Architect <b>·</b> Builder
						of Digital Worlds
					</p>
					<div className="actions">
						<a className="btn primary" href="#voyage">
							<Compass size={17} /> Explore My Voyage
						</a>
						<a className="btn ghost" href="#fleet">
							<Anchor size={17} /> Discover My Work
						</a>
						<a className="btn ghost" href="#play">
							<Gamepad2 size={17} /> Play the game
						</a>
					</div>
				</div>
				<button
					type="button"
					aria-label="Explore the compass rose"
					title="Explore the compass rose"
					className="hero-rose"
					onClick={() => {
						clicks.current++;
						if (clicks.current % 3 === 0) setSecret((v) => !v);
					}}
				>
					<CompassRose marked className="rose-turn" />
				</button>
				{secret && (
					<p className="secret" role="status">
						Captain’s note · Trace the request from interface to data.
					</p>
				)}
				{intro && (
					<button
						type="button"
						className="skip-intro"
						onClick={() => setIntro(false)}
					>
						Skip intro
					</button>
				)}
			</div>
			<div className="hero-hud">
				<div className="wrap hud-inner">
					<span className="coordinate">
						<Navigation2 size={13} /> Lahore · 31°31′ N, 74°21′ E
					</span>
					<a className="scroll-label" href="#fleet">
						<ChevronDown size={14} /> Scroll to explore
					</a>
					<div className="hud-controls">
						<button type="button" onClick={() => setGust((v) => v + 1)}>
							<Wind size={15} />
							{gust ? "Full sail" : "Catch the wind"}
						</button>
						<button
							type="button"
							onClick={() => window.dispatchEvent(new Event("voyage-map"))}
						>
							<MapIcon size={15} /> Voyage map
						</button>
						<button
							type="button"
							aria-label={
								sound ? "Mute ocean ambience" : "Enable ocean ambience"
							}
							aria-pressed={sound}
							onClick={toggleSound}
						>
							{sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
