"use client";
import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Layers, Check, X } from "lucide-react";
import {
	worldIds,
	worlds,
	worldPath,
	worldArt,
	studyPath,
	type WorldId,
} from "@/content/worlds";
import WorldIcon from "./WorldIcon";
function Editions({ current, slug }: { current: WorldId; slug?: string }) {
	return worldIds.map((id) => {
		const w = worlds[id];
		return (
			<a
				key={id}
				className="edition-poster"
				aria-current={id === current ? "true" : undefined}
				href={slug ? studyPath(id, slug) : worldPath(id)}
				style={{ "--poster-accent": w.accent } as React.CSSProperties}
			>
				<img
					src={worldArt(id).replace(/([^/]+)\.webp$/, "$1-thumb.webp")}
					alt=""
					loading="lazy"
					width="430"
					height="300"
				/>
				<span className="poster-mark">
					<WorldIcon id={id} size={17} />
				</span>
				{id === current && (
					<span className="poster-current">
						<Check size={11} /> Current
					</span>
				)}
				<span className="poster-label">
					<small>{w.genre}</small>
					<strong>{w.name}</strong>
				</span>
			</a>
		);
	});
}
export function WorldSwitcher({ current }: { current: WorldId }) {
	const dialog = useRef<HTMLDialogElement>(null),
		pathname = usePathname(),
		slug = pathname.match(/\/projects\/([^/]+)\/?$/)?.[1];
	return (
		<>
			<button
				type="button"
				className="world-switch"
				aria-haspopup="dialog"
				onClick={() => dialog.current?.showModal()}
			>
				<Layers size={16} />
				<span>Worlds</span>
			</button>
			<dialog
				ref={dialog}
				className="edition-dialog"
				aria-labelledby="atlas-dialog-title"
			>
				<div className="edition-dialog-top">
					<div>
						<p className="eyebrow">
							<Layers size={14} /> Portfolio editions
						</p>
						<h2 id="atlas-dialog-title">Choose your world.</h2>
					</div>
					<button
						type="button"
						className="icon-btn"
						aria-label="Close world selector"
						onClick={() => dialog.current?.close()}
					>
						<X size={20} />
					</button>
				</div>
				<div className="edition-dialog-grid">
					<Editions current={current} slug={slug} />
				</div>
			</dialog>
		</>
	);
}
export function WorldAtlas({ current }: { current: WorldId }) {
	const track = useRef<HTMLDivElement>(null);
	const [edges, setEdges] = useState({ start: true, end: false });
	useEffect(() => {
		const el = track.current;
		if (!el) return;
		const sync = () =>
			setEdges({
				start: el.scrollLeft < 2,
				end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
			});
		const ro = new ResizeObserver(sync);
		ro.observe(el);
		el.addEventListener("scroll", sync, { passive: true });
		sync();
		return () => {
			ro.disconnect();
			el.removeEventListener("scroll", sync);
		};
	}, []);
	function move(dir: number) {
		const node = track.current;
		if (!node) return;
		node.scrollBy({
			left:
				dir *
				(node.firstElementChild?.getBoundingClientRect().width || 240) *
				2,
			behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
				? "instant"
				: "smooth",
		});
	}
	return (
		<section id="worlds" className="world-atlas">
			<div className="wrap">
				<div className="atlas-head">
					<div>
						<p className="eyebrow">
							<Layers size={15} /> Portfolio editions
						</p>
						<h2>
							Choose your world<span>.</span>
						</h2>
					</div>
					<div className="atlas-arrows">
						<button
							type="button"
							aria-label="Previous worlds"
							disabled={edges.start}
							onClick={() => move(-1)}
						>
							<ChevronLeft size={18} />
						</button>
						<button
							type="button"
							aria-label="More worlds"
							disabled={edges.end}
							onClick={() => move(1)}
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
				<div ref={track} className="edition-track">
					<Editions current={current} />
				</div>
			</div>
		</section>
	);
}
