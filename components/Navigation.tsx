"use client";
import { useEffect, useRef, useState } from "react";
import {
	Bird,
	X,
	Menu,
	Map as MapIcon,
	Sailboat,
	Settings2,
} from "lucide-react";
import { WorldSwitcher } from "./worlds/WorldAtlas";
import WorldIcon from "./worlds/WorldIcon";
import { worldPath, worlds, type WorldId } from "@/content/worlds";
import { destinations as compassDestinations } from "@/content/profile";
import RouteChart from "./RouteChart";
import CompassRose from "./CompassRose";
export type Quality = "Ultra" | "Balanced" | "Lightweight";
export function Navigation({ world = "corsair" }: { world?: WorldId }) {
	const w = worlds[world],
		base = worldPath(world);
	const menu: [string, string][] =
		world !== "corsair"
			? [
					["fleet", "Projects"],
					["captain", "About me"],
					["arsenal", "Skills"],
					["voyage", "Experience"],
				]
			: [
					["fleet", w.projects],
					["captain", w.about],
					["arsenal", w.skills],
					["voyage", w.journey],
				];
	const destinations: ReadonlyArray<readonly [string, string]> =
		world === "corsair"
			? compassDestinations
			: [
					["arrival", "Arrival"],
					...menu,
					["instrument", w.instrument],
					["play", "Arcade"],
					["chronicle", "Activity"],
					["oracle", "Ask about Abdul"],
					["contact", "Contact Abdul"],
					["worlds", "World selection"],
				];
	const [active, setActive] = useState("arrival"),
		[mode, setMode] = useState<"map" | "menu">("map"),
		[quality, setQuality] = useState<Quality>("Balanced"),
		[cursor, setCursor] = useState(false);
	const dialog = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		function detect() {
			const motion = matchMedia("(prefers-reduced-motion: reduce)").matches;
			let q: Quality =
				motion || innerWidth < 650 || navigator.hardwareConcurrency < 4
					? "Lightweight"
					: "Balanced";
			let c = false;
			try {
				const saved = localStorage.getItem("corsair-quality");
				if (
					saved === "Ultra" ||
					saved === "Balanced" ||
					saved === "Lightweight"
				)
					q = saved;
				c = localStorage.getItem("corsair-cursor") === "on";
			} catch {}
			document.documentElement.dataset.quality = q;
			setQuality(q);
			setCursor(c);
		}
		detect();
		const onScroll = () => {
			let current = "arrival";
			for (const s of document.querySelectorAll<HTMLElement>(
				"main section[id]",
			)) {
				const id = s.id;

				if (s && s.getBoundingClientRect().top < innerHeight * 0.45)
					current = id;
			}
			setActive(current);
		};
		const open = () => {
			setMode("map");
			dialog.current?.showModal();
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("voyage-map", open);
		onScroll();
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("voyage-map", open);
		};
	}, []);
	useEffect(() => {
		if (!cursor || !matchMedia("(pointer:fine)").matches) return;
		const el = document.createElement("span");
		el.className = "pointer-ring";
		document.body.append(el);
		const move = (e: PointerEvent) => {
			el.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
			el.dataset.over = String(
				!!(e.target as Element)?.closest?.("a,button,input,select,textarea"),
			);
		};
		window.addEventListener("pointermove", move);
		return () => {
			el.remove();
			window.removeEventListener("pointermove", move);
		};
	}, [cursor]);
	function choose(q: Quality) {
		setQuality(q);
		document.documentElement.dataset.quality = q;
		try {
			localStorage.setItem("corsair-quality", q);
		} catch {}
	}
	const sectionHref = (id: string) => base + "#" + id;
	return (
		<>
			<header className="main-nav">
				<div className="wrap nav-inner">
					<a href={sectionHref("arrival")} className="brand">
						{world === "corsair" ? <CompassRose /> : <WorldIcon id={world} />}
						<span>{world === "corsair" ? w.name : "Abdul Hanan"}</span>
					</a>
					<nav className="desktop-nav" aria-label="Main navigation">
						{menu.map(([id, name]) => (
							<a
								href={sectionHref(id)}
								key={id}
								aria-current={active === id ? "location" : undefined}
							>
								{name}
							</a>
						))}
					</nav>
					<WorldSwitcher current={world} />
					<a className="nav-contact" href={sectionHref("contact")}>
						{world === "corsair" ? (
							<Bird size={16} />
						) : (
							<WorldIcon id={world} size={16} />
						)}{" "}
						{world === "corsair" ? w.contact : "Contact Abdul"}
					</a>
					<button
						type="button"
						className="mobile-menu icon-btn"
						aria-label="Open navigation"
						onClick={() => {
							setMode("menu");
							dialog.current?.showModal();
						}}
					>
						<Menu />
					</button>
				</div>
			</header>
			<dialog
				ref={dialog}
				className="chart-dialog"
				aria-label={mode === "map" ? "Voyage map" : "Navigation menu"}
			>
				<div className="dialog-contents">
					<button
						type="button"
						aria-label="Close navigation"
						className="close icon-btn"
						onClick={() => dialog.current?.close()}
					>
						<X />
					</button>
					<p className="eyebrow">
						<MapIcon size={15} /> Navigation chart
					</p>
					<h2>
						{world !== "corsair"
							? w.name
							: mode === "menu"
								? "Set your course"
								: "The Voyage Map"}
					</h2>
					{mode === "map" && world === "corsair" && (
						<RouteChart active={active} close={() => dialog.current?.close()} />
					)}
					<ol className="map-routes">
						{destinations.map(([id, name], i) => (
							<li
								key={id}
								data-passed={i <= destinations.findIndex(([k]) => k === active)}
							>
								<a
									aria-current={id === active ? "location" : undefined}
									href={sectionHref(id)}
									onClick={() => dialog.current?.close()}
								>
									{id === active ? (
										<Sailboat size={20} />
									) : (
										<span className="map-dot" />
									)}
									{name}
								</a>
							</li>
						))}
					</ol>
					<label className="preferences">
						<Settings2 size={17} /> Scene quality
						<select
							value={quality}
							onChange={(e) => choose(e.target.value as Quality)}
						>
							{["Ultra", "Balanced", "Lightweight"].map((q) => (
								<option key={q}>{q}</option>
							))}
						</select>
					</label>
					<label className="cursor-pref">
						<input
							type="checkbox"
							checked={cursor}
							onChange={(e) => {
								setCursor(e.target.checked);
								try {
									localStorage.setItem(
										"corsair-cursor",
										e.target.checked ? "on" : "off",
									);
								} catch {}
							}}
						/>{" "}
						Brass cursor accent
					</label>
				</div>
			</dialog>
		</>
	);
}
