import { useEffect, useRef, useState } from "react";
import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	Bell,
	Mail,
	Pause,
	Play,
	Zap,
} from "lucide-react";
import { randomInt, type GameProps } from "./catalog";

const stations = ["Coyote Creek", "Sundown Mesa", "Copper Gulch"];
export function Frontier({ finish }: GameProps) {
	const [station, setStation] = useState(0),
		[scores, setScores] = useState<number[]>([]),
		[early, setEarly] = useState(false),
		[phase, setPhase] = useState<"wait" | "bell" | "rest">("wait");
	const signal = useRef(0);
	useEffect(() => {
		if (phase !== "wait") return;
		const timer = setTimeout(() => {
			signal.current = performance.now();
			setPhase("bell");
		}, 1300 + randomInt(2400));
		return () => clearTimeout(timer);
	}, [phase, station]);
	function pass() {
		if (phase === "wait") {
			setEarly(true);
			return;
		}
		if (phase !== "bell") return;
		const time =
				Math.round(performance.now() - signal.current) + (early ? 1000 : 0),
			total = [...scores, time];
		setScores(total);
		if (total.length === 3)
			finish({
				won: true,
				message: `All mail delivered. Average handoff ${Math.round(total.reduce((a, b) => a + b, 0) / 3)} ms.`,
			});
		else setPhase("rest");
	}
	function next() {
		setStation(station + 1);
		setEarly(false);
		setPhase("wait");
	}
	return (
		<>
			<p className="game-readout">
				Station {station + 1}/3 · {stations[station]}
			</p>
			<div className={"telegraph " + phase} role="status">
				{phase === "rest" ? <Mail /> : <Bell />}
				<strong>
					{phase === "rest"
						? scores.at(-1) + " ms"
						: phase === "bell"
							? "BELL! Pass now"
							: "Hold for the bell…"}
				</strong>
				<span>
					{phase === "rest"
						? "Mailbag delivered"
						: early
							? "Early pass · 1 second added"
							: "Watch the station signal"}
				</span>
			</div>
			<div className="game-buttons">
				{phase === "rest" ? (
					<button onClick={next}>Ride to next station</button>
				) : (
					<button onClick={pass} disabled={early && phase === "wait"}>
						<Mail size={17} /> Pass mailbag
					</button>
				)}
			</div>
		</>
	);
}

const stories = [
	{
		title: "The runaway train",
		lines: [
			"A train races toward a broken bridge.",
			"The hero webs the first car.",
			"The web pulls taut against a tower.",
			"Passengers step off the stopped train.",
		],
	},
	{
		title: "The stolen sun",
		lines: [
			"A portal swallows the city’s sunlight.",
			"A hero follows the light through the portal.",
			"She frees the sun from its glass cage.",
			"Daylight spills back across the city.",
		],
	},
	{
		title: "The rooftop rescue",
		lines: [
			"A rooftop water tank cracks.",
			"Water pours toward a trapped courier.",
			"A shield diverts the flood into a drain.",
			"The courier crosses the dry roof.",
		],
	},
];
function shuffled(): number[] {
	const order = [0, 1, 2, 3];
	for (let i = 3; i > 0; i--) {
		const j = randomInt(i + 1);
		[order[i], order[j]] = [order[j], order[i]];
	}
	if (order.every((v, i) => v === i)) order.reverse();
	return order;
}
export function Marvel({ finish }: GameProps) {
	const [first] = useState(() => randomInt(stories.length)),
		[page, setPage] = useState(0),
		[layout, setLayout] = useState(shuffled),
		[picked, setPicked] = useState<number[]>([]),
		[mistakes, setMistakes] = useState(0),
		[note, setNote] = useState("");
	const story = stories[(first + page) % stories.length];
	function print() {
		if (picked.some((v, i) => v !== i)) {
			setMistakes(mistakes + 1);
			setNote("Continuity glitch. Remove a misplaced caption and try again.");
			return;
		}
		if (page === 2) {
			finish({
				won: true,
				message: `Three comic pages restored in ${3 + mistakes} print attempts.`,
			});
			return;
		}
		setPage(page + 1);
		setLayout(shuffled());
		setPicked([]);
		setNote("Page printed. Next rescue loaded.");
	}
	return (
		<>
			<p className="game-readout">
				Issue {page + 1}/3 · {story.title}
			</p>
			<div className="comic-strip">
				{[0, 1, 2, 3].map((i) => (
					<button
						key={i}
						disabled={picked[i] === undefined}
						aria-label={
							picked[i] === undefined
								? `Panel ${i + 1} empty`
								: `Remove panel ${i + 1}: ${story.lines[picked[i]]}`
						}
						onClick={() => {
							setPicked(picked.filter((_, k) => i !== k));
							setNote("");
						}}
					>
						<b>{i + 1}</b>
						{picked[i] === undefined ? (
							<Zap size={20} />
						) : (
							story.lines[picked[i]]
						)}
					</button>
				))}
			</div>
			<div className="caption-bank">
				{layout.map((v) => (
					<button
						key={v}
						disabled={picked.includes(v)}
						onClick={() => {
							setPicked([...picked, v]);
							setNote("");
						}}
					>
						{story.lines[v]}
					</button>
				))}
			</div>
			<p role="status" className="game-detail">
				{note || `${picked.length}/4 panels placed`}
			</p>
			<div className="game-buttons">
				<button disabled={picked.length !== 4} onClick={print}>
					Print page
				</button>
			</div>
		</>
	);
}

