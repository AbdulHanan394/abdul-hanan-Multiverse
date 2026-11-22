import { useState } from "react";
import {
	Anchor,
	Ship,
	Gem,
	Mountain,
	Waves,
	Radio,
	Radar,
	Orbit,
	Rocket,
	Flame,
	Snowflake,
	Flag,
	Tent,
	Cog,
} from "lucide-react";
import { randomInt, type GameProps } from "./catalog";

export function Corsair({ finish }: GameProps) {
	const [flip] = useState(() => !!randomInt(2));
	const mirror = (n: number) =>
		flip ? 5 * Math.floor(n / 5) + 4 - (n % 5) : n;
	const reefs = [1, 7, 11, 13, 16, 18].map(mirror),
		harbor = mirror(4);
	const [caches, setCaches] = useState(() => [8, 15].map(mirror)),
		[pos, setPos] = useState(() => mirror(20)),
		[turn, setTurn] = useState(0);
	function reachable(n: number) {
		return (
			Math.abs((n % 5) - (pos % 5)) +
				Math.abs(Math.floor(n / 5) - Math.floor(pos / 5)) ===
				1 && !reefs.includes(n)
		);
	}
	function sail(n: number) {
		if (!reachable(n)) return;
		const left = caches.filter((c) => c !== n);
		setCaches(left);
		setPos(n);
		setTurn(turn + 1);
		if (n === harbor && !left.length)
			finish({
				won: true,
				message: `Both caches delivered in ${turn + 1} moves.`,
			});
		else if (turn + 1 === 14)
			finish({
				won: false,
				message: "The tide covered the pass. Try a shorter course.",
			});
	}
	return (
		<>
			<p className="game-readout" role="status">
				Caches {2 - caches.length}/2 · Moves left {14 - turn}
			</p>
			<div className="sea-grid">
				{Array.from({ length: 25 }, (_, n) => {
					const reef = reefs.includes(n),
						cache = caches.includes(n);
					const Icon =
						n === pos
							? Ship
							: reef
								? Mountain
								: cache
									? Gem
									: n === harbor
										? Anchor
										: Waves;
					const label =
						n === pos
							? "your ship"
							: reef
								? "reef"
								: cache
									? "gold cache"
									: n === harbor
										? "harbor"
										: "sea";
					return (
						<button
							key={n}
							disabled={!reachable(n)}
							aria-label={`Row ${Math.floor(n / 5) + 1}, column ${(n % 5) + 1}, ${label}`}
							onClick={() => sail(n)}
							data-kind={label}
						>
							<Icon size={22} />
						</button>
					);
				})}
			</div>
		</>
	);
}

export function Orbital({ finish }: GameProps) {
	const [alt, setAlt] = useState(() => 28 + randomInt(8)),
		[speed, setSpeed] = useState(2),
		[fuel, setFuel] = useState(8);
	function step(burn: boolean) {
		if (burn && !fuel) return;
		const v = burn ? Math.max(0, speed - 1) : speed + 1,
			h = Math.max(0, alt - v);
		setAlt(h);
		setSpeed(v);
		if (burn) setFuel(fuel - 1);
		if (!h)
			finish({
				won: v <= 2,
				message:
					v <= 2
						? `Touchdown at ${v} m/s with ${fuel - Number(burn)} fuel left.`
						: `Impact at ${v} m/s. Start braking earlier on your next descent.`,
			});
	}
	return (
		<>
			<div className="moon-stage" aria-hidden="true">
				<Orbit className="moon-orbit" />
				<div className="lander" style={{ bottom: 9 + alt * 1.85 + "%" }}>
					<Rocket />
				</div>
				<span className="landing-pad" />
			</div>
			<p className="game-readout" role="status">
				{alt} m altitude · {speed} m/s down · {fuel} fuel
			</p>
			<div className="game-buttons">
				<button onClick={() => step(false)}>Coast</button>
				<button disabled={!fuel} onClick={() => step(true)}>
					<Flame size={17} /> Burn
				</button>
			</div>
		</>
	);
}

