"use client";
import { useEffect, useState } from "react";
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Radio,
	RotateCw,
	Terminal,
} from "lucide-react";
import { projects } from "@/content/profile";
import { worlds, studyPath, cardArt, type WorldId } from "@/content/worlds";
import WorldIcon from "./WorldIcon";
import CompassRose from "../CompassRose";
const codes = ["··", "·−", "−·", "−−"];
const commands = ["core", "focus", "dispatch", "moving"];
const wavelengths = [
	"428 nm · violet",
	"486 nm · blue",
	"558 nm · green",
	"630 nm · red",
];
function Scope({
	id,
	index,
	value,
	scan,
}: {
	id: WorldId;
	index: number;
	value: number;
	scan: number;
}) {
	const p = projects[index];
	if (id === "marvel")
		return (
			<div key={index} className="comic-frame">
				<img src={cardArt(id, p.art)} alt="" />
				<b>{["RECALL!", "FOCUS!", "DISPATCH!", "MOVE!"][index]}</b>
				<small>{String(index + 1).padStart(2, "0")} / 04</small>
			</div>
		);
	if (id === "neon")
		return (
			<div className="term-display">
				<span>AH / NETWORK SHELL</span>
				<code>
					&gt; inspect {commands[index]}
					<br />
					<em>OK</em> {p.title}
					<br />
					{p.stack.slice(0, 3).join(" · ")}
					<i>▍</i>
				</code>
			</div>
		);
	if (id === "corsair")
		return (
			<div className="helm-face">
				<div style={{ transform: `rotate(${value}deg)` }}>
					<CompassRose marked />
				</div>
				<span>{String(value).padStart(3, "0")}°</span>
			</div>
		);
	if (id === "alpine")
		return (
			<svg
				viewBox="0 0 260 115"
				aria-hidden="true"
				className="instrument-diagram"
			>
				<defs>
					<linearGradient id="spectrum">
						<stop stopColor="#a595fc" />
						<stop offset=".32" stopColor="#5bceff" />
						<stop offset=".68" stopColor="#86efaf" />
						<stop offset="1" stopColor="#ff9e87" />
					</linearGradient>
				</defs>
				{Array.from({ length: 22 }, (_, i) => i * 11).map((x) => (
					<path
						key={x}
						d={`M${9 + x} 90 Q${30 + x} ${26 + 20 * Math.sin(x * 0.08 + value * 0.02)} ${x + 9} 12`}
						stroke="url(#spectrum)"
						fill="none"
						strokeWidth="4"
						opacity={0.35 + 0.6 * Math.abs(Math.sin(x * 0.01 + value * 0.02))}
					/>
				))}
				<path
					d={`M${12 + value * 2.32} 4v99`}
					stroke="white"
					strokeDasharray="2 3"
				/>
			</svg>
		);
	if (id === "frontier")
		return (
			<svg
				className="instrument-diagram"
				viewBox="0 0 260 115"
				aria-hidden="true"
			>
				<g stroke="currentColor" fill="none" strokeWidth="2">
					<path d="M40 88h180l-8 11H44Z M62 87V63h22v22 M152 89V65h14v23" />
					<g key={scan} className={scan ? "key-tap" : ""}>
						<path d="m68 62 119-22 3 7L69 69Z" />
						<ellipse cx="190" cy="37" rx="20" ry="7" fill="currentColor" />
					</g>
					<circle cx="76" cy="65" r="5" />
					<path d="m150 75 5-3 5 3 5-3 5 3" />
				</g>
			</svg>
		);
	if (id === "clockwork")
		return (
			<svg
				className="instrument-diagram"
				viewBox="0 0 260 115"
				aria-hidden="true"
			>
				{[
					[95, 60, 42, 1],
					[160, 64, 25, -1],
					[184, 36, 13, 1],
				].map(([x, y, r, dir]) => (
					<g key={x} transform={`translate(${x} ${y})`}>
						<g
							style={{
								transform: `rotate(${value * dir}deg)`,
								transition: "transform .6s cubic-bezier(.2,.8,.2,1)",
							}}
							stroke="currentColor"
							fill="none"
						>
							<circle r={r} strokeWidth="4" strokeDasharray="5 3" />
							<circle r={r * 0.82} />
							<circle r={r * 0.2} />
							{[0, 60, 120].map((a) => (
								<path
									key={a}
									d={`M${-r * 0.77} 0H${r * 0.77}`}
									transform={`rotate(${a})`}
									strokeWidth="4"
								/>
							))}
						</g>
					</g>
				))}
			</svg>
		);
	if (id === "orbital")
		return (
			<svg
				className="instrument-diagram"
				viewBox="0 0 260 115"
				aria-hidden="true"
			>
				<g
					transform="translate(130 58) rotate(-14)"
					fill="none"
					stroke="currentColor"
				>
					{[30, 48, 68, 91].map((r, i) => (
						<ellipse
							key={r}
							rx={r}
							ry={r * 0.43}
							opacity={i === index ? 1 : 0.28}
							strokeDasharray={i === index ? "3 2" : undefined}
						/>
					))}
					<circle r="10" fill="currentColor" />
					<g
						className="orbital-marker"
						style={{ transform: `translate(${[30, 48, 68, 91][index]}px,0px)` }}
					>
						<rect x="-4" y="-4" width="8" height="8" fill="#fff" />
						<path d="M-12 -2h6v4h-6ZM6-2h6v4H6Z" />
					</g>
				</g>
			</svg>
		);
	return (
		<svg
			className="instrument-diagram sonar-screen"
			viewBox="0 0 260 115"
			aria-hidden="true"
		>
			<g transform="translate(130 58)" fill="none" stroke="currentColor">
				{[14, 27, 40, 52].map((r) => (
					<circle key={r} r={r} opacity=".32" />
				))}
				<path d="M-65 0H65M0-56V56" opacity=".35" />
				{scan > 0 && (
					<g key={scan}>
						<circle className="ping-ring" r="51" />
						{[
							[-23, -20],
							[35, -10],
							[7, 37],
							[-42, 8],
						].map(([x, y], i) => (
							<circle
								key={x}
								cx={x}
								cy={y}
								r={i === index ? 5 : 2.5}
								fill="currentColor"
							/>
						))}
					</g>
				)}
			</g>
		</svg>
	);
}
export default function Instrument({ id }: { id: WorldId }) {
	const w = worlds[id],
		[index, setIndex] = useState(0),
		[value, setValue] = useState(0),
		[code, setCode] = useState(""),
		[command, setCommand] = useState(""),
		[notice, setNotice] = useState(""),
		[scan, setScan] = useState(0),
		[received, setReceived] = useState(false);
	const [touchX, setTouchX] = useState<number | null>(null);
	useEffect(() => {
		if (code.length !== 2) return;
		const timer = setTimeout(() => setCode(""), 1200);
		return () => clearTimeout(timer);
	}, [code]);
	function wire(symbol: string) {
		const s = (code.length === 2 ? "" : code) + symbol;
		setCode(s);
		setScan((v) => v + 1);
		if (s.length === 2) {
			const n = codes.indexOf(s);
			setReceived(true);
			setIndex(n);
			setNotice("Wire received at " + w.landmarks[n] + ".");
		} else setNotice("One more symbol to route this wire.");
	}
	function run(s: string) {
		const cmd = s
			.trim()
			.toLowerCase()
			.replace(/^inspect\s+/, "");
		const n = commands.indexOf(cmd);
		if (n < 0) {
			setNotice("Available commands: " + commands.join(", ") + ".");
			return;
		}
		setIndex(n);
		setCommand("");
		setNotice("Loaded " + projects[n].title + ".");
	}
	const p = projects[index],
		range = id === "corsair" || id === "orbital" || id === "alpine";
	const unit =
		id === "corsair"
			? ["000° · north", "090° · east", "180° · south", "270° · west"][index]
			: id === "alpine"
				? wavelengths[index]
				: ["Low orbit", "Inner transfer", "High orbit", "Outer transfer"][
						index
					];
	function step(n: number) {
		setIndex((index + n + 4) % 4);
		setValue((v) => v + n * 90);
	}
	const locked = (id === "abyss" && !scan) || (id === "frontier" && !received);
	return (
		<section id="instrument" className={`instrument-lab lab-${id}`}>
			<div className="wrap lab-grid">
				<div className="lab-editorial">
					<p className="eyebrow">
						<WorldIcon id={id} size={16} /> Interactive project finder
					</p>
					<h2>
						{w.instrument}
						<span>.</span>
					</h2>
					<p>{w.instruction}</p>
				</div>
				<div className="lab-control">
					<div
						className="lab-screen"
						onTouchStart={
							id === "marvel"
								? (e) => setTouchX(e.touches[0].clientX)
								: undefined
						}
						onTouchEnd={
							id === "marvel"
								? (e) => {
										if (touchX !== null) {
											const dx = e.changedTouches[0].clientX - touchX;
											if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
										}
										setTouchX(null);
									}
								: undefined
						}
					>
						<Scope id={id} index={index} value={value} scan={scan} />
					</div>
					{range && (
						<label className="lab-slider">
							<span>
								{id === "corsair"
									? "Bearing"
									: id === "alpine"
										? "Wavelength"
										: "Orbital radius"}
								<output>{unit}</output>
							</span>
							<input
								aria-label={
									id === "corsair"
										? "Helm bearing"
										: id === "alpine"
											? "Aurora wavelength"
											: "Orbital radius"
								}
								type="range"
								min="0"
								max={id === "corsair" ? 359 : 99}
								value={value}
								onChange={(e) => {
									const v = Number(e.target.value);
									setValue(v);
									setIndex(
										Math.min(3, Math.floor(v / (id === "corsair" ? 90 : 25))),
									);
								}}
							/>
						</label>
					)}
					{id === "frontier" && (
						<>
							<div className="lab-buttons">
								<button type="button" onClick={() => wire("·")}>
									· Dot
								</button>
								<button type="button" onClick={() => wire("−")}>
									− Dash
								</button>
								<output aria-label="Telegraph message">
									{code || "＿ ＿"}
								</output>
							</div>
							<small className="keylegend">
								{codes.map((c, i) => (
									<span key={c}>
										{c} {projects[i].title.split(" ")[0]}
									</span>
								))}
							</small>
						</>
					)}
					{id === "marvel" && (
						<div className="lab-buttons">
							<button type="button" onClick={() => step(-1)}>
								<ChevronLeft size={15} /> Previous panel
							</button>
							<button type="button" onClick={() => step(1)}>
								Next panel
								<ChevronRight size={15} />
							</button>
						</div>
					)}
					{id === "neon" && (
						<>
							<form
								className="terminal-input"
								onSubmit={(e) => {
									e.preventDefault();
									run(command);
								}}
							>
								<Terminal size={16} />
								<input
									aria-label="Project command"
									value={command}
									onChange={(e) => setCommand(e.target.value)}
									placeholder="inspect core"
									maxLength={40}
								/>
								<button type="submit">Run</button>
							</form>
							<div className="command-keys">
								{commands.map((c) => (
									<button key={c} type="button" onClick={() => run(c)}>
										{c}
									</button>
								))}
							</div>
						</>
					)}
					{id === "abyss" && (
						<>
							<div className="lab-buttons">
								<button
									type="button"
									onClick={() => {
										setScan((v) => v + 1);
										setNotice("Four echoes detected. Select a signal.");
									}}
								>
									<Radio size={16} /> Send ping
								</button>
							</div>
							{scan > 0 && (
								<div className="command-keys">
									{projects.map((project, i) => (
										<button
											type="button"
											key={project.slug}
											aria-pressed={index === i}
											onClick={() => {
												setIndex(i);
												setNotice("Signal identified.");
											}}
										>
											Echo {i + 1}
										</button>
									))}
								</div>
							)}
						</>
					)}
					{id === "clockwork" && (
						<div className="lab-buttons">
							<button type="button" onClick={() => step(-1)}>
								Rewind
							</button>
							<button type="button" onClick={() => step(1)}>
								<RotateCw size={16} /> Wind crown
							</button>
						</div>
					)}
					<p className="lab-status" role="status">
						{notice}
					</p>
				</div>
				<div className="lab-result" aria-live="polite">
					{locked ? (
						<>
							<WorldIcon id={id} size={34} />
							<h3>
								{id === "abyss" ? "Listening for echoes" : "Waiting for a wire"}
							</h3>
						</>
					) : (
						<>
							<span className="eyebrow">{w.landmarks[index]}</span>
							<h3>{p.title}</h3>
							<p>{p.summary}</p>
							<a className="text-link" href={studyPath(id, p.slug)}>
								<BookOpen size={14} /> Read case study
							</a>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
