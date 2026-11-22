"use client";
import { useEffect, useRef } from "react";
// The original plate supplies the ship and sky. Distort only the water and the
// neighborhood of the hull, leaving the horizon and the text overlay stable.
const vertex =
	"attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}";
const fragment = `
precision mediump float;
varying vec2 uv;
uniform sampler2D plate;
uniform vec2 crop;
uniform float time;
void main(){
 vec2 source=vec2(uv.x,1.-uv.y)*crop+(1.-crop)*vec2(.5,.44);
 float water=smoothstep(.72,.98,source.y);
 float ship=smoothstep(.62,.81,source.x)*(1.-smoothstep(.70,.82,source.y));
 source.x+=water*(.0014*sin(source.y*92.-time*.74)+.0007*sin(source.x*28.+time*.32));
 source.y+=water*.0018*sin(source.x*47.-time*.54)+ship*.0017*sin(time*.55);
 gl_FragColor=texture2D(plate,clamp(source,.001,.999));
}`;
export default function SeaSurface() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const motion = matchMedia("(prefers-reduced-motion:reduce)"),
			mobile = matchMedia("(max-width:600px)");
		let visible = false,
			stop: (() => void) | undefined;
		function start() {
			if (!canvas) return;
			const gl = canvas.getContext("webgl", {
				alpha: false,
				antialias: false,
				powerPreference: "low-power",
				preserveDrawingBuffer: false,
			});
			if (!gl) return;
			const program = gl.createProgram(),
				buffer = gl.createBuffer(),
				texture = gl.createTexture();
			if (!program || !buffer || !texture) return;
			const shaders: WebGLShader[] = [];
			for (const [type, source] of [
				[gl.VERTEX_SHADER, vertex],
				[gl.FRAGMENT_SHADER, fragment],
			] as const) {
				const shader = gl.createShader(type);
				if (shader) {
					gl.shaderSource(shader, source);
					gl.compileShader(shader);
					gl.attachShader(program, shader);
					shaders.push(shader);
				}
			}
			gl.linkProgram(program);
			let frame = 0,
				live = true,
				last = -100;
			const dispose = () => {
				live = false;
				cancelAnimationFrame(frame);
				canvas.style.opacity = "0";
				gl.deleteTexture(texture);
				gl.deleteBuffer(buffer);
				gl.deleteProgram(program);
				for (const shader of shaders) gl.deleteShader(shader);
			};
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				dispose();
				return;
			}
			// biome-ignore lint/correctness/useHookAtTopLevel: WebGL context method, independent of React hooks.
			gl.useProgram(program);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
				gl.STATIC_DRAW,
			);
			const pos = gl.getAttribLocation(program, "p");
			gl.enableVertexAttribArray(pos);
			gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			for (const v of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T])
				gl.texParameteri(gl.TEXTURE_2D, v, gl.CLAMP_TO_EDGE);
			for (const v of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER])
				gl.texParameteri(gl.TEXTURE_2D, v, gl.LINEAR);
			const t = gl.getUniformLocation(program, "time"),
				crop = gl.getUniformLocation(program, "crop"),
				img = new Image();
			const resize = () => {
				const scale = Math.min(
					1.4,
					devicePixelRatio,
					1800 / canvas.clientWidth,
				);
				canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
				canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
				gl.viewport(0, 0, canvas.width, canvas.height);
				const ratio =
					canvas.width / canvas.height / (img.naturalWidth / img.naturalHeight);
				gl.uniform2f(crop, Math.min(1, ratio), Math.min(1, 1 / ratio));
			};
			const ro = new ResizeObserver(() => {
				if (live && img.complete && img.naturalWidth) resize();
			});
			const draw = (now: number) => {
				if (!live) return;
				if (now - last >= 40) {
					gl.uniform1f(t, (now / 1000) % 6000);
					gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
					canvas.style.opacity = "1";
					last = now;
				}
				frame = requestAnimationFrame(draw);
			};
			img.onload = () => {
				if (!live) return;
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
				resize();
				ro.observe(canvas);
				frame = requestAnimationFrame(draw);
			};
			img.src = "/art/hero.webp";
			return () => {
				ro.disconnect();
				img.onload = null;
				dispose();
			};
		}
		function sync() {
			const run =
				visible &&
				!document.hidden &&
				!mobile.matches &&
				!motion.matches &&
				document.documentElement.dataset.quality !== "Lightweight";
			if (run && !stop) stop = start();
			else if (!run && stop) {
				stop();
				stop = undefined;
			}
		}
		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			sync();
		});
		observer.observe(canvas);
		const quality = new MutationObserver(sync);
		quality.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-quality"],
		});
		motion.addEventListener("change", sync);
		mobile.addEventListener("change", sync);
		document.addEventListener("visibilitychange", sync);
		return () => {
			observer.disconnect();
			quality.disconnect();
			motion.removeEventListener("change", sync);
			mobile.removeEventListener("change", sync);
			document.removeEventListener("visibilitychange", sync);
			stop?.();
		};
	}, []);
	return <canvas ref={ref} className="sea-surface" />;
}