export function Abyss({ finish }: GameProps) {
	const [target] = useState(() => randomInt(25)),
		[pings, setPings] = useState<Record<number, number>>({});
	const used = Object.keys(pings).length;
	function ping(n: number) {
		if (n in pings) return;
		const d =
			Math.abs((n % 5) - (target % 5)) +
			Math.abs(Math.floor(n / 5) - Math.floor(target / 5));
		setPings({ ...pings, [n]: d });
		if (!d || used === 5)
			finish({
				won: !d,
				message: !d
					? `Recorder recovered in ${used + 1} pings.`
					: `The battery ran out. The signal was at ${String.fromCharCode(65 + Math.floor(target / 5))}${(target % 5) + 1}.`,
			});
	}
	return (
		<>
			<p className="game-readout" role="status">
				<Radio size={16} /> Sonar online · {6 - used} pings left
			</p>
			<div className="sonar-grid">
				{Array.from({ length: 25 }, (_, n) => {
					const loc =
						String.fromCharCode(65 + Math.floor(n / 5)) + ((n % 5) + 1);
					return (
						<button
							key={n}
							onClick={() => ping(n)}
							disabled={n in pings}
							aria-label={
								loc + (n in pings ? ", distance " + pings[n] : ", ping")
							}
						>
							<small>{loc}</small>
							{n in pings ? <b>{pings[n]}</b> : <Radar size={17} />}
						</button>
					);
				})}
			</div>
		</>
	);
}

const hours = ["XII", "III", "VI", "IX"];
export function Clockwork({ finish }: GameProps) {
	const [hands, setHands] = useState(() => [
			1 + randomInt(3),
			randomInt(4),
			randomInt(4),
		]),
		[turns, setTurns] = useState(0);
	function wind(i: number) {
		const next = hands.map((v, k) =>
			k === i || k === i + 1 ? (v + 1) % 4 : v,
		);
		setHands(next);
		setTurns(turns + 1);
		if (next.every((v) => v === 0))
			finish({
				won: true,
				message: `The midnight lock opened in ${turns + 1} turns.`,
			});
	}
	return (
		<>
			<p className="game-readout" role="status">
				Target XII · XII · XII　 |　 Turns {turns}
			</p>
			<div className="crown-bank">
				{hands.map((v, i) => (
					<button
						key={i}
						aria-label={`Turn crown ${i + 1}, currently ${hours[v]}`}
						onClick={() => wind(i)}
					>
						<span className="clock-face">
							<i style={{ transform: `rotate(${v * 90}deg)` }} />
						</span>
						<strong>{hours[v]}</strong>
						<span>
							<Cog size={15} /> Crown {i + 1}
						</span>
					</button>
				))}
			</div>
		</>
	);
}

export function Alpine({ finish }: GameProps) {
	const [height, setHeight] = useState(0),
		[camp, setCamp] = useState(0),
		[anchors, setAnchors] = useState(2),
		[storms, setStorms] = useState(0),
		[log, setLog] = useState("The ridge is clear.");
	function climb() {
		const roll = randomInt(6);
		if (roll < 2) {
			setStorms(storms + 1);
			setHeight(camp);
			setLog("Storm! Back to pitch " + camp + ".");
			if (storms === 2)
				finish({
					won: false,
					message: `The third storm closed the ridge. Your last anchor held at pitch ${camp}.`,
				});
		} else {
			const gain = [1, 2, 2, 3][roll - 2],
				next = Math.min(10, height + gain);
			setHeight(next);
			setLog(`Clear weather. Climbed to pitch ${next}.`);
			if (next === 10)
				finish({
					won: true,
					message: `Summit reached with ${anchors} anchors to spare and ${storms} storms weathered.`,
				});
		}
	}
	function anchor() {
		if (height <= camp || !anchors) return;
		setCamp(height);
		setAnchors(anchors - 1);
		setLog("Anchor secured at pitch " + height + ".");
	}
	return (
		<>
			<div className="ridge-stage">
				<Mountain size={108} />
				<div>
					<Flag size={19} />
					<strong>{height} / 10</strong>
					<span>pitches climbed</span>
				</div>
			</div>
			<progress max={10} value={height} aria-label="Summit progress" />
			<p className="game-readout" role="status">
				{log}
			</p>
			<p className="game-detail">
				Camp {camp} · Anchors {anchors} · Storms {storms}/3
			</p>
			<div className="game-buttons">
				<button onClick={climb}>
					<Snowflake size={16} /> Roll to climb
				</button>
				<button disabled={!anchors || height <= camp} onClick={anchor}>
					<Tent size={16} /> Set anchor
				</button>
			</div>
		</>
	);
}
