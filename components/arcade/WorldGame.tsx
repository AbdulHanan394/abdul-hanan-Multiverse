"use client";
import { useRef, useState } from "react";
import { Gamepad2, RotateCcw, Trophy, Play, Flag } from "lucide-react";
import {
	worldArt,
	worlds,
	worldIds,
	worldPath,
	type WorldId,
} from "@/content/worlds";
import { Corsair, Orbital, Abyss, Clockwork, Alpine } from "./TacticalGames";
import { Frontier, Marvel, Neon } from "./ActionGames";
import { games, type Result } from "./catalog";

const players = {
	corsair: Corsair,
	orbital: Orbital,
	frontier: Frontier,
	marvel: Marvel,
	neon: Neon,
	abyss: Abyss,
	clockwork: Clockwork,
	alpine: Alpine,
};
export default function WorldGame({ id }: { id: WorldId }) {
	const game = games[id],
		Player = players[id],
		next = worldIds[(worldIds.indexOf(id) + 1) % worldIds.length];
	const [round, setRound] = useState(0),
		[result, setResult] = useState<Result | null>(null);
	const heading = useRef<HTMLHeadingElement>(null);
	function start() {
		setResult(null);
		setRound(round + 1);
		heading.current?.focus({ preventScroll: true });
	}
	return (
		<section
			id="play"
			className="section arcade-section"
			aria-labelledby="game-title"
		>
			<div className="wrap arcade-layout">
				<div className="arcade-copy">
					<p className="eyebrow">
						<Gamepad2 size={18} /> {worlds[id].short} arcade
					</p>
					<h2 id="game-title" ref={heading} tabIndex={-1}>
						{game.name}
					</h2>
					<p className="arcade-pitch">{game.pitch}</p>
					<p className="arcade-rules">{game.rules}</p>
					<a className="text-link" href={worldPath(next) + "#play"}>
						Next game · {games[next].name}
					</a>
				</div>
				<div className="arcade-console" data-game={id}>
					<div className="console-top">
						<span>
							<Gamepad2 size={17} /> {game.genre}
						</span>
						{round > 0 && !result && (
							<button onClick={start}>
								<RotateCcw size={15} /> Restart
							</button>
						)}
					</div>
					{!round || result ? (
						<div
							className="game-cover"
							style={{
								backgroundImage: `linear-gradient(0deg, rgba(4,9,13,.96),rgba(4,9,13,.25)),url("${worldArt(id)}")`,
							}}
						>
							<div role="status">
								{result ? result.won ? <Trophy /> : <Flag /> : <Gamepad2 />}
								<h3>
									{result
										? result.won
											? "Challenge complete"
											: "Run ended"
										: game.name}
								</h3>
								{result && <p>{result.message}</p>}
							</div>
							<button className="btn primary" onClick={start}>
								<Play size={16} />
								{result ? "Play again" : "Start game"}
							</button>
						</div>
					) : (
						<div className="game-live">
							<Player key={round} finish={setResult} />
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
