"use client";
import { useEffect, useRef } from "react";
import type { WorldId } from "@/content/worlds";
type Brush = CanvasRenderingContext2D;
const seed = (i: number) => {
	const n = Math.sin(i * 91.731 + 4.27) * 43758.34;
	return n - Math.floor(n);
};
type Frame = {
	c: Brush;
	w: number;
	h: number;
	t: number;
	boost: number;
	x: number;
	y: number;
	n: number;
};
function stroke(c: Brush, x: number, y: number, xx: number, yy: number) {
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(xx, yy);
	c.stroke();
}
function ring(c: Brush, x: number, y: number, r: number) {
	c.beginPath();
	c.arc(x, y, r, 0, Math.PI * 2);
	c.stroke();
}
function orbit({ c, w, h, t, boost, x, y, n }: Frame) {
	const ox = w * (0.73 + x * 0.1),
		oy = h * (0.43 + y * 0.09);
	c.strokeStyle = "#d3e1ff";
	for (let i = 0; i < n * 2; i++) {
		const a = seed(i) * Math.PI * 2,
			z = (seed(i + 220) + t * 0.042) % 1,
			r = z * z * w * 0.8;
		c.globalAlpha = z * (0.3 + boost * 0.68);
		const dx = Math.cos(a),
			dy = Math.sin(a);
		stroke(
			c,
			ox + dx * r,
			oy + dy * r,
			ox + dx * (r + 1 + boost * z * z * 90),
			oy + dy * (r + 1 + boost * z * z * 90),
		);
	}
}
function dust({ c, w, h, t, boost, n }: Frame) {
	for (let i = 0; i < n; i++) {
		const size = seed(i + 19);
		const px = ((seed(i) + t * (0.026 + 0.042 * size)) % 1) * w,
			py = h * (0.38 + seed(i + 41) * 0.6) + Math.sin(t + i) * 9;
		c.globalAlpha = 0.15 + size * 0.3 + boost * 0.35;
		c.strokeStyle = i % 3 ? "#eeb77d" : "#ffe6aa";
		c.lineWidth = 1 + size;
		stroke(
			c,
			px,
			py,
			px + size * (4 + boost * 49),
			py - size * (1 + boost * 5),
		);
	}
}
function comic({ c, w, h, t, boost, x, y }: Frame) {
	const ox = w * (0.75 + x * 0.03),
		oy = h * (0.4 + y * 0.04);
	for (let i = 0; i < 36; i++) {
		const a = (i * Math.PI) / 18,
			phase = Math.sin(i + t) * 0.01,
			dx = Math.cos(a + phase),
			dy = Math.sin(a + phase);
		let r = (0.45 + seed(i) * 0.3 - boost * 0.2) * h;
		c.globalAlpha = 0.035 + boost * 0.68;
		c.fillStyle = i % 3 ? "#fff4cd" : "#ffc629";
		c.beginPath();
		c.moveTo(ox + dx * r, oy + dy * r);
		c.lineTo(
			ox + dx * w - dy * (3 + boost * 15),
			oy + dy * w + dx * (3 + boost * 15),
		);
		c.lineTo(ox + dx * w + dy * 5, oy + dy * w - dx * 5);
		c.fill();
	}
}
function neon({ c, w, h, t, boost, n }: Frame) {
	c.font = "11px monospace";
	for (let i = 0; i < n; i++) {
		const px = seed(i) * w,
			py = ((seed(i + 33) + t * (0.08 + 0.06 * seed(i + 6))) % 1) * h;
		c.globalAlpha = 0.08 + seed(i + 12) * 0.23 + boost * 0.3;
		c.strokeStyle = i % 3 ? "#53fee3" : "#ff78da";
		stroke(c, px, py, px - 2, py + 8 + boost * 22);
		if (boost > 0.1 && i % 3 === 0) {
			c.fillStyle = "#79ffe4";
			c.fillText((i * 16 + Math.floor(t * 6)).toString(16).slice(-2), px, py);
		}
	}
}
function sonar({ c, w, h, t, boost, x, n }: Frame) {
	const ox = w * (0.74 + x * 0.05),
		oy = h * 0.52;
	c.strokeStyle = "#86ffdf";
	for (let i = 0; i < 4; i++) {
		const p = (t * 0.14 + i * 0.25) % 1;
		c.globalAlpha = (1 - p) * (0.09 + boost * 0.55);
		c.lineWidth = 1 + boost;
		ring(c, ox, oy, p * w * 0.55);
	}
	for (let i = 0; i < n; i++) {
		const py = (1 - ((seed(i) + t * 0.02) % 1)) * h,
			px = seed(i + 11) * w + Math.sin(t * 0.7 + i) * 8;
		c.globalAlpha = 0.12 + seed(i) * 0.35;
		c.lineWidth = 0.8;
		ring(c, px, py, 1 + seed(i + 7) * 2.8);
	}
}
function gears({ c, w, h, t, boost }: Frame) {
	for (let i = 0; i < 3; i++) {
		const r = h * (0.15 + i * 0.045),
			px = w * (0.71 + i * 0.12),
			py = h * (i === 1 ? 0.84 : 0.72);
		c.save();
		c.translate(px, py);
		c.rotate(t * (i % 2 ? -0.11 : 0.12));
		c.strokeStyle = "#f0c982";
		c.globalAlpha = 0.18 + boost * 0.48;
		ring(c, 0, 0, r * 0.94);
		ring(c, 0, 0, r * 0.78);
		ring(c, 0, 0, r * 0.2);
		for (let j = 0; j < 36; j++) {
			const a = (j * Math.PI) / 18,
				dx = Math.cos(a),
				dy = Math.sin(a);
			c.lineWidth = j % 3 ? 1 : 3;
			stroke(c, dx * r * 0.94, dy * r * 0.94, dx * r, dy * r);
			if (j % 6 === 0)
				stroke(c, dx * r * 0.22, dy * r * 0.22, dx * r * 0.78, dy * r * 0.78);
		}
		c.restore();
	}
}
function aurora({ c, w, h, t, boost, x }: Frame) {
	for (let band = 0; band < 3; band++) {
		const color = ["#62fac1", "#a3a4ff", "#63dfed"][band];
		for (let i = 0; i < 100; i++) {
			const px = (i * w) / 99,
				phase = i * 0.057 + t * 0.19 + band * 0.6 + x * 0.25,
				py =
					h *
					(0.21 +
						0.09 * Math.sin(phase) +
						0.05 * Math.sin(i * 0.052 - t * 0.18));
			c.globalAlpha =
				(0.13 + boost * 0.23) * Math.pow(Math.sin((i * Math.PI) / 100), 2);
			c.strokeStyle = color;
			c.lineWidth = Math.max(2, w / 105);
			stroke(
				c,
				px,
				py,
				px + 8,
				py - (0.05 + seed(Math.floor(i / 8) + band) * 0.09) * h * (1 + boost),
			);
		}
	}
}
function wind({ c, w, h, t, boost, n }: Frame) {
	c.strokeStyle = "#ecd29d";
	for (let i = 0; i < n; i++) {
		const px = ((seed(i) + t * 0.07) % 1) * w,
			py = h * (0.43 + seed(i + 25) * 0.55);
		c.globalAlpha = 0.08 + boost * 0.46;
		stroke(c, px, py, px + 4 + boost * 38, py - 1 - boost * 8);
	}
}
const paint = {
	orbital: orbit,
	frontier: dust,
	marvel: comic,
	neon,
	abyss: sonar,
	clockwork: gears,
	alpine: aurora,
	corsair: wind,
};
export default function SceneCanvas({
	id,
	paused,
	pulse,
}: {
	id: WorldId;
	paused: boolean;
	pulse: number;
}) {
	const ref = useRef<HTMLCanvasElement>(null),
		lastPulse = useRef(-10000);
	useEffect(() => {
		if (pulse) lastPulse.current = performance.now();
	}, [pulse]);
	useEffect(() => {
		const canvas = ref.current,
			host = canvas?.closest("section");
		if (!canvas || !host || paused) return;
		const c = canvas.getContext("2d");
		if (!c) return;
		let w = 0,
			h = 0,
			visible = false,
			frame = 0,
			previous = 0,
			time = 0,
			x = 0,
			y = 0;
		const motion = matchMedia("(prefers-reduced-motion: reduce)");
		function resize() {
			if (!canvas) return;
			const box = canvas.getBoundingClientRect(),
				dpr = Math.min(devicePixelRatio, 1.35);
			w = box.width;
			h = box.height;
			canvas.width = Math.max(1, Math.round(w * dpr));
			canvas.height = Math.max(1, Math.round(h * dpr));
			c?.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
		function draw(now: number) {
			if (!c) return;
			frame = requestAnimationFrame(draw);
			if (now - previous < 32) return;
			const boost = Math.max(0, 1 - (now - lastPulse.current) / 1900);
			time += Math.min(0.07, (now - previous) / 1000) * (1 + boost * 4);
			previous = now;
			c.clearRect(0, 0, w, h);
			c.save();
			paint[id]({ c, w, h, t: time, boost, x, y, n: w < 700 ? 22 : 48 });
			c.restore();
		}
		function sync() {
			cancelAnimationFrame(frame);
			if (visible && !motion.matches && !document.hidden) {
				previous = performance.now();
				frame = requestAnimationFrame(draw);
			} else c?.clearRect(0, 0, w, h);
		}
		const move = (e: PointerEvent) => {
			const b = host.getBoundingClientRect();
			x = (e.clientX - b.left) / b.width - 0.5;
			y = (e.clientY - b.top) / b.height - 0.5;
			host.style.setProperty("--pan-x", x * 8 + "px");
			host.style.setProperty("--pan-y", y * 6 + "px");
		};
		const ro = new ResizeObserver(resize),
			io = new IntersectionObserver(([e]) => {
				visible = e.isIntersecting;
				sync();
			});
		ro.observe(canvas);
		io.observe(canvas);
		host.addEventListener("pointermove", move);
		motion.addEventListener("change", sync);
		document.addEventListener("visibilitychange", sync);
		resize();
		return () => {
			cancelAnimationFrame(frame);
			c.clearRect(0, 0, w, h);
			ro.disconnect();
			io.disconnect();
			host.removeEventListener("pointermove", move);
			motion.removeEventListener("change", sync);
			document.removeEventListener("visibilitychange", sync);
		};
	}, [id, paused]);
	return <canvas className="world-effects" ref={ref} />;
}