const width = 9;
const dirs = {
	up: [0, -1],
	down: [0, 1],
	left: [-1, 0],
	right: [1, 0],
} as const;
type Direction = keyof typeof dirs;
function newPacket(body: number[]) {
	const open = Array.from({ length: width * width }, (_, i) => i).filter(
		(i) => !body.includes(i),
	);
	return open[randomInt(open.length)];
}
export function Neon({ finish }: GameProps) {
	const initial = [38, 37, 36];
	const [body, setBody] = useState(initial),
		[packet, setPacket] = useState(() => newPacket(initial)),
		[paused, setPaused] = useState(true);
	const heading = useRef<Direction>("right"),
		queued = useRef<Direction>("right"),
		region = useRef<HTMLDivElement>(null);
	const score = body.length - 3;
	function steer(d: Direction) {
		const [x, y] = dirs[d],
			[dx, dy] = dirs[heading.current];
		if (x === -dx && y === -dy) return;
		queued.current = d;
	}
	useEffect(() => {
		const hide = () => {
			if (document.hidden) setPaused(true);
		};
		document.addEventListener("visibilitychange", hide);
		const observer =
			typeof IntersectionObserver === "undefined"
				? null
				: new IntersectionObserver((entries) => {
						if (!entries[0].isIntersecting) setPaused(true);
					});
		if (region.current) observer?.observe(region.current);
		return () => {
			document.removeEventListener("visibilitychange", hide);
			observer?.disconnect();
		};
	}, []);
	useEffect(() => {
		if (paused) return;
		const t = setTimeout(
			() => {
				const dir = queued.current;
				heading.current = dir;
				const [dx, dy] = dirs[dir],
					x = (body[0] % width) + dx,
					y = Math.floor(body[0] / width) + dy,
					next = y * width + x,
					collect = next === packet;
				if (
					x < 0 ||
					x >= width ||
					y < 0 ||
					y >= width ||
					(collect ? body : body.slice(0, -1)).includes(next)
				) {
					finish({
						won: false,
						message: `Signal lost with ${score}/5 packets delivered. Give your turns a little more room.`,
					});
					return;
				}
				const moved = [next, ...(collect ? body : body.slice(0, -1))];
				if (collect && score === 4) {
					finish({
						won: true,
						message: "All five packets reached the relay. Circuit complete.",
					});
					return;
				}
				setBody(moved);
				if (collect) setPacket(newPacket(moved));
			},
			Math.max(330, 540 - score * 35),
		);
		return () => clearTimeout(t);
	}, [body, packet, paused, score, finish]);
	const labels = {
		up: ArrowUp,
		left: ArrowLeft,
		down: ArrowDown,
		right: ArrowRight,
	};
	return (
		<div
			ref={region}
			tabIndex={-1}
			onKeyDown={(e) => {
				const map: Record<string, Direction> = {
					ArrowUp: "up",
					ArrowDown: "down",
					ArrowLeft: "left",
					ArrowRight: "right",
				};
				const dir = map[e.key];
				if (dir) {
					e.preventDefault();
					steer(dir);
				}
			}}
		>
			<p className="game-readout" role="status">
				{score}/5 packets · {paused ? "Circuit paused" : "Circuit live"}
			</p>
			<div className="circuit-grid" aria-label="Packet runner board">
				{Array.from({ length: width * width }, (_, n) => (
					<span
						key={n}
						className={
							n === body[0]
								? "runner-head"
								: body.includes(n)
									? "runner-trail"
									: n === packet
										? "packet"
										: ""
						}
					/>
				))}
			</div>
			<div className="steer-pad">
				{(Object.keys(labels) as Direction[]).map((d) => {
					const Icon = labels[d];
					return (
						<button key={d} aria-label={"Steer " + d} onClick={() => steer(d)}>
							<Icon size={18} />
						</button>
					);
				})}
				<button
					aria-label={paused ? "Run circuit" : "Pause circuit"}
					onClick={() => {
						region.current?.focus({ preventScroll: true });
						setPaused(!paused);
					}}
				>
					{paused ? <Play size={18} /> : <Pause size={18} />}
				</button>
			</div>
		</div>
	);
}
